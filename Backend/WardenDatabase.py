from base64 import b64encode
import base64
from datetime import datetime
from io import BytesIO
import pyodbc
from werkzeug.security import generate_password_hash, check_password_hash

class WardernDatabase:
    def __init__(self, server, database, username, password):
        self.conn_str = (
            f'DRIVER={{ODBC Driver 17 for SQL Server}};'
            f'SERVER={server};'
            f'DATABASE={database};'
            'Trusted_Connection=yes;'
        )
        # This will be used when DB is not local
        # self.conn_str = (
        #     f'DRIVER={{ODBC Driver 17 for SQL Server}};'
        #     f'SERVER={server};'
        #     f'DATABASE={database};'
        #     f'UID={username};'
        #     f'PWD={password}'
        # )

    def _get_connection(self):
        """Establish a database connection."""
        return pyodbc.connect(self.conn_str)
    
    
            
    def register_user(self, user_data, additional_data, user_type):
        conn = self._get_connection()
        cursor = conn.cursor()
        print(user_data)
        print(additional_data)
        try:
            cursor.execute("""
                INSERT INTO Users 
                (UserName, FirstName, LastName, Email, Password, Address, Gender, 
                PhoneNumber, NationalID, UserType, ProfilePicture) 
                OUTPUT INSERTED.UserId
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_data['userName'], 
                user_data['firstName'], 
                user_data['lastName'], 
                user_data['email'], 
                user_data['password'], 
                user_data.get('address', ''), 
                user_data['gender'], 
                user_data['phoneNumber'], 
                user_data['nationalID'], 
                user_type,
                user_data.get('profilePicture')
            ))
            
            user_id = cursor.fetchone()[0]
        
            if user_type == 'Consumer':
                cursor.execute("""
                    INSERT INTO Consumers 
                    (UserId, ConsumerType, AssociatedCompany) 
                    VALUES (?, ?, ?)
                """, (
                    user_id, 
                    additional_data['consumerType'], 
                    additional_data.get('associatedCompany', '')
                ))
            
            elif user_type == 'Agri-business':
                cursor.execute("""
                    INSERT INTO AgriBusiness 
                    (UserId, AgriBusinessName, BusinessDescription, BusinessType, BusinessRegistrationNumber) 
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    user_id, 
                    additional_data['businessName'], 
                    additional_data['businessDescription'], 
                    additional_data['businessType'], 
                    additional_data['businessRegistrationNumber']
                ))
            
            elif user_type == 'Farmer':
                cursor.execute("""
                    INSERT INTO Farmers 
                    (UserId, FarmAddress, FarmSize, Specialization, FarmYieldCapacity) 
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    user_id, 
                    additional_data['farmAddress'], 
                    additional_data.get('farmSize', 0), 
                    additional_data['specialization'], 
                    additional_data.get('farmYieldCapacity', 0)
                ))
            
            conn.commit()
            return user_id
        
        except Exception as e:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def authenticate_user(self, identifier, password):
        conn = self._get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute("""
                SELECT UserId, UserName, Password, UserType, Email 
                FROM Users 
                WHERE Email = ? OR UserName = ?
            """, (identifier, identifier))
            
            user = cursor.fetchone()
            
            if user and check_password_hash(user[2], password):
                return {
                    'userId': user[0],
                    'userName': user[1],
                    'userType': user[3],
                    'email': user[4]
                }
            return None
        finally:
            cursor.close()
            conn.close()

    def get_user_profile_picture(self, user_id):
        conn = self._get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT ProfilePicture 
                FROM Users 
                WHERE UserId = ?
            """, (user_id,))
            
            result = cursor.fetchone()
            
            if result and result[0]:
                image_binary = BytesIO(result[0])
                image_binary.seek(0)
                return image_binary
            return None
            
        finally:
            cursor.close()
            conn.close()
            
    def get_user_by_email(self, email):
        try:
            conn = self._get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Users WHERE Email = ?", (email,))
            user = cursor.fetchone()
            
            if user:
                columns = [column[0] for column in cursor.description]
                user_dict = dict(zip(columns, user))
                return user_dict
            return None

        except Exception as e:
            print(f"Database error: {str(e)}")
            raise e        
        
    def update_user_password(self, email, new_password):
        conn = self._get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("UPDATE Users SET Password = ? WHERE Email = ?", (new_password, email))
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def save_message(self, chat_id, sender_id, receiver_id, message_type, content, file_data=None, content_type=None):
        conn = self._get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO Messages (ChatID, SenderID, ReceiverID, MessageType, Content, FileData, FileContentType)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (chat_id, sender_id, receiver_id, message_type, content, file_data, content_type))
            conn.commit()
            message_id = cursor.execute("SELECT @@IDENTITY").fetchone()[0]
            
            file_url = None
            if file_data:
                file_url = f"data:{content_type};base64,{b64encode(file_data).decode()}"
            
            return {
                'messageId': int(message_id),
                'senderId': int(sender_id),
                'receiverId': int(receiver_id),
                'messageType': message_type,
                'content': content,
                'fileUrl': file_url,
                'timestamp': datetime.now().isoformat()
            }
        finally:
            cursor.close()
            conn.close()
    
    def get_user_chats(self, user_id):
        conn = self._get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT c.ChatID, c.User1ID, c.User2ID, c.CreatedAt,
                       u1.UserName as User1Name, u2.UserName as User2Name
                FROM Chat c
                JOIN Users u1 ON c.User1ID = u1.UserID
                JOIN Users u2 ON c.User2ID = u2.UserID
                WHERE c.User1ID = ? OR c.User2ID = ?
            """, (user_id, user_id))
            
            chats = []
            for row in cursor.fetchall():
                chats.append({
                    'chatId': row.ChatID,
                    'user1Id': row.User1ID,
                    'user2Id': row.User2ID,
                    'user1Name': row.User1Name,
                    'user2Name': row.User2Name,
                    'createdAt': row.CreatedAt.isoformat()
                })
            return chats
            
        finally:
            cursor.close()
            conn.close()
    
    def get_chat_messages(self, chat_id):
        conn = self._get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT MessageID, SenderID, ReceiverID, MessageType, Content, FileData, FileContentType, Time_Stamp
                FROM Messages
                WHERE ChatID = ?
                ORDER BY Time_Stamp ASC
            """, (chat_id,))
            
            messages = []
            for row in cursor.fetchall():
                file_url = None
                if row.FileData:
                    file_url = f"data:{row.FileContentType};base64,{b64encode(row.FileData).decode()}"
                    
                messages.append({
                    'messageId': row.MessageID,
                    'senderId': row.SenderID,
                    'receiverId': row.ReceiverID,
                    'messageType': row.MessageType,
                    'content': row.Content,
                    'fileUrl': file_url,
                    'timestamp': row.Time_Stamp.isoformat()
                })
            return messages
            
        finally:
            cursor.close()
            conn.close()

    def create_call(self, chat_id, caller_id, receiver_id, call_type):
        conn = self._get_connection()
        cursor = conn.cursor()
        
        try:
            # Use SCOPE_IDENTITY() to get the last inserted ID in SQL Server
            cursor.execute("""
                INSERT INTO Calls (ChatID, CallerID, ReceiverID, CallType, Status, StartTime)
                OUTPUT INSERTED.CallID
                VALUES (?, ?, ?, ?, 'initiated', CURRENT_TIMESTAMP)
            """, (chat_id, caller_id, receiver_id, call_type))
            
            # Fetch the returned CallID
            call_id = cursor.fetchone()[0]
            conn.commit()
            
            # Get the full call details
            cursor.execute("""
                SELECT CallID, ChatID, CallerID, ReceiverID, CallType, Status, StartTime
                FROM Calls
                WHERE CallID = ?
            """, (call_id,))
            
            row = cursor.fetchone()
            return {
                'callId': row[0],  # Using index instead of column name for pyodbc
                'chatId': row[1],
                'callerId': row[2],
                'receiverId': row[3],
                'callType': row[4],
                'status': row[5],
                'startTime': row[6].isoformat() if row[6] else None
            }
            
        finally:
            cursor.close()
            conn.close()

    def update_call_status(self, call_id, status):
        conn = self._get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                UPDATE Calls
                SET Status = ?
                WHERE CallID = ?
            """, (status, call_id))
            conn.commit()
            
        finally:
            cursor.close()
            conn.close()

    def end_call(self, call_id):
        conn = self._get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                UPDATE Calls
                SET Status = 'ended',
                    EndTime = CURRENT_TIMESTAMP,
                    Duration = DATEDIFF(second, StartTime, CURRENT_TIMESTAMP)
                WHERE CallID = ?
            """, (call_id,))
            conn.commit()
            
        finally:
            cursor.close()
            conn.close()      
    def get_or_create_category(self, category_name, metric_system):
        """Get existing category ID or create new one if doesn't exist"""
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                # Check if category with this metric exists
                cursor.execute("""
                    SELECT categoryID 
                    FROM Categories 
                    WHERE categoryName = ? AND metricSystem = ?
                """, (category_name, metric_system))
                
                result = cursor.fetchone()
                
                if result:
                    return result[0]
                
                # If not exists, create new category
                cursor.execute("""
                    INSERT INTO Categories (categoryName, metricSystem)
                    OUTPUT INSERTED.categoryID
                    VALUES (?, ?)
                """, (category_name, metric_system))
                
                new_id = cursor.fetchone()[0]
                conn.commit()
                return new_id
                
        except Exception as e:
            print(f"Error in get_or_create_category: {str(e)}")
            raise

    def create_product_with_item(self, product_data):
        """Create a new item and its associated product"""
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                # First get or create category
                category_id = self.get_or_create_category(
                    product_data['category'],
                    product_data['metric']
                )
                
                # Convert base64 image to binary if present
                image_binary = None
                if product_data.get('image'):
                    # Remove data:image/jpeg;base64, prefix if present
                    image_base64 = product_data['image'].split(',')[-1]
                    image_binary = base64.b64decode(image_base64)

                # Insert into Items table first
                cursor.execute("""
                    INSERT INTO Items (
                        ownerID,
                        itemName,
                        itemPrice,
                        itemDescription,
                        quantityAvailable,
                        itemImage,
                        itemRating,
                        salePercentage
                    ) 
                    OUTPUT INSERTED.itemID
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    product_data['userId'],
                    product_data['title'],
                    product_data['price'],
                    product_data['description'],
                    product_data['quantity'],
                    image_binary,
                    0,  # Initial rating
                    0   # Initial sale percentage
                ))
                
                item_id = cursor.fetchone()[0]
                
                # Insert into Products table
                cursor.execute("""
                    INSERT INTO Products (
                        productID,
                        minimumBulkAmount,
                        categoryID
                    ) 
                    VALUES (?, ?, ?)
                """, (
                    item_id,  # Using itemID as productID
                    product_data['minimumBulk'],
                    category_id
                ))
                
                conn.commit()
                return True, "Product created successfully!"
                
        except Exception as e:
            print(f"Error in create_product_with_item: {str(e)}")
            return False, str(e)  
    # Database connection class method
    def create_agribusiness_item(self, product_data):
   
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            
           
            image_binary = None
            if product_data.get('image'):
                image_base64 = product_data['image'].split(',')[-1]
                image_binary = base64.b64decode(image_base64)

            # Begin transaction
            cursor.execute("BEGIN TRANSACTION")
            
            try:
                # Insert into Items table first
                cursor.execute("""
                    INSERT INTO Items (
                        ownerID,
                        itemName,
                        itemPrice,
                        itemDescription,
                        quantityAvailable,
                        itemImage,
                        itemRating,
                        salePercentage
                    ) 
                    OUTPUT INSERTED.itemID
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    product_data['userId'],
                    product_data['title'],
                    product_data['price'],
                    product_data['description'],
                    product_data['quantityAvailable'],
                    image_binary,
                    0,  # Initial rating
                    0   # Initial sale percentage
                ))
                
                item_id = cursor.fetchone()[0]

                # Insert into specific product type table
                if product_data['productType'] == 'Machine':
                    cursor.execute("""
                        INSERT INTO Machines (
                            machineID,
                            machineType,
                            machineWeight,
                            powerSource,
                            warranty
                  
                        )
                        VALUES (?, ?, ?, ?, ?)
                    """, (
                        item_id,
                        product_data['machineType'],
                        product_data['machineWeight'],
                        product_data['powerSource'],
                        product_data['warranty']
                    ))
                
                elif product_data['productType'] == 'Chemical':
                    cursor.execute("""
                        INSERT INTO Chemicals (
                            chemicalID,
                            metricSystem,
                            quantity,
                            chemicalType,
                            expiryDate,
                            hazardLevel
                        )
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (
                        item_id,
                        product_data['metricSystem'],
                        product_data['quantity'],
                        product_data['chemicalType'],
                        product_data['expiryDate'],
                        product_data['hazardLevel']
                    ))
                
                # Commit transaction
                cursor.execute("COMMIT")
                return True, "Product created successfully!"
                
            except Exception as e:
                cursor.execute("ROLLBACK")
                raise e
                
     except Exception as e:
        print(f"Error in create_product_with_item: {str(e)}")
        return False, str(e)   
    def get_agribusiness_items(self, user_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # First get all items for specific user
            cursor.execute("""
                SELECT 
                    itemID,
                    ownerID,
                    itemName,
                    itemPrice,
                    itemDescription,
                    quantityAvailable,
                    itemImage,
                    itemRating,
                    salePercentage
                FROM Items
                WHERE ownerID = ?
            """, (user_id,))
            
            items = []
            for row in cursor.fetchall():
                # Convert row to dictionary
                item = {
                    'itemId': row[0],
                    'ownerId': row[1],
                    'title': row[2],
                    'price': float(row[3]),
                    'description': row[4],
                    'quantityAvailable': row[5],
                    'image': base64.b64encode(row[6]).decode('utf-8') if row[6] else None,
                    'rating': row[7],
                    'salePercentage': row[8]
                }
                
                # Check if item exists in Machines table
                cursor.execute("""
                    SELECT 
                        machineType,
                        machineWeight,
                        powerSource,
                        warranty
                    FROM Machines 
                    WHERE machineID = ?
                """, (item['itemId'],))
                
                machine_data = cursor.fetchone()
                
                if machine_data:
                    item['productType'] = 'Machine'
                    item['machineType'] = machine_data[0]
                    item['machineWeight'] = machine_data[1]
                    item['powerSource'] = machine_data[2]
                    item['warranty'] = machine_data[3]
                else:
                    # Check if item exists in Chemicals table
                    cursor.execute("""
                        SELECT 
                            metricSystem,
                            quantity,
                            chemicalType,
                            expiryDate,
                            hazardLevel
                        FROM Chemicals 
                        WHERE chemicalID = ?
                    """, (item['itemId'],))
                    
                    chemical_data = cursor.fetchone()
                    
                    if chemical_data:
                        item['productType'] = 'Chemical'
                        item['metricSystem'] = chemical_data[0]
                        item['quantity'] = chemical_data[1]
                        item['chemicalType'] = chemical_data[2]
                        item['expiryDate'] = chemical_data[3].isoformat() if chemical_data[3] else None
                        item['hazardLevel'] = chemical_data[4]
                
                items.append(item)
            
            return True, items
            
     except Exception as e:
        print(f"Error in get_agribusiness_items: {str(e)}")
        return False, str(e) 
    def get_agribusiness_product(self, product_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # First get basic item information
            cursor.execute("""
                SELECT 
                    itemID,
                    ownerID,
                    itemName,
                    itemPrice,
                    itemDescription,
                    quantityAvailable,
                    itemImage,
                    itemRating,
                    salePercentage
                FROM Items
                WHERE itemID = ?
            """, (product_id,))
            
            row = cursor.fetchone()
            if not row:
                return False, "Product not found"
                
            # Convert row to dictionary
            product = {
                'itemId': row[0],
                'ownerId': row[1],
                'title': row[2],
                'price': float(row[3]),
                'description': row[4],
                'quantityAvailable': row[5],
                'image': base64.b64encode(row[6]).decode('utf-8') if row[6] else None,
                'rating': row[7],
                'salePercentage': row[8]
            }
            
            # Check if item exists in Machines table
            cursor.execute("""
                SELECT 
                    machineType,
                    machineWeight,
                    powerSource,
                    warranty
                FROM Machines 
                WHERE machineID = ?
            """, (product_id,))
            
            machine_data = cursor.fetchone()
            
            if machine_data:
                product['productType'] = 'Machine'
                product['machineType'] = machine_data[0]
                product['machineWeight'] = machine_data[1]
                product['powerSource'] = machine_data[2]
                product['warranty'] = machine_data[3]
            else:
                # Check if item exists in Chemicals table
                cursor.execute("""
                    SELECT 
                        metricSystem,
                        quantity,
                        chemicalType,
                        expiryDate,
                        hazardLevel
                    FROM Chemicals 
                    WHERE chemicalID = ?
                """, (product_id,))
                
                chemical_data = cursor.fetchone()
                
                if chemical_data:
                    product['productType'] = 'Chemical'
                    product['metricSystem'] = chemical_data[0]
                    product['quantity'] = chemical_data[1]
                    product['chemicalType'] = chemical_data[2]
                    product['expiryDate'] = chemical_data[3].isoformat() if chemical_data[3] else None
                    product['hazardLevel'] = chemical_data[4]
                else:
                    return False, "Product type not found"
            
            return True, product
            
     except Exception as e:
        print(f"Error in get_agribusiness_product: {str(e)}")
        return False, str(e)
    def update_agribusiness_product(self, product_id, data):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            image_binary = None
            if data.get('image'):
                image_base64 = data['image'].split(',')[-1]
                image_binary = base64.b64decode(image_base64)
            # Update Items table first
            cursor.execute("""
                UPDATE Items 
                SET itemName = ?,
                    itemPrice = ?,
                    itemDescription = ?,
                    quantityAvailable = ?,
                    itemImage = COALESCE(?, itemImage),
                    salePercentage = ?
                WHERE itemID = ?
            """, (
                data.get('title'),
                data.get('price'),
                data.get('description'),
                data.get('quantityAvailable'),
                image_binary,
                data.get('salePercentage', 0),
                product_id
            ))
            
            # Update specific product type table
            product_type = data.get('productType')
            if product_type == 'Machine':
                cursor.execute("""
                    UPDATE Machines 
                    SET machineWeight = ?,
                        warranty = ?
                    WHERE machineID = ?
                """, (
                    data.get('machineWeight'),
                    data.get('warranty'),
                    product_id
                ))
            
            elif product_type == 'Chemical':
                cursor.execute("""
                    UPDATE Chemicals 
                    SET quantity = ?,
                       
                        expiryDate = ?
                    WHERE chemicalID = ?
                """, (
                    data.get('quantity'),
                    data.get('expiryDate'),
                    product_id
                ))
            
            conn.commit()
            return True, "Product updated successfully"
            
     except Exception as e:
        print(f"Error in update_agribusiness_product: {str(e)}")
        return False, str(e)  
    def delete_agribusiness_product(self, product_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # First determine if it's a machine or chemical
            cursor.execute("""
                SELECT 1 FROM Machines WHERE machineID = ?
                UNION ALL
                SELECT 1 FROM Chemicals WHERE chemicalID = ?
            """, (product_id, product_id))
            
            product_exists = cursor.fetchone()
            if not product_exists:
                return False, "Product not found"
            
            # Start transaction
            cursor.execute("BEGIN TRANSACTION")
            
            try:
                # Delete from Machines if exists
                cursor.execute("""
                    DELETE FROM Machines 
                    WHERE machineID = ?
                """, (product_id,))
                
                # Delete from Chemicals if exists
                cursor.execute("""
                    DELETE FROM Chemicals 
                    WHERE chemicalID = ?
                """, (product_id,))
                
                # Finally delete from Items
                cursor.execute("""
                    DELETE FROM Items 
                    WHERE itemID = ?
                """, (product_id,))
                
                # If we got here, commit the transaction
                cursor.execute("COMMIT TRANSACTION")
                return True, "Product deleted successfully"
                
            except Exception as e:
                # If anything goes wrong, rollback the transaction
                cursor.execute("ROLLBACK TRANSACTION")
                raise e
            
     except Exception as e:
        print(f"Error in delete_agribusiness_product: {str(e)}")
        return False, str(e)
     
    def get_farmer_products(self, farmer_id):
        """Fetch all products for a specific farmer"""
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                
                query = """
                    SELECT 
                        i.itemID,
                        i.itemName,
                        i.itemPrice,
                        i.itemDescription,
                        i.quantityAvailable,
                        i.itemImage,
                        i.itemRating,
                        i.salePercentage,
                        p.minimumBulkAmount,
                        c.categoryName,
                        c.metricSystem
                    FROM Items i
                    JOIN Products p ON i.itemID = p.productID
                    JOIN Categories c ON p.categoryID = c.categoryID
                    WHERE i.ownerID = ?
                    ORDER BY i.itemCreationDate DESC
                """
                
                cursor.execute(query, (farmer_id,))
                products = []
                
                for row in cursor.fetchall():
                    product = {
                        'id': row[0],
                        'itemName': row[1],
                        'itemPrice': float(row[2]),
                        'itemDescription': row[3],
                        'quantityAvailable': row[4],
                        'itemImage': base64.b64encode(row[5]).decode('utf-8') if row[5] else None,
                        'itemRating': float(row[6]) if row[6] else 0,
                        'salePercentage': float(row[7]) if row[7] else 0,
                        'minimumBulkAmount': row[8],
                        'category': row[9],
                        'metricSystem': row[10]
                    }
                    products.append(product)
                
                return True, products
                
        except Exception as e:
            print(f"Error fetching farmer products: {str(e)}")
            return False, str(e)

    def get_product_details(self, product_id):
        """Fetch details of a specific product"""
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                
                query = """
                    SELECT 
                        i.itemID,
                        i.itemName,
                        i.itemPrice,
                        i.itemDescription,
                        i.quantityAvailable,
                        i.itemImage,
                        i.ownerID,
                        i.salePercentage,
                        p.minimumBulkAmount,
                        c.categoryName,
                        c.metricSystem
                    FROM Items i
                    JOIN Products p ON i.itemID = p.productID
                    JOIN Categories c ON p.categoryID = c.categoryID
                    WHERE i.itemID = ?
                """
                
                cursor.execute(query, (product_id,))
                row = cursor.fetchone()
                
                if not row:
                    return False, "Product not found"
                
                product = {
                    'id': row[0],
                    'itemName': row[1],
                    'itemPrice': float(row[2]),
                    'itemDescription': row[3],
                    'quantityAvailable': row[4],
                    'itemImage': base64.b64encode(row[5]).decode('utf-8') if row[5] else None,
                    'ownerId': row[6],
                    'salePercentage':row[7],
                    'minimumBulkAmount': row[8],
                    'category': row[9],
                    'metricSystem': row[10]
                }
                
                return True, product
                
        except Exception as e:
            print(f"Error fetching product details: {str(e)}")
            return False, str(e)

    def update_product(self, product_id, product_data):
        """Update an existing product"""
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                
                # First get the category ID
                category_id = self.get_or_create_category(
                    product_data['category'],
                    product_data['metricSystem']
                )
                
                # Convert base64 image to binary if present
                image_binary = None
                if product_data.get('image'):
                    image_base64 = product_data['image'].split(',')[-1]
                    image_binary = base64.b64decode(image_base64)
                
                # Update Items table
                cursor.execute("""
                    UPDATE Items 
                    SET itemName = ?,
                        itemPrice = ?,
                        itemDescription = ?,
                        quantityAvailable = ?,
                        salePercentage=?,
                        itemImage = COALESCE(?, itemImage)
                    WHERE itemID = ?
                """, (
                    product_data['itemName'],
                    product_data['itemPrice'],
                    product_data['itemDescription'],
                    product_data['quantityAvailable'],
                    product_data['salePercentage'],
                    image_binary,
                    product_id
                ))
                
                # Update Products table
                cursor.execute("""
                    UPDATE Products
                    SET minimumBulkAmount = ?,
                        categoryID = ?
                    WHERE productID = ?
                """, (
                    product_data['minimumBulkAmount'],
                    category_id,
                    product_id
                ))
                
                conn.commit()
                return True, "Product updated successfully"
                
        except Exception as e:
            print(f"Error updating product: {str(e)}")
            return False, str(e)

    def delete_product(self, product_id):
        """Delete a product"""
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                
                # First delete from Products table (due to foreign key constraint)
                cursor.execute("DELETE FROM Products WHERE productID = ?", (product_id,))
                
                # Then delete from Items table
                cursor.execute("DELETE FROM Items WHERE itemID = ?", (product_id,))
                
                conn.commit()
                return True, "Product deleted successfully"
                
        except Exception as e:
            print(f"Error deleting product: {str(e)}")
            return False, str(e)
    def save_disease_report(self, report_data):
        """
        Save a new disease detection report
        
        Parameters:
        report_data (dict): Dictionary containing:
            - userID: int
            - modelName: str
            - detectedIssue: str
            - confidence: float
            - severity: str
            - imageData: str (base64)
            - recommendations: str
            - preventiveMeasures: str
            - treatment: str
        """
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                
                # Convert base64 image to binary if present
                image_binary = None
                if report_data.get('imageData'):
                    if isinstance(report_data['imageData'], str):
                        image_base64 = report_data['imageData'].split(',')[-1]
                        image_binary = base64.b64decode(image_base64)
                    else:
                        image_binary = report_data['imageData']

                cursor.execute("""
                    INSERT INTO DiseaseReports (
                        userID, timestamp, modelName, detectedIssue, 
                        confidence, severity, imageData, recommendations,
                        preventiveMeasures, treatment
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    report_data['userID'],
                    datetime.now(),
                    report_data['modelName'],
                    report_data['detectedIssue'],
                    float(report_data['confidence']),
                    report_data['severity'],
                    image_binary,
                    report_data['recommendations'],
                    report_data['preventiveMeasures'],
                    report_data['treatment']
                ))
                
                conn.commit()
                return True, "Report saved successfully"
                
        except Exception as e:
            print(f"Error saving disease report: {str(e)}")
            return False, str(e)

    def get_user_reports(self, user_id, limit=None):
        """
        Fetch all disease reports for a specific user
        
        Parameters:
        user_id (int): The ID of the user
        limit (int, optional): Maximum number of reports to return
        """
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                
                query = """
                    SELECT 
                        reportID,
                        timestamp,
                        modelName,
                        detectedIssue,
                        confidence,
                        severity,
                        imageData,
                        recommendations,
                        preventiveMeasures,
                        treatment
                    FROM DiseaseReports
                    WHERE userID = ?
                    ORDER BY timestamp DESC
                """
                
                if limit:
                    query += f" TOP {limit}"
                
                cursor.execute(query, (user_id,))
                rows = cursor.fetchall()
                
                reports = []
                for row in rows:
                    print(row[6])
                    print(base64.b64encode(row[6]))
                    print(base64.b64encode(row[6]).decode('utf-8'))
                    print("--------------------------")
                    report = {
                        'reportID': row[0],
                        'timestamp': row[1].isoformat(),
                        'modelName': row[2],
                        'detectedIssue': row[3],
                        'confidence': float(row[4]),
                        'severity': row[5],
                        'imageData': base64.b64encode(row[6]).decode('utf-8') if row[6] else None,
                        'recommendations': row[7],
                        'preventiveMeasures': row[8],
                        'treatment': row[9]
                    }
                    
                    reports.append(report)
                
                return True, reports
                
        except Exception as e:
            print(f"Error fetching user reports: {str(e)}")
            return False, str(e)

    def get_report_details(self, report_id):
        """
        Fetch details of a specific report
        
        Parameters:
        report_id (str): The ID of the report to fetch
        """
        try:
            with self._get_connection() as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT 
                        reportID,
                        timestamp,
                        modelName,
                        detectedIssue,
                        confidence,
                        severity,
                        imageData,
                        recommendations,
                        preventiveMeasures,
                        treatment
                    FROM DiseaseReports
                    WHERE reportID = ?
                """, (report_id,))
                
                row = cursor.fetchone()
                if not row:
                    return False, "Report not found"
                
                report = {
                    'reportID': row[0],
                    'timestamp': row[1].isoformat(),
                    'modelName': row[2],
                    'detectedIssue': row[3],
                    'confidence': float(row[4]),
                    'severity': row[5],
                    'imageData': base64.b64encode(row[6]).decode('utf-8') if row[6] else None,
                    'recommendations': row[7],
                    'preventiveMeasures': row[8],
                    'treatment': row[9]
                }
             
                return True, report
                
        except Exception as e:
            print(f"Error fetching report details: {str(e)}")
            return False, str(e) 
        
    def delete_report(self, report_id):
        try:
            # First check if report exists
            with self._get_connection() as conn:
                cursor = conn.cursor()
                
                # First delete from Products table (due to foreign key constraint)
                cursor.execute("DELETE FROM DiseaseReports WHERE ReportId = ?",(report_id,))
                conn.commit()
                return True, "Report deleted successfully"
            
        except Exception as e:
            print(f"Error deleting report: {str(e)}")
            return False, str(e)  
    def get_user_name(self, user_id):
        try:
            with self._get_connection() as conn:
             cursor = conn.cursor()
             cursor.execute("SELECT UserName FROM Users WHERE UserId = ?", (user_id,))
             result = cursor.fetchone()
             return result[0] if result else None
        except Exception as e:
            raise e
        
    def get_user_profile(self, user_id):
     conn = self._get_connection()
     cursor = conn.cursor()
    
     try:
        # Get user data with all required fields
        cursor.execute("""
            SELECT UserId, UserName, FirstName, LastName, Email, Address, 
                   PhoneNumber, UserType, ProfilePicture, Gender, NationalID,
                   AccountStatus, RegistrationDate
            FROM Users 
            WHERE UserId = ?
        """, user_id)
        
        user_data = cursor.fetchone()
        if not user_data:
            return None
            
        # Create profile dictionary with all fields
        user_profile = {
            'userId': user_data[0],
            'userName': user_data[1],
            'firstName': user_data[2],
            'lastName': user_data[3],
            'email': user_data[4],
            'address': user_data[5],
            'phoneNumber': user_data[6],
            'userType': user_data[7],
            'gender': user_data[9],
            'nationalID': user_data[10],
            'accountStatus': user_data[11],
            'registrationDate': user_data[12].strftime('%Y-%m-%d') if user_data[12] else None
        }
        
        # Handle profile picture - convert to base64
        if user_data[8]:  # ProfilePicture
            base64_image = base64.b64encode(user_data[8]).decode('utf-8')
            user_profile['profilePicture'] = f"data:image/jpeg;base64,{base64_image}"
        else:
            user_profile['profilePicture'] = None
        
        # Get farmer data if applicable
        if user_profile['userType'] == 'Farmer':
            cursor.execute("""
                SELECT FarmAddress, FarmSize, Specialization, FarmYieldCapacity
                FROM Farmers 
                WHERE UserId = ?
            """, user_id)
            
            farmer_data = cursor.fetchone()
            if farmer_data:
                user_profile.update({
                    'address': farmer_data[0],
                    'farmSize': farmer_data[1],
                    'specialization': farmer_data[2],
                    'farmYieldCapacity': farmer_data[3]
                })
        elif user_profile['userType'] == 'Agri-business':
            cursor.execute("""
                SELECT AgriBusinessName, BusinessDescription, BusinessType, 
                       BusinessRegistrationNumber
                FROM AgriBusiness 
                WHERE UserId = ?
            """, user_id)
            
            business_data = cursor.fetchone()
            if business_data:
                user_profile.update({
                    'agriBusinessName': business_data[0],
                    'businessDescription': business_data[1],
                    'businessType': business_data[2],
                    'businessRegistrationNumber': business_data[3]
                })
        elif user_profile['userType'] == 'Consumer':
             cursor.execute("""
                SELECT AssociatedCompany, ConsumerType
                FROM Consumers 
                WHERE UserId = ?
            """, user_id)
             consumer_data=cursor.fetchone()
             if consumer_data:
                 user_profile.update({
                    'associatedCompany': consumer_data[0],
                    'consumerType': consumer_data[1],
                 })

        return user_profile
        
     except Exception as e:
        raise Exception(f"Error fetching user profile: {str(e)}")
     finally:
        cursor.close()
        conn.close()

    def update_user_profile(self, user_id, data):
     conn = self._get_connection()
     cursor = conn.cursor()
    
     try:
        # Update user data
        cursor.execute("""
            UPDATE Users 
            SET FirstName = ?,
                LastName = ?,
                PhoneNumber = ?,
                Address = ?
            WHERE UserId = ?
        """, (
            data['firstName'],
            data['lastName'],
            data['phoneNumber'],
            data['address'],
            user_id
        ))
        
        # Update password if provided
        if data.get('password'):
            # In a real application, you should hash the password
            cursor.execute("""
                UPDATE Users 
                SET Password = ?
                WHERE UserId = ?
            """, (generate_password_hash(data['password']), user_id))
        
        # Update farmer data if applicable
        if data.get('userType') == 'Farmer':
            cursor.execute("""
                UPDATE Farmers 
                SET FarmSize = ?,
                    Specialization = ?,
                    FarmYieldCapacity = ?,
                    FarmAddress = ?
                WHERE UserId = ?
            """, (
                data.get('farmSize'),
                data.get('specialization'),
                data.get('farmYieldCapacity'),
                data.get('address'),  # Using the same address for farm address
                user_id
            ))
        elif data.get('userType') == 'Agri-business':
            cursor.execute("""
                UPDATE AgriBusiness 
                SET BusinessDescription = ?
                WHERE UserId = ?
            """, (
                data.get('businessDescription'),
                user_id
            ))
        # Update profile picture if provided
        if data.get('profilePicture'):
            try:
                # Remove the data URL prefix if present
                if 'base64,' in data['profilePicture']:
                    base64_string = data['profilePicture'].split('base64,')[1]
                else:
                    base64_string = data['profilePicture']
                binary_image = base64.b64decode(base64_string)
                
                cursor.execute("""
                    UPDATE Users
                    SET ProfilePicture = ?
                    WHERE UserId = ?
                """, (binary_image, user_id))
            except Exception as e:
                raise Exception(f"Error processing profile picture: {str(e)}")
        
        conn.commit()
        return True
        
     except Exception as e:
        conn.rollback()
        raise Exception(f"Error updating user profile: {str(e)}")
     finally:
        cursor.close()
        conn.close()

    def initialize_chat(self, user1_id, user2_id):
     conn = self._get_connection()
     cursor = conn.cursor()
    
     try:
        # Check if both users exist
        cursor.execute("""
            SELECT COUNT(*) 
            FROM Users 
            WHERE UserID IN (?, ?)
        """, (user1_id, user2_id))
        
        if cursor.fetchone()[0] != 2:
            raise Exception("One or both users not found")

        # Check if chat already exists
        cursor.execute("""
            SELECT ChatID 
            FROM Chat 
            WHERE (User1ID = ? AND User2ID = ?) 
               OR (User1ID = ? AND User2ID = ?)
        """, (user1_id, user2_id, user2_id, user1_id))
        
        existing_chat = cursor.fetchone()
        
        if existing_chat:
            return {
                'chatId': existing_chat[0],
                'message': 'Existing chat found'
            }

        # Create new chat
        cursor.execute("""
            INSERT INTO Chat (User1ID, User2ID, CreatedAt)
            VALUES (?, ?, ?)
        """, (user1_id, user2_id, datetime.now()))
        
        conn.commit()
        
        # Get the new chat ID
        cursor.execute("SELECT @@IDENTITY")
        chat_id = cursor.fetchone()[0]

        return {
            'chatId': chat_id,
            'message': 'Chat initialized successfully'
        }
        
     except Exception as e:
        conn.rollback()
        raise Exception(f"Error initializing chat: {str(e)}")
     finally:
        cursor.close()
        conn.close()
    def get_chat(self, user1_id, user2_id):
     conn = self._get_connection()
     cursor = conn.cursor()
    
     try:
        cursor.execute("""
            SELECT ChatID, CreatedAt
            FROM Chat 
            WHERE (User1ID = ? AND User2ID = ?) 
               OR (User1ID = ? AND User2ID = ?)
        """, (user1_id, user2_id, user2_id, user1_id))
        
        result = cursor.fetchone()
        
        if result:
            return {
                'exists': True,
                'chatId': result[0],
                'createdAt': result[1].isoformat() if result[1] else None
            }
        return None
        
     except Exception as e:
        raise Exception(f"Error checking chat existence: {str(e)}")
     finally:
        cursor.close()
        conn.close()