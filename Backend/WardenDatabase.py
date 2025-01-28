from base64 import b64encode
import base64
from datetime import datetime
from http import HTTPStatus
from io import BytesIO
import sqlite3
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
    def authenticate_userID(self, identifier):
        conn = self._get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute("""
                SELECT UserId 
                FROM Users 
                WHERE Email = ? OR UserName = ?
            """, (identifier, identifier))
            
            user = cursor.fetchone()
            
            if user :
                return user[0]
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
              
                self.create_notification(product_data['userId'],"Store",f"{product_data['title']} is now live on the marketplace. Start receiving orders!")
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
                
                self.create_notification(product_data['userId'],"Store",f"{product_data['title']} is now live on the marketplace. Start receiving orders!")
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
            query = """
                   SELECT i.salePercentage,i.quantityAvailable
                   FROM items i
                   WHERE i.itemID = ?
                   """
            cursor.execute(query, (product_id,))
            result3 = cursor.fetchone()
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
            query = """
                   SELECT i.itemID ,sp.userID 
                   FROM items i
                   INNER JOIN saved_products sp ON i.itemID = sp.itemID
                   WHERE sp.itemID = ?
                   """
            cursor.execute(query, (product_id,))
            result34 = cursor.fetchone()
            if(int(data.get('salePercentage', 0))>0 and int(data.get('salePercentage', 0))!=int(result3[0])):  
                 if(result34[1]):
                  self.create_notification(result34[1],"Tag",f"Price drop alert! {data.get('title')} from your saved products is now {int(data.get('salePercentage', 0))}% off")
            if(int(data.get('quantityAvailable'))>0 and int(result3[1])==0):   
                if(result34[1]):
                 self.create_notification(result34[1],"RefreshCcw",f"Good news! {data.get('title')} is back in stock. Order now before it runs out!")
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

                query = """
                   SELECT i.salePercentage,i.quantityAvailable
                   FROM items i
                   WHERE i.itemID = ?
                   """
                cursor.execute(query, (product_id,))
                result3 = cursor.fetchone()
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
                query = """
                   SELECT i.itemID ,sp.userID 
                   FROM items i
                   INNER JOIN saved_products sp ON i.itemID = sp.itemID
                   WHERE sp.itemID = ?
                   """
                cursor.execute(query, (product_id,))
                result34 = cursor.fetchone()
              
                if(result34):
                 if(int(product_data['salePercentage'])>0 and int(product_data['salePercentage'])!=int(result3[0])):
                   self.create_notification(result34[1],"Tag",f"Price drop alert! {product_data['itemName']} from your saved products is now {int(product_data['salePercentage'])}% off")

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
                if(result34):
                 if(int(product_data['quantityAvailable'])>0 and int(product_data['quantityAvailable'])>=int(product_data['minimumBulkAmount']) and int(result3[1])==0): 
                  self.create_notification(result34[1],"RefreshCcw",f"Good news! {product_data['itemName']} is back in stock. Order now before it runs out!")
                 elif( int(result3[1])<int(product_data['minimumBulkAmount']) and int(product_data['quantityAvailable'])>=int(product_data['minimumBulkAmount'])):   
                  self.create_notification(result34[1],"RefreshCcw",f"Good news! {product_data['itemName']} is back in stock. Order now before it runs out!")
                 elif(int(result3[1])>=int(product_data['minimumBulkAmount']) and int(product_data['quantityAvailable'])>=int(product_data['minimumBulkAmount'])): 
                  self.create_notification(result34[1],"RefreshCcw",f"Good news! {product_data['itemName']} is back in stock. Order now before it runs out!")
                


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
        elif data.get('userType') == 'Consumer':
            cursor.execute("""
                UPDATE Consumers 
                SET AssociatedCompany = ?
                WHERE UserId = ?
            """, (
                data.get('associatedCompany'),
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
        cursor.execute("""
        SELECT 
            CONCAT(u1.FirstName, ' ', u1.LastName) as user1_full_name,
            CONCAT(u2.FirstName, ' ', u2.LastName) as user2_full_name
        FROM Users u1, Users u2
        WHERE u1.UserId = ? AND u2.UserId = ?
    """, (user1_id, user2_id))
    
        result = cursor.fetchone()

        self.create_notification(user2_id,"MessageSquare",f"You've started your first chat with {result[0]}! Start connecting and enjoy your conversation.")
        self.create_notification(user1_id,"MessageSquare",f"You've started your first chat with {result[1]}! Start connecting and enjoy your conversation.")
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
    
    def get_all_products(self,userId):
     
     try:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            query=None
            if(userId):
             query = """
                SELECT 
                    i.itemID,
                    i.itemName,
                    i.itemPrice,
                    i.itemRating,
                    i.itemDescription,
                    i.quantityAvailable,
                    i.itemImage,
                    i.ownerID,
                    i.salePercentage,
                    p.minimumBulkAmount,
                    c.categoryName,
                    c.metricSystem,
                    u.FirstName,
                    u.LastName,
                    u.UserName,
                    u.UserType,
                    u.Email,
                    u.PhoneNumber
                FROM Items i
                JOIN Products p ON i.itemID = p.productID
                JOIN Categories c ON p.categoryID = c.categoryID
                JOIN Users u ON i.ownerID = u.UserId
                WHERE i.ownerID = ?
                ORDER BY i.itemCreationDate DESC
             """
             cursor.execute(query,(userId,))
            else:
                query = """
                SELECT 
                    i.itemID,
                    i.itemName,
                    i.itemPrice,
                    i.itemRating,
                    i.itemDescription,
                    i.quantityAvailable,
                    i.itemImage,
                    i.ownerID,
                    i.salePercentage,
                    p.minimumBulkAmount,
                    c.categoryName,
                    c.metricSystem,
                    u.FirstName,
                    u.LastName,
                    u.UserName,
                    u.UserType,
                    u.Email,
                    u.PhoneNumber
                FROM Items i
                JOIN Products p ON i.itemID = p.productID
                JOIN Categories c ON p.categoryID = c.categoryID
                JOIN Users u ON i.ownerID = u.UserId
                ORDER BY i.itemCreationDate DESC
             """
                cursor.execute(query)
            rows = cursor.fetchall()
            
            products = []
            for row in rows:
                product = {
                    'id': row[0],
                    'itemName': row[1],
                    'itemPrice': float(row[2]),
                    'itemRating': float(row[3]),
                    'itemDescription': row[4],
                    'quantityAvailable': row[5],
                    'itemImage': base64.b64encode(row[6]).decode('utf-8') if row[6] else None,
                    'ownerId': row[7],
                    'salePercentage': row[8],
                    'minimumBulkAmount': row[9],
                    'category': row[10],
                    'metricSystem': row[11],
                    'ownerDetails': {
                        'firstName': row[12],
                        'lastName': row[13],
                        'userName': row[14],
                        'userType':row[15],
                        'email':row[16],
                        'phoneNumber':row[17]
                    }
                }
               
                products.append(product)
            

            return True, products
            
     except Exception as e:
        print(f"Error fetching all products: {str(e)}")
        return False, str(e)
     
    def get_all_agribusiness_products(self,userId):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            machines_query=None
            chemicals_query=None
            if(userId):
             machines_query = """
                SELECT 
                    i.itemID,
                    i.ownerID,
                    i.itemName,
                    i.itemPrice,
                    i.itemDescription,
                    i.quantityAvailable,
                    i.itemImage,
                    i.itemRating,
                    i.salePercentage,
                    m.machineType,
                    m.machineWeight,
                    m.powerSource,
                    m.warranty,
                    ab.AgriBusinessName,
                    ab.BusinessType,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.PhoneNumber
                FROM Items i
                INNER JOIN Machines m ON i.itemID = m.machineID
                INNER JOIN AgriBusiness ab ON i.ownerID = ab.UserId
                INNER JOIN Users u ON ab.UserId = u.UserId
                WHERE i.ownerID = ?
             """
            
             chemicals_query = """
                SELECT 
                    i.itemID,
                    i.ownerID,
                    i.itemName,
                    i.itemPrice,
                    i.itemDescription,
                    i.quantityAvailable,
                    i.itemImage,
                    i.itemRating,
                    i.salePercentage,
                    c.metricSystem,
                    c.quantity,
                    c.chemicalType,
                    c.expiryDate,
                    c.hazardLevel,
                    ab.AgriBusinessName,
                    ab.BusinessType,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.PhoneNumber
                FROM Items i
                INNER JOIN Chemicals c ON i.itemID = c.chemicalID
                INNER JOIN AgriBusiness ab ON i.ownerID = ab.UserId
                INNER JOIN Users u ON ab.UserId = u.UserId
                WHERE i.ownerID = ?
              """
            else:
            # Get all products with business and owner information
             machines_query = """
                SELECT 
                    i.itemID,
                    i.ownerID,
                    i.itemName,
                    i.itemPrice,
                    i.itemDescription,
                    i.quantityAvailable,
                    i.itemImage,
                    i.itemRating,
                    i.salePercentage,
                    m.machineType,
                    m.machineWeight,
                    m.powerSource,
                    m.warranty,
                    ab.AgriBusinessName,
                    ab.BusinessType,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.PhoneNumber
                FROM Items i
                INNER JOIN Machines m ON i.itemID = m.machineID
                INNER JOIN AgriBusiness ab ON i.ownerID = ab.UserId
                INNER JOIN Users u ON ab.UserId = u.UserId
             """
            
             chemicals_query = """
                SELECT 
                    i.itemID,
                    i.ownerID,
                    i.itemName,
                    i.itemPrice,
                    i.itemDescription,
                    i.quantityAvailable,
                    i.itemImage,
                    i.itemRating,
                    i.salePercentage,
                    c.metricSystem,
                    c.quantity,
                    c.chemicalType,
                    c.expiryDate,
                    c.hazardLevel,
                    ab.AgriBusinessName,
                    ab.BusinessType,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.PhoneNumber
                FROM Items i
                INNER JOIN Chemicals c ON i.itemID = c.chemicalID
                INNER JOIN AgriBusiness ab ON i.ownerID = ab.UserId
                INNER JOIN Users u ON ab.UserId = u.UserId
             """
            if(userId):
             cursor.execute(machines_query,(userId,))
            else:
             cursor.execute(machines_query)
            # Get machines
            
            machines = []
            for row in cursor.fetchall():
                machine = {
                    'itemId': row[0],
                    'ownerId': row[1],
                    'title': row[2],
                    'price': float(row[3]),
                    'description': row[4],
                    'quantityAvailable': row[5],
                    'image': base64.b64encode(row[6]).decode('utf-8') if row[6] else None,
                    'rating': row[7],
                    'salePercentage': row[8],
                    'productType': 'Machine',
                    'machineType': row[9],
                    'machineWeight': float(row[10]),
                    'powerSource': row[11],
                    'warranty': row[12],
                    'businessInfo': {
                        'agriBusinessName': row[13],
                        'businessType': row[14],
                        'ownerName': f"{row[15]} {row[16]}",
                        'email': row[17],
                        'phoneNumber': row[18]
                    }
                }
                machines.append(machine)
            
            if(userId):
             cursor.execute(chemicals_query,(userId,))
            else:
             cursor.execute(chemicals_query)
            
            chemicals = []
            for row in cursor.fetchall():
                chemical = {
                    'itemId': row[0],
                    'ownerId': row[1],
                    'title': row[2],
                    'price': float(row[3]),
                    'description': row[4],
                    'quantityAvailable': row[5],
                    'image': base64.b64encode(row[6]).decode('utf-8') if row[6] else None,
                    'rating': row[7],
                    'salePercentage': row[8],
                    'productType': 'Chemical',
                    'metricSystem': row[9],
                    'quantity': float(row[10]),
                    'chemicalType': row[11],
                    'expiryDate': row[12].isoformat() if row[12] else None,
                    'hazardLevel': row[13],
                    'businessInfo': {
                        'agriBusinessName': row[14],
                        'businessType': row[15],
                        'ownerName': f"{row[16]} {row[17]}",
                        'email': row[18],
                        'phoneNumber': row[19]
                    }
                }
                chemicals.append(chemical)
            
            # Combine all products
            all_products = machines + chemicals
            
            return True, all_products
            
     except Exception as e:
        print(f"Error in get_all_agribusiness_products: {str(e)}")
        return False, str(e)
    # Database Class Methods
    
    def save_product(self, item_id, user_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            query = """
                INSERT INTO saved_products (itemID, userID)
                VALUES (?, ?)
            """
            cursor.execute(query, (item_id, user_id))
            conn.commit()
            return True, "Product saved successfully"
            
     except pyodbc.IntegrityError as e:
        return False, "Product already saved or invalid item/user ID"
     except Exception as e:
        return False, str(e)

    def get_saved_products(self, user_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            query = """
                SELECT i.* 
                FROM items i
                INNER JOIN saved_products sp ON i.itemID = sp.itemID
                WHERE sp.userID = ?
            """
            cursor.execute(query, (user_id,))
            products = cursor.fetchall()
            
            if not products:
                return True, []
                
            formatted_products = []
            for product in products:
                formatted_products.append({
                    'id': product[0],
                   
                })
                
            return True, formatted_products
            
     except Exception as e:
        return False, str(e)

    def remove_saved_product(self, user_id, item_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            query = """
                DELETE FROM saved_products 
                WHERE userID = ? AND itemID = ?
            """
            cursor.execute(query, (user_id, item_id))
            conn.commit()
            
            if cursor.rowcount == 0:
                return False, "Product not found in saved items"
                
            return True, "Product removed successfully"
            
     except Exception as e:
        return False, str(e)
     
    def save_product_review(self, item_id, user_id, rating, comment):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # Start transaction
            cursor.execute("BEGIN TRANSACTION")
            
            try:
                # Check if review already exists
                check_query = """
                    SELECT reviewID, userRating 
                    FROM product_reviews 
                    WHERE itemID = ? AND userID = ?
                """
                cursor.execute(check_query, (item_id, user_id))
                existing_review = cursor.fetchone()
                
                if existing_review:
                    # Update existing review and adjust ratings
                    old_rating = existing_review[1]
                    
                    # Decrease old rating count
                    cursor.execute(f"""
                        UPDATE product_ratings 
                        SET no{old_rating}Stars = no{old_rating}Stars - 1
                        WHERE itemID = ?
                    """, (item_id,))
                    
                    # Update the review
                    cursor.execute("""
                        UPDATE product_reviews 
                        SET userRating = ?, userComment = ?, timestamp = CURRENT_TIMESTAMP
                        WHERE itemID = ? AND userID = ?
                    """, (rating, comment, item_id, user_id))
                    
                else:
                    # Check if product exists in product_ratings
                    cursor.execute("""
                        IF NOT EXISTS (SELECT 1 FROM product_ratings WHERE itemID = ?)
                        INSERT INTO product_ratings (itemID, no1Stars, no2Stars, no3Stars, no4Stars, no5Stars)
                        VALUES (?, 0, 0, 0, 0, 0)
                    """, (item_id, item_id))
                    
                    # Insert new review
                    cursor.execute("""
                        INSERT INTO product_reviews (itemID, userID, userRating, userComment)
                        VALUES (?, ?, ?, ?)
                    """, (item_id, user_id, rating, comment))
                
                # Increase new rating count
                cursor.execute(f"""
                    UPDATE product_ratings 
                    SET no{rating}Stars = no{rating}Stars + 1
                    WHERE itemID = ?
                """, (item_id,))
                
                # Calculate and update average rating
                cursor.execute("""
                    WITH RatingStats AS (
                        SELECT 
                            itemID,
                            CAST((no1Stars * 1 + no2Stars * 2 + no3Stars * 3 + no4Stars * 4 + no5Stars * 5) AS FLOAT) /
                            NULLIF(CAST((no1Stars + no2Stars + no3Stars + no4Stars + no5Stars) AS FLOAT), 0) as avg_rating
                        FROM product_ratings
                        WHERE itemID = ?
                    )
                    UPDATE Items
                    SET itemRating = rs.avg_rating
                    FROM Items i
                    INNER JOIN RatingStats rs ON i.itemID = rs.itemID
                    WHERE i.itemID = ?
                """, (item_id, item_id))
                
                cursor.execute("COMMIT")
                return True, "Review saved successfully"
                
            except Exception as e:
                cursor.execute("ROLLBACK")
                raise e
            
     except Exception as e:
        print(f"Error in save_product_review: {str(e)}")
        return False, str(e)

    def get_product_reviews(self, item_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # Get all reviews for the product with user information
            query = """
                SELECT 
                    pr.reviewID,
                    pr.itemID,
                    pr.userID,
                    pr.userRating,
                    pr.userComment,
                    pr.commentLikes,
                    pr.commentDislikes,
                    pr.timestamp,
                    u.FirstName,
                    u.LastName,
                    u.ProfilePicture
                FROM product_reviews pr
                INNER JOIN Users u ON pr.userID = u.UserId
                WHERE pr.itemID = ?
                ORDER BY pr.timestamp DESC
            """
            
            cursor.execute(query, (item_id,))
            reviews = []
            
            for row in cursor.fetchall():
                review = {
                    'reviewId': row[0],
                    'itemId': row[1],
                    'userId': row[2],
                    'rating': row[3],
                    'comment': row[4],
                    'likes': row[5],
                    'dislikes': row[6],
                    'timestamp': row[7].isoformat() if row[7] else None,
                    'userInfo': {
                        'name': f"{row[8]} {row[9]}",
                        'profilePicture': base64.b64encode(row[10]).decode('utf-8') if row[10] else None
                    }
                }
                reviews.append(review)
            
            # Get product rating summary
            summary_query = """
                SELECT 
                    no1Stars, no2Stars, no3Stars, no4Stars, no5Stars
                FROM product_ratings
                WHERE itemID = ?
            """
            
            cursor.execute(summary_query, (item_id,))
            rating_row = cursor.fetchone()
            
            if rating_row:
                rating_summary = {
                    'oneStar': rating_row[0],
                    'twoStars': rating_row[1],
                    'threeStars': rating_row[2],
                    'fourStars': rating_row[3],
                    'fiveStars': rating_row[4],
                    'totalReviews': sum(rating_row)
                }
            else:
                rating_summary = {
                    'oneStar': 0,
                    'twoStars': 0,
                    'threeStars': 0,
                    'fourStars': 0,
                    'fiveStars': 0,
                    'totalReviews': 0
                }
            
            return True, {'reviews': reviews, 'summary': rating_summary}
            
     except Exception as e:
        print(f"Error in get_product_reviews: {str(e)}")
        return False, str(e)
     
    def edit_product_review(self, review_id, user_id, rating, comment):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # First get the old review details to update product_ratings
            get_old_review = """
                SELECT r.reviewID, r.itemID, r.userRating 
                FROM product_reviews r
                WHERE r.reviewID = ? AND r.userID = ?
            """
            cursor.execute(get_old_review, (review_id, user_id))
            old_review = cursor.fetchone()
            
            if not old_review:
                return False, "Review not found or unauthorized"
                
            # Start transaction
            cursor.execute("BEGIN TRANSACTION")
            
            try:
                # Decrease old rating count
                update_old_rating = """
                    UPDATE product_ratings 
                    SET no{}Stars = no{}Stars - 1
                    WHERE itemID = ?
                """.format(old_review[2], old_review[2])
                cursor.execute(update_old_rating, (old_review[1],))
                
                # Increase new rating count
                update_new_rating = """
                    UPDATE product_ratings 
                    SET no{}Stars = no{}Stars + 1
                    WHERE itemID = ?
                """.format(rating, rating)
                cursor.execute(update_new_rating, (old_review[1],))
                
                # Update the review
                update_query = """
                    UPDATE product_reviews 
                    SET userRating = ?,
                        userComment = ?,
                        timestamp = CURRENT_TIMESTAMP
                    WHERE reviewID = ? AND userID = ?
                """
                cursor.execute(update_query, (rating, comment, review_id, user_id))
                
                update_avg_rating = """
                    WITH RatingStats AS (
                        SELECT 
                            itemID,
                            CAST((no1Stars * 1 + no2Stars * 2 + no3Stars * 3 + no4Stars * 4 + no5Stars * 5) AS FLOAT) /
                            NULLIF(CAST((no1Stars + no2Stars + no3Stars + no4Stars + no5Stars) AS FLOAT), 0) as avg_rating
                        FROM product_ratings
                        WHERE itemID = ?
                    )
                    UPDATE Items
                    SET itemRating = COALESCE(rs.avg_rating, 0)
                    FROM Items i
                    LEFT JOIN RatingStats rs ON i.itemID = rs.itemID
                    WHERE i.itemID = ?
                """
                cursor.execute(update_avg_rating, (old_review[1], old_review[1]))
                
                cursor.execute("COMMIT")
                return True, "Review updated successfully"
                
            except Exception as e:
                cursor.execute("ROLLBACK")
                raise e
            
     except Exception as e:
        print(f"Error in edit_product_review: {str(e)}")
        return False, str(e)

    def update_review_reaction(self, review_id, user_id, reaction_type, is_add):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # Check if review exists
            check_query = "SELECT reviewID FROM product_reviews WHERE reviewID = ?"
            cursor.execute(check_query, (review_id,))
            if not cursor.fetchone():
                return False, "Review not found"
            
            # Update likes or dislikes
            update_query = """
                UPDATE product_reviews 
                SET {}= {} {} 1
                WHERE reviewID = ?
            """.format(
                'commentLikes' if reaction_type == 'like' else 'commentDislikes',
                'commentLikes' if reaction_type == 'like' else 'commentDislikes',
                '+' if is_add else '-'
            )
            
            cursor.execute(update_query, (review_id,))
            conn.commit()
            
            return True, "Reaction updated successfully"
            
     except Exception as e:
        print(f"Error in update_review_reaction: {str(e)}")
        return False, str(e)

    def delete_product_review(self, review_id, user_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # Start transaction
            cursor.execute("BEGIN TRANSACTION")
            
            try:
                # Get review details before deletion
                cursor.execute("""
                    SELECT itemID, userRating 
                    FROM product_reviews 
                    WHERE reviewID = ? AND userID = ?
                """, (review_id, user_id))
                review = cursor.fetchone()
                
                if not review:
                    return False, "Review not found or unauthorized"
                
                item_id, rating = review
                
                # Decrease rating count
                cursor.execute(f"""
                    UPDATE product_ratings 
                    SET no{rating}Stars = no{rating}Stars - 1
                    WHERE itemID = ?
                """, (item_id,))
                
                # Delete the review
                cursor.execute("""
                    DELETE FROM product_reviews 
                    WHERE reviewID = ? AND userID = ?
                """, (review_id, user_id))
                
                # Update average rating
                cursor.execute("""
                    WITH RatingStats AS (
                        SELECT 
                            itemID,
                            CAST((no1Stars * 1 + no2Stars * 2 + no3Stars * 3 + no4Stars * 4 + no5Stars * 5) AS FLOAT) /
                            NULLIF(CAST((no1Stars + no2Stars + no3Stars + no4Stars + no5Stars) AS FLOAT), 0) as avg_rating
                        FROM product_ratings
                        WHERE itemID = ?
                    )
                    UPDATE Items
                    SET itemRating = COALESCE(rs.avg_rating, 0)
                    FROM Items i
                    LEFT JOIN RatingStats rs ON i.itemID = rs.itemID
                    WHERE i.itemID = ?
                """, (item_id, item_id))
                
                cursor.execute("COMMIT")
                return True, "Review deleted successfully"
                
            except Exception as e:
                cursor.execute("ROLLBACK")
                raise e
            
     except Exception as e:
        print(f"Error in delete_product_review: {str(e)}")
        return False, str(e)
    
    def get_single_review(self, review_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            query = """
                SELECT 
                    pr.reviewID,
                    pr.itemID,
                    pr.userID,
                    pr.userRating,
                    pr.userComment,
                    pr.commentLikes,
                    pr.commentDislikes,
                    pr.timestamp,
                    u.FirstName,
                    u.LastName,
                    u.ProfilePicture
                FROM product_reviews pr
                INNER JOIN Users u ON pr.userID = u.UserId
                WHERE pr.reviewID = ?
            """
            
            cursor.execute(query, (review_id,))
            row = cursor.fetchone()
            
            if not row:
                return False, "Review not found"
            
            review = {
                'reviewId': row[0],
                'itemId': row[1],
                'userId': row[2],
                'rating': row[3],
                'comment': row[4],
                'likes': row[5],
                'dislikes': row[6],
                'timestamp': row[7].isoformat() if row[7] else None,
                'userInfo': {
                    'name': f"{row[8]} {row[9]}",
                    'profilePicture': base64.b64encode(row[10]).decode('utf-8') if row[10] else None
                }
            }
            
            return True, review
            
     except Exception as e:
        print(f"Error in get_single_review: {str(e)}")
        return False, str(e)
    # Database functions
    
    def add_cart_item(self, data):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # Check if user has an active cart
            cart_query = """
                SELECT cartID, cart_status 
                FROM carts 
                WHERE userID = ?
                ORDER BY created_at DESC
            """
            cursor.execute(cart_query, (data['userID'],))
            cart_row = cursor.fetchone()
            
            # Determine if we need to create a new cart
            create_new_cart = False
            if not cart_row:
                create_new_cart = True
            elif cart_row.cart_status == 'completed':
                create_new_cart = True
                
            if create_new_cart:
                # Create new cart
                cart_insert = """
                    INSERT INTO carts (userID, cart_status) 
                    VALUES (?, 'pending')
                """
                cursor.execute(cart_insert, (data['userID'],))
                cursor.execute("SELECT @@IDENTITY")
                cart_id = cursor.fetchone()[0]
            else:
                cart_id = cart_row[0]
            
            # Check available quantity
            quantity_query = """
                SELECT quantityAvailable 
                FROM Items 
                WHERE itemID = ?
            """
            cursor.execute(quantity_query, (data['itemID'],))
            available_qty = cursor.fetchone()
            
            if not available_qty:
                return False, "Item not found"
                
            available_qty = available_qty[0]
            
            # Check if item already exists in cart
            existing_item_query = """
                SELECT quantity 
                FROM cart_items 
                WHERE cartID = ? AND itemID = ?
            """
            cursor.execute(existing_item_query, (cart_id, data['itemID']))
            existing_item = cursor.fetchone()
            
            total_quantity = data['quantity']
            if existing_item:
                total_quantity += existing_item[0]
            
            # Verify total quantity doesn't exceed available quantity
            if total_quantity > available_qty:
                return False, f"Cannot add {data['quantity']} items. Only {available_qty - (existing_item[0] if existing_item else 0)} more available"
            
            if existing_item:
                # Update existing cart item
                update_query = """
                    UPDATE cart_items 
                    SET quantity = ?, 
                        price = ?
                    WHERE cartID = ? AND itemID = ?
                """
                cursor.execute(update_query, (
                    total_quantity,
                    data['price'],
                    cart_id,
                    data['itemID']
                ))
            else:
                # Add new item to cart
                item_query = """
                    INSERT INTO cart_items (cartID, itemID, ownerName, quantity, price)
                    VALUES (?, ?, ?, ?, ?)
                """
                cursor.execute(item_query, (
                    cart_id,
                    data['itemID'],
                    data['ownerName'],
                    data['quantity'],
                    data['price']
                ))
            
            conn.commit()
            return True, {"cartID": cart_id}
            
     except Exception as e:
        print(f"Error in add_cart_item: {str(e)}")
        return False, str(e)

    def delete_cart_item(self, cart_id, item_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # Check if item exists in cart
            check_query = """
                SELECT COUNT(*) FROM cart_items 
                WHERE cartID = ? AND itemID = ?
            """
            cursor.execute(check_query, (cart_id, item_id))
            if cursor.fetchone()[0] == 0:
                return False, "Item not found in cart"
            
            # Delete item
            delete_query = """
                DELETE FROM cart_items 
                WHERE cartID = ? AND itemID = ?
            """
            cursor.execute(delete_query, (cart_id, item_id))
            
            conn.commit()
            return True, None
            
     except Exception as e:
        print(f"Error in delete_cart_item: {str(e)}")
        return False, str(e)

    def get_user_cart_items(self, user_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # Modified query to get latest accepted negotiation per cart item
            query = """
                WITH LatestPendingCart AS (
                    SELECT TOP 1 cartID 
                    FROM carts 
                    WHERE userID = ? 
                    AND cart_status = 'pending'
                    ORDER BY created_at DESC
                ),
                LatestAcceptedNegotiation AS (
                    SELECT 
                        pn.cartID,
                        pn.productID,
                        pn.quantity,
                        pn.newPrice,
                        ROW_NUMBER() OVER (
                            PARTITION BY pn.cartID, pn.productID, pn.quantity 
                            ORDER BY pn.timestamp DESC
                        ) as rn
                    FROM price_negotiations pn
                    WHERE pn.negotiation_status = 'Accepted'
                )
                SELECT 
                    ci.cartID,
                    ci.itemID,
                    ci.ownerName,
                    ci.quantity,
                    ci.price,
                    c.created_at,
                    c.updated_at,
                    i.itemName,
                    i.itemImage,
                    lan.newPrice as negotiated_price
                FROM cart_items ci
                INNER JOIN carts c ON ci.cartID = c.cartID
                INNER JOIN Items i ON ci.itemID = i.itemID
                INNER JOIN LatestPendingCart lpc ON ci.cartID = lpc.cartID
                LEFT JOIN LatestAcceptedNegotiation lan ON 
                    lan.cartID = ci.cartID 
                    AND lan.productID = ci.itemID 
                    AND lan.quantity = ci.quantity
                    AND lan.rn = 1
                ORDER BY c.created_at DESC
            """
            
            cursor.execute(query, (user_id,))
            rows = cursor.fetchall()
            
            if not rows:
                return False, "No cart found for user"
            
            cart_items = [{
                'cartId': row[0],
                'itemId': row[1],
                'ownerName': row[2],
                'quantity': row[3],
                'price': float(row[9]) if row[9] is not None else float(row[4]),  # Use negotiated price if available
                'originalPrice': float(row[4]) if row[9] is not None else None,  # Include original price if negotiated
                'createdAt': row[5].isoformat() if row[5] else None,
                'updatedAt': row[6].isoformat() if row[6] else None,
                'itemName': row[7],
                'itemImage': base64.b64encode(row[8]).decode('utf-8') if row[8] else None,
                'hasNegotiatedPrice': row[9] is not None  # Flag to indicate if price was negotiated
            } for row in rows]
            
            return True, cart_items
            
     except Exception as e:
        print(f"Error in get_user_cart_items: {str(e)}")
        return False, str(e)
     
    def create_negotiation_request(self, consumer_id, farmer_id, product_id, new_price, original_price, quantity, notes):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # First, check if there's a pending cart for this user
            cart_query = """
                SELECT TOP 1 cartID 
                FROM carts 
                WHERE userID = ? AND cart_status = 'pending'
                ORDER BY created_at DESC
            """
            cursor.execute(cart_query, (consumer_id,))
            cart_row = cursor.fetchone()
            
            cart_id = None
            if cart_row:
                cart_id = cart_row[0]
                
                # Check if negotiation already exists for this cart and product
                check_existing = """
                    SELECT negotiationID, negotiation_status
                    FROM price_negotiations
                    WHERE cartID = ? AND productID = ? AND negotiation_status = 'Pending'
                """
              
                cursor.execute(check_existing, (cart_id, product_id))
                existing_neg = cursor.fetchone()
                
                if existing_neg:
                    status = existing_neg[1]
                    message = {
                        'Pending': 'A negotiation request is already pending for this item',
                        'Accepted': 'A previous negotiation for this item was accepted',
                        'Rejected': 'A previous negotiation for this item was rejected'
                    }.get(status, 'A negotiation already exists for this item')
                    return False, message
            else:
                # Create a new cart if none exists
                cart_insert = """
                    INSERT INTO carts (userID, cart_status)
                    VALUES (?, 'pending');
                """
                cursor.execute(cart_insert, (consumer_id,))
                cursor.commit()
                
                # Get the new cart ID
                cursor.execute("SELECT SCOPE_IDENTITY()")
                cart_id = cursor.fetchval()
           
            # Validate inputs
            if new_price <= 0:
                return False, "New price must be greater than 0"
            if new_price >= original_price:
                return False, "New price must be less than original price"
            if quantity <= 0:
                return False, "Quantity must be greater than 0"
        
            # Insert the negotiation request
            # Note: negotiationID will be generated by the trigger
            insert_query = """
                INSERT INTO price_negotiations (
                    consumerID, farmerID, productID, newPrice, 
                     negotiation_status, notes, cartID, originalPrice, quantity
                    )
                     VALUES (?, ?, ?, ?, 'Pending', ?, ?, ?, ?)
                            """
       
            cursor.execute(insert_query, (
                consumer_id, farmer_id, product_id, new_price,notes,
                cart_id, original_price, quantity
            ))
            
            cursor.commit()
            
            # Fetch the inserted negotiation in a separate query
            select_query = """
                SELECT TOP 1 *
                FROM price_negotiations
                WHERE consumerID = ? 
                AND farmerID = ? 
                AND productID = ?
                ORDER BY timestamp DESC
            """
            
            cursor.execute(select_query, (consumer_id, farmer_id, product_id))
            row = cursor.fetchone()
            
            if not row:
                return False, "Failed to create negotiation request"
            
            
            negotiation = {
                'negotiationId': row[0],
                'consumerId': row[1],
                'farmerId': row[2],
                'productId': row[3],
                'newPrice': float(row[4]),
                'status': row[5],
                'notes': row[6],
                'timestamp': row[7].isoformat() if row[7] else None,
                'cartId': row[8],
                'originalPrice': float(row[9]),
                'quantity': int(row[10])
            }
            
            cursor.execute("""
              SELECT 
              CONCAT(u1.FirstName, ' ', u1.LastName) as user1_full_name
              FROM Users u1
               WHERE u1.UserId = ? 
               """, ( row[1],))
            result = cursor.fetchone()
            cursor.execute("""
               SELECT 
               i. itemName as productName
               FROM Items i
               WHERE i.itemID = ? 
               """, ( row[3],))
            result2 = cursor.fetchone()
            self.create_notification(row[2],"Scale",f" New price negotiation request from {result[0]} for {result2[0]}")
            return True, negotiation
            
     except Exception as e:
        print(f"Error in create_negotiation_request: {str(e)}")
        return False, f"An error occurred: {str(e)}"

    def get_farmer_negotiations(self, farmer_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            query = """
                SELECT 
                    n.*,
                    CONCAT(u.FirstName, ' ', u.LastName) as consumer_full_name,
                    i.itemName,
                    i.itemImage
                FROM price_negotiations n
                INNER JOIN Users u ON n.consumerID = u.userID
                INNER JOIN Items i ON n.productID = i.itemID
                WHERE n.farmerID = ?
                ORDER BY n.timestamp DESC
            """
            
            cursor.execute(query, (farmer_id,))
            rows = cursor.fetchall()
            
            if not rows:
                return False, "No negotiations found for farmer"
            
            negotiations = [{
                'negotiationId': row[0],
                'consumerId': row[1],
                'farmerId': row[2],
                'productId': row[3],
                'newPrice': float(row[4]),
                'status': row[5],
                'notes': row[6],
                'timestamp': row[7].isoformat() if row[7] else None,
                'cartId': row[8],
                'originalPrice': float(row[9]),
                'quantity': row[10],
                'consumerName': row[11],  # Now contains FirstName + LastName
                'itemName': row[12],
                'itemImage': base64.b64encode(row[13]).decode('utf-8') if row[13] else None,
            } for row in rows]
            
            return True, negotiations
            
     except Exception as e:
        print(f"Error in get_farmer_negotiations: {str(e)}")
        return False, str(e)

    def get_consumer_negotiations(self, consumer_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            query = """
                SELECT 
                    n.*,
                    CONCAT(f.FirstName, ' ', f.LastName) as farmer_full_name,
                    i.itemName,
                    i.itemImage
                FROM price_negotiations n
                INNER JOIN Users f ON n.farmerID = f.userID
                INNER JOIN Items i ON n.productID = i.itemID
                WHERE n.consumerID = ?
                ORDER BY n.timestamp DESC
            """
            
            cursor.execute(query, (consumer_id,))
            rows = cursor.fetchall()
            
            if not rows:
                return False, "No negotiations found for Consumer"
           
            negotiations = [{
                'negotiationId': row[0],
                'consumerId': row[1],
                'farmerId': row[2],
                'productId': row[3],
                'newPrice': float(row[4]),
                'status': row[5],
                'notes': row[6],
                'timestamp': row[7].isoformat() if row[7] else None,
                'cartId': row[8],
                'originalPrice': float(row[9]),
                'quantity': row[10],
                'farmerName': row[11],  # Now contains FirstName + LastName of farmer
                'itemName': row[12],
                'itemImage': base64.b64encode(row[13]).decode('utf-8') if row[13] else None,
            } for row in rows]
           
            return True, negotiations
            
     except Exception as e:
        print(f"Error in get_consumer_negotiations: {str(e)}")
        return False, str(e)
     
    def update_negotiation_request(self, negotiation_id, status):

     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            if status not in ['Pending', 'Accepted', 'Rejected']:
                return False, "Invalid status value"
            
            # First execute the UPDATE
            update_query = """
                UPDATE price_negotiations
                SET negotiation_status = ?
                WHERE negotiationID = ?
            """
            cursor.execute(update_query, (status, negotiation_id))
            cursor.commit()
            
            # Then execute the SELECT
            select_query = "SELECT * FROM price_negotiations WHERE negotiationID = ?"
            cursor.execute(select_query, (negotiation_id,))
            row = cursor.fetchone()
            
            if not row:
                return False, "Negotiation not found"
            
            negotiation = {
                'negotiationId': row[0],
                'consumerId': row[1],
                'farmerId': row[2],
                'productId': row[3],
                'newPrice': float(row[4]),
                'status': row[5],
                'notes': row[6],
                'timestamp': row[7].isoformat() if row[7] else None,
                'cartId': row[8],
                'originalPrice': float(row[9]),
                'quantity': row[10]
            }
            cursor.execute("""
              SELECT 
              CONCAT(u1.FirstName, ' ', u1.LastName) as user1_full_name
              FROM Users u1
               WHERE u1.UserId = ? 
               """, ( row[2],))
            result = cursor.fetchone()
            cursor.execute("""
               SELECT 
               i. itemName as productName
               FROM Items i
               WHERE i.itemID = ? 
               """, ( row[3],))
            result2 = cursor.fetchone()
            if(status=='Accepted'):
              self.create_notification(row[1],"ThumbsUp",f"{result[0]} accepted your price negotiation for {result2[0]}")
            elif (status=='Rejected'):
              self.create_notification(row[1],"ThumbsDown",f"{result[0]} declined your price negotiation for {result2[0]}")
            return True, negotiation
            
     except Exception as e:
        print(f"Error in update_negotiation_request: {str(e)}")
        return False, str(e)
    
    # Database function
    def process_order_and_payment(self, user_id, items, payment_details):
     order_ids=[]
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # Group items by owner
            items_by_owner = {}
            for item in items:
                owner_id = self.get_owner_id(cursor, item['itemId'])
                if owner_id not in items_by_owner:
                    items_by_owner[owner_id] = []
                items_by_owner[owner_id].append(item)
            
            created_orders = []
            
            # Check available quantities before processing
            for item in items:
                cursor.execute("""
                    SELECT quantityAvailable 
                    FROM Items 
                    WHERE itemID = ?
                """, (item['itemId'],))
                available_qty = cursor.fetchone()[0]
                
                if available_qty < item['quantity']:
                    raise Exception(f"Not enough quantity available for item {item['itemId']}. Available: {available_qty}, Requested: {item['quantity']}")
            
            for owner_id, owner_items in items_by_owner.items():
                # Calculate totals
                subtotal = sum(item['price'] * item['quantity'] for item in owner_items)
                print(subtotal)
                tax = subtotal * 0.05
                total = subtotal + tax
                
                # Insert order
                order_query = """
                    INSERT INTO orders (
                        cartID, totalPrice, ownerID, clientID,
                        status, orderStatus, fullName, email, phoneNum, shippingAddress
                    ) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                cursor.execute(order_query, (
                    self.get_active_cart_id(cursor, user_id),
                    total,
                    owner_id,
                    user_id,
                    'PAID',
                    'PENDING',
                    payment_details['name'],
                    payment_details['email'],
                    payment_details['phone'],
                    payment_details['address']
                ))
                cursor.commit()
                
                cursor.execute("SELECT orderID FROM orders WHERE cartID = ? AND ownerID = ?", 
                (self.get_active_cart_id(cursor, user_id), owner_id))
                order_id = cursor.fetchone()[0]
                order_ids.append(order_id)
                # Update item quantities
                for item in owner_items:
                    update_quantity_query = """
                        UPDATE Items 
                        SET quantityAvailable = quantityAvailable - ?
                        WHERE itemID = ?
                    """
                    cursor.execute(update_quantity_query, (
                        item['quantity'],
                        item['itemId']
                    ))
                    cursor.commit()
                    cursor.execute("""
                    SELECT quantityAvailable,itemName 
                    FROM Items 
                    WHERE itemID = ?
                    """, (item['itemId'],))
                    details_item = cursor.fetchone()
                    if(int(details_item[0])<=0):
                      self.create_notification(owner_id,"AlertCircle",f"{details_item[1]} is out of stock. Update inventory to continue receiving orders.")
                    else:
                     query = """
                     SELECT 
                      p.minimumBulkAmount
                      FROM Items i
                     INNER JOIN Products p ON i.itemID = p.productID
                     WHERE p.productID = ?
                     """
                     cursor.execute(query,(item['itemId'],))
                     result4 = cursor.fetchone()
                     if result4:
                      if(int(details_item[0])<int(result4[0])):
                       self.create_notification(owner_id,"AlertCircle",f"{details_item[1]} stock is below the minimum bulk quantity. Update inventory to continue receiving orders.")
                   





                # Insert finance record
                finance_query = """
                    INSERT INTO finances (
                        orderID, paidByUserID, paidToUserID, totalAmount
                    )
                    VALUES (?, ?, ?, ?)
                """
                cursor.execute(finance_query, (
                    order_id,
                    user_id,
                    owner_id,
                    total
                ))
                cursor.commit()
                
                cursor.execute("SELECT financeID FROM finances WHERE orderID = ?", 
                (order_id,))
                
                finance_id = cursor.fetchone()[0]
                
                created_orders.append({
                    'orderId': order_id,
                    'financeId': finance_id,
                    'total': total
                })
                cursor.execute("""
                SELECT 
                CONCAT(u1.FirstName, ' ', u1.LastName) as user1_full_name
                FROM Users u1
                WHERE u1.UserId = ? 
                 """, ( user_id,))
                result_FullName = cursor.fetchone()
                self.create_notification(owner_id,"ShoppingBag",f"New order received from {result_FullName[0]}! Order# {order_id}")
                self.create_notification(user_id,"ShoppingBag",f"New order Placed Successfully! Order# {order_id}")
            # Update current cart status to completed
            update_cart_query = """
                UPDATE carts
                SET cart_status = 'COMPLETED'
                WHERE cartID = ? AND userID = ?
            """
            cursor.execute(update_cart_query, (
                self.get_active_cart_id(cursor, user_id),
                user_id
            ))
            
            # Create new cart for user
            new_cart_query = """
                INSERT INTO carts (userID, cart_status)
                VALUES (?, 'PENDING')
            """
            cursor.execute(new_cart_query, (user_id,))
            
            conn.commit()
            result,emailOrders=self.get_email_orders(user_id,order_ids)
            return True, {
                'orders': created_orders,
                'message': 'Orders processed successfully',
                'email_orders': emailOrders,
            }
            
     except Exception as e:
        print(f"Error in process_order_and_payment: {str(e)}")
        if 'conn' in locals():
            conn.rollback()  # Rollback on error
        return False, str(e)
  
    def get_email_orders(self, user_id, order_ids=None):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # Modified query to include ORDER ID filter
            query = """
                WITH LatestAcceptedNegotiation AS (
                    SELECT 
                        cartID,
                        productID,
                        quantity,
                        newPrice,
                        ROW_NUMBER() OVER (
                            PARTITION BY cartID, productID, quantity
                            ORDER BY timestamp DESC
                        ) as rn
                    FROM price_negotiations
                    WHERE negotiation_status = 'Accepted'
                )
                SELECT 
                    o.orderID,
                    o.cartID,
                    o.totalPrice,
                    o.ownerID,
                    o.clientID,
                    o.orderDate,
                    o.status,
                    o.orderStatus,
                    o.orderDeliverDate,
                    o.fullName,
                    o.email,
                    o.phoneNum,
                    o.shippingAddress,
                    ci.itemID,
                    ci.ownerName,
                    ci.quantity,
                    ci.price as originalPrice,
                    i.itemName,
                    i.itemImage,
                    lan.newPrice as negotiatedPrice,
                    i.ownerID as productOwnerID
                FROM Orders o
                INNER JOIN cart_items ci ON o.cartID = ci.cartID
                INNER JOIN Items i ON ci.itemID = i.itemID
                LEFT JOIN LatestAcceptedNegotiation lan ON 
                    lan.cartID = o.cartID 
                    AND lan.productID = ci.itemID
                    AND lan.quantity = ci.quantity
                    AND lan.rn = 1
                WHERE o.clientID = ?
                    AND (? IS NULL OR o.orderID IN (SELECT value FROM STRING_SPLIT(?, ',')))
                ORDER BY o.orderDate DESC
            """
            
            # Convert order_ids list to comma-separated string if provided
            order_ids_str = ','.join(order_ids) if order_ids else None
            
            cursor.execute(query, (user_id, order_ids_str, order_ids_str))
            rows = cursor.fetchall()
            
            if not rows:
                return False, "No orders found"
            
            # Group items by order and match owner
            orders = {}
            for row in rows:
                order_id = row[0]
                owner_id = row[3]  # Order ownerID
                product_owner_id = row[20]  # Product ownerID
                
                # Only process if the product owner matches the order owner
                if owner_id == product_owner_id:
                    if order_id not in orders:
                        orders[order_id] = {
                            'orderID': order_id,
                            'cartID': row[1],
                            'totalPrice': float(row[2]),
                            'ownerID': owner_id,
                            'clientID': row[4],
                            'orderDate': row[5].isoformat(),
                            'status': row[6],
                            'orderStatus': row[7],
                            'orderDeliverDate': row[8].isoformat() if row[8] else None,
                            'fullName': row[9],
                            'email': row[10],
                            'phoneNum': row[11],
                            'shippingAddress': row[12],
                            'items': []
                        }
                    
                    orders[order_id]['items'].append({
                        'itemId': row[13],
                        'ownerName': row[14],
                        'quantity': row[15],
                        'originalPrice': float(row[16]),
                        'itemName': row[17],
                        'itemImage': base64.b64encode(row[18]).decode('utf-8') if row[18] else None,
                        'negotiatedPrice': float(row[19]) if row[19] else None
                    })
            
            return True, list(orders.values())
            
     except Exception as e:
        print(f"Error in get_user_orders: {str(e)}")
        return False, str(e)
   
    def get_owner_id(self, cursor, item_id):
     query = "SELECT ownerID FROM items WHERE itemID = ?"
     cursor.execute(query, (item_id,))
     result = cursor.fetchone()
     return result[0] if result else None

    def get_active_cart_id(self, cursor, user_id):
     query = """
        SELECT cartID FROM carts 
        WHERE userID = ? AND cart_status = 'PENDING'
        ORDER BY created_at DESC
     """
     cursor.execute(query, (user_id,))
     result = cursor.fetchone()
     return result[0] if result else None
 
     def get_user_orders(self, user_id):
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                query = """
                    WITH LatestAcceptedNegotiation AS (
                        SELECT 
                            cartID,
                            productID,
                            quantity,
                            newPrice,
                            ROW_NUMBER() OVER (
                                PARTITION BY cartID, productID, quantity
                                ORDER BY timestamp DESC
                            ) as rn
                        FROM price_negotiations
                        WHERE negotiation_status = 'Accepted'
                    )
                    SELECT 
                        o.orderID,
                        o.cartID,
                        o.totalPrice,
                        o.ownerID,
                        o.clientID,
                        o.orderDate,
                        o.status,
                        o.orderStatus,
                        o.orderDeliverDate,
                        o.fullName,
                        o.email,
                        o.phoneNum,
                        o.shippingAddress,
                        ci.itemID,
                        ci.ownerName,
                        ci.quantity,
                        ci.price as originalPrice,
                        i.itemName,
                        i.itemImage,
                        lan.newPrice as negotiatedPrice
                    FROM Orders o
                    INNER JOIN cart_items ci ON o.cartID = ci.cartID
                    INNER JOIN Items i ON ci.itemID = i.itemID
                    LEFT JOIN LatestAcceptedNegotiation lan ON 
                        lan.cartID = o.cartID 
                        AND lan.productID = ci.itemID
                        AND lan.quantity = ci.quantity
                        AND lan.rn = 1
                    WHERE o.clientID = ?
                    ORDER BY o.orderDate DESC
                """
                
                cursor.execute(query, (user_id,))
                rows = cursor.fetchall()
                
                if not rows:
                    return False, "No orders found"
                
                # Group items by order
                orders = {}
                for row in rows:
                    order_id = row[0]
                    if order_id not in orders:
                        orders[order_id] = {
                            'orderID': order_id,
                            'cartID': row[1],
                            'totalPrice': float(row[2]),
                            'ownerID': row[3],
                            'clientID': row[4],
                            'orderDate': row[5].isoformat(),
                            'status': row[6],
                            'orderStatus': row[7],
                            'orderDeliverDate': row[8].isoformat() if row[8] else None,
                            'fullName': row[9],
                            'email': row[10],
                            'phoneNum': row[11],
                            'shippingAddress': row[12],
                            'items': []
                        }
                    
                    orders[order_id]['items'].append({
                        'itemId': row[13],
                        'ownerName': row[14],
                        'quantity': row[15],
                        'originalPrice': float(row[16]),
                        'itemName': row[17],
                        'itemImage': base64.b64encode(row[18]).decode('utf-8') if row[18] else None,
                        'negotiatedPrice': float(row[19]) if row[19] else None
                    })
                
                return True, list(orders.values())
                
        except Exception as e:
            print(f"Error in get_user_orders: {str(e)}")
            return False, str(e)
    
    def get_user_orders(self, user_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            query = """
                WITH LatestAcceptedNegotiation AS (
                    SELECT 
                        cartID,
                        productID,
                        quantity,
                        newPrice,
                        ROW_NUMBER() OVER (
                            PARTITION BY cartID, productID, quantity
                            ORDER BY timestamp DESC
                        ) as rn
                    FROM price_negotiations
                    WHERE negotiation_status = 'Accepted'
                )
                SELECT 
                    o.orderID,
                    o.cartID,
                    o.totalPrice,
                    o.ownerID,
                    o.clientID,
                    o.orderDate,
                    o.status,
                    o.orderStatus,
                    o.orderDeliverDate,
                    o.fullName,
                    o.email,
                    o.phoneNum,
                    o.shippingAddress,
                    ci.itemID,
                    ci.ownerName,
                    ci.quantity,
                    ci.price as originalPrice,
                    i.itemName,
                    i.itemImage,
                    lan.newPrice as negotiatedPrice,
                    i.ownerID as productOwnerID
                FROM Orders o
                INNER JOIN cart_items ci ON o.cartID = ci.cartID
                INNER JOIN Items i ON ci.itemID = i.itemID
                LEFT JOIN LatestAcceptedNegotiation lan ON 
                    lan.cartID = o.cartID 
                    AND lan.productID = ci.itemID
                    AND lan.quantity = ci.quantity
                    AND lan.rn = 1
                WHERE o.clientID = ?
                ORDER BY o.orderDate DESC
            """
            
            cursor.execute(query, (user_id,))
            rows = cursor.fetchall()
            
            if not rows:
                return False, "No orders found"
            
            # Group items by order and match owner
            orders = {}
            for row in rows:
                order_id = row[0]
                owner_id = row[3]  # Order ownerID
                product_owner_id = row[20]  # Product ownerID
                
                # Only process if the product owner matches the order owner
                if owner_id == product_owner_id:
                    if order_id not in orders:
                        orders[order_id] = {
                            'orderID': order_id,
                            'cartID': row[1],
                            'totalPrice': float(row[2]),
                            'ownerID': owner_id,
                            'clientID': row[4],
                            'orderDate': row[5].isoformat(),
                            'status': row[6],
                            'orderStatus': row[7],
                            'orderDeliverDate': row[8].isoformat() if row[8] else None,
                            'fullName': row[9],
                            'email': row[10],
                            'phoneNum': row[11],
                            'shippingAddress': row[12],
                            'items': []
                        }
                    
                    orders[order_id]['items'].append({
                        'itemId': row[13],
                        'ownerName': row[14],
                        'quantity': row[15],
                        'originalPrice': float(row[16]),
                        'itemName': row[17],
                        'itemImage': base64.b64encode(row[18]).decode('utf-8') if row[18] else None,
                        'negotiatedPrice': float(row[19]) if row[19] else None
                    })
       
            
            return True, list(orders.values())
            
     except Exception as e:
        print(f"Error in get_user_orders: {str(e)}")
        return False, str(e)
     
    def get_owner_orders(self, user_id):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            query = """
                WITH LatestAcceptedNegotiation AS (
                    SELECT 
                        cartID,
                        productID,
                        quantity,
                        newPrice,
                        ROW_NUMBER() OVER (
                            PARTITION BY cartID, productID, quantity
                            ORDER BY timestamp DESC
                        ) as rn
                    FROM price_negotiations
                    WHERE negotiation_status = 'Accepted'
                )
                SELECT 
                    o.orderID,
                    o.cartID,
                    o.totalPrice,
                    o.ownerID,
                    o.clientID,
                    o.orderDate,
                    o.status,
                    o.orderStatus,
                    o.orderDeliverDate,
                    o.fullName,
                    o.email,
                    o.phoneNum,
                    o.shippingAddress,
                    ci.itemID,
                    ci.ownerName,
                    ci.quantity,
                    ci.price as originalPrice,
                    i.itemName,
                    i.itemImage,
                    lan.newPrice as negotiatedPrice,
                    i.ownerID as productOwnerID
                FROM Orders o
                INNER JOIN cart_items ci ON o.cartID = ci.cartID
                INNER JOIN Items i ON ci.itemID = i.itemID
                LEFT JOIN LatestAcceptedNegotiation lan ON 
                    lan.cartID = o.cartID 
                    AND lan.productID = ci.itemID
                    AND lan.quantity = ci.quantity
                    AND lan.rn = 1
                WHERE o.ownerID = ?
                ORDER BY o.orderDate DESC
            """
            
            cursor.execute(query, (user_id,))
            rows = cursor.fetchall()
            
            if not rows:
                return False, "No orders found"
            
            # Group items by order and match owner
            orders = {}
            for row in rows:
                order_id = row[0]
                owner_id = row[3]  # Order ownerID
                product_owner_id = row[20]  # Product ownerID
                
                # Only process if the product owner matches the order owner
                if owner_id == product_owner_id:
                    if order_id not in orders:
                        orders[order_id] = {
                            'orderID': order_id,
                            'cartID': row[1],
                            'totalPrice': float(row[2]),
                            'ownerID': owner_id,
                            'clientID': row[4],
                            'orderDate': row[5].isoformat(),
                            'status': row[6],
                            'orderStatus': row[7],
                            'orderDeliverDate': row[8].isoformat() if row[8] else None,
                            'fullName': row[9],
                            'email': row[10],
                            'phoneNum': row[11],
                            'shippingAddress': row[12],
                            'items': []
                        }
                    
                    orders[order_id]['items'].append({
                        'itemId': row[13],
                        'ownerName': row[14],
                        'quantity': row[15],
                        'originalPrice': float(row[16]),
                        'itemName': row[17],
                        'itemImage': base64.b64encode(row[18]).decode('utf-8') if row[18] else None,
                        'negotiatedPrice': float(row[19]) if row[19] else None
                    })
       
            
            return True, list(orders.values())
            
     except Exception as e:
        print(f"Error in get_user_orders: {str(e)}")
        return False, str(e)
   
    def update_order_status(self, order_id, new_status, owner_id):
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                fetch_client_query = """
                 SELECT clientID 
                 FROM Orders 
                 WHERE orderID = ? AND ownerID = ?
                """ 
                # Verify owner has permission to update this order
                query = """
                    UPDATE Orders 
                    SET orderStatus = ?
                    WHERE orderID = ? AND ownerID = ?
                """
                
                cursor.execute(query, (new_status, order_id, owner_id))
                conn.commit()
                cursor.execute(fetch_client_query, (order_id, owner_id))
                result = cursor.fetchone()
                if result:
                   client_id = result[0]
                   if(new_status=='Delivered'):
                       self.create_notification(client_id,'CheckCircle',f"Your order #{order_id} has been Delivered.")
                  
                   elif(new_status=='In_Transit'):
                       self.create_notification(client_id,'Truck',f"Your order #{order_id} is in Transit.")
                   
                   elif(new_status=='Processing'):
                       self.create_notification(client_id,'Package',f"Your order #{order_id} is currently Processing.")
                   
                   elif(new_status=='Pending'):
                       self.create_notification(client_id,'Clock',f"Your order #{order_id} is Pending.")
                   
                   elif(new_status=='Ready_For_Delivery'):
                       self.create_notification(client_id,'PackageCheck',f"Your order #{order_id} is ready for Delivery.")
                   
                   
                if cursor.rowcount == 0:
                    return False, "Order not found or you don't have permission to update it"
                
                return True, "Order status updated successfully"
                
        except Exception as e:
            print(f"Error in update_order_status: {str(e)}")
            return False, str(e)
    
    
    def get_finance_analytics(self,owner_id):
     try:
         with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # Get basic financial statistics
            cursor.execute("""
                SELECT 
                    COUNT(f.financeID) as total_transactions,
                    SUM(f.totalAmount) as total_earnings,
                    AVG(f.totalAmount) as avg_transaction,
                    MIN(f.totalAmount) as min_transaction,
                    MAX(f.totalAmount) as max_transaction
                FROM Finances f
                WHERE f.paidToUserID = ?
            """, owner_id)
            
            basic_stats = cursor.fetchone()
            
            # Get monthly earnings for the past 12 months
            cursor.execute("""
                SELECT 
                    FORMAT([timestamp], 'yyyy-MM') as month,
                    SUM(totalAmount) as monthly_earnings,
                    COUNT(financeID) as transaction_count
                FROM Finances
                WHERE paidToUserID = ?
                    AND [timestamp] >= DATEADD(month, -12, GETDATE())
                GROUP BY FORMAT([timestamp], 'yyyy-MM')
                ORDER BY month DESC
            """, owner_id)
            
            monthly_data = cursor.fetchall()
            
            # Get order status distribution
            cursor.execute("""
                SELECT 
                    o.orderStatus,
                    COUNT(*) as status_count
                FROM Orders o
                INNER JOIN Finances f ON o.orderID = f.orderID
                WHERE f.paidToUserID = ?
                GROUP BY o.orderStatus
            """, owner_id)
            
            status_distribution = cursor.fetchall()
            
            # Get pending orders (not delivered)
            cursor.execute("""
                SELECT 
                    o.orderID,
                    o.orderDate,
                    o.totalPrice,
                    o.orderStatus
                FROM Orders o
                WHERE o.ownerID = ?
                    AND o.orderStatus != 'Delivered'
                ORDER BY o.orderDate DESC
            """, owner_id)
            
            pending_orders = cursor.fetchall()
            
            # Get recent finances with order status
            cursor.execute("""
                SELECT TOP 50
                    f.financeID,
                    f.orderID,
                    f.[timestamp],
                    f.totalAmount,
                    o.orderStatus as status,
                    u.FirstName + ' ' + u.LastName as customer_name
                FROM Finances f
                INNER JOIN Orders o ON f.orderID = o.orderID
                INNER JOIN Users u ON f.paidByUserID = u.UserId
                WHERE f.paidToUserID = ?
                ORDER BY f.[timestamp] DESC
            """, owner_id)
            
            finances = cursor.fetchall()
            
            return {
                'basic_stats': {
                    'total_transactions': basic_stats[0],
                    'total_earnings': float(basic_stats[1]) if basic_stats[1] else 0,
                    'avg_transaction': float(basic_stats[2]) if basic_stats[2] else 0,
                    'min_transaction': float(basic_stats[3]) if basic_stats[3] else 0,
                    'max_transaction': float(basic_stats[4]) if basic_stats[4] else 0
                },
                'monthly_data': [{
                    'month': row[0],
                    'earnings': float(row[1]),
                    'transactions': row[2]
                } for row in monthly_data],
                'status_distribution': [{
                    'status': row[0],
                    'count': row[1]
                } for row in status_distribution],
                'pending_orders': [{
                    'orderID': row[0],
                    'orderDate': row[1].isoformat() if row[1] else None,
                    'totalPrice': float(row[2]),
                    'orderStatus': row[3]
                } for row in pending_orders],
                'finances': [{
                    'financeID': row[0],
                    'orderID': row[1],
                    'timestamp': row[2].isoformat() if row[2] else None,
                    'totalAmount': float(row[3]),
                    'status': row[4],
                    'customerName': row[5]
                } for row in finances]
            }
            
     except Exception as e:
        print(f"Error: {str(e)}")
        return None
     
    def filter_owner_finances(self, owner_id, start_date=None, end_date=None, status=None):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            query = """
                SELECT 
                    f.financeID,
                    f.orderID,
                    f.[timestamp],
                    f.totalAmount,
                    o.orderStatus as status,
                    u.FirstName + ' ' + u.LastName as customer_name
                FROM Finances f
                INNER JOIN Orders o ON f.orderID = o.orderID
                INNER JOIN Users u ON f.paidByUserID = u.UserId
                WHERE f.paidToUserID = ?
            """
            params = [owner_id]
            print(end_date)
            if start_date:
                query += " AND CAST(f.[timestamp] AS DATE) >= ?"
                params.append(start_date)
            if end_date:
                query += " AND CAST(f.[timestamp] AS DATE) <= ?"
                params.append(end_date)
            if status:
                query += " AND o.orderStatus = ?"
                params.append(status)
                
            query += " ORDER BY f.[timestamp] DESC"
            cursor.execute(query, params)
            
            results = cursor.fetchall()
            
            return [{
                'financeID': row[0],
                'orderID': row[1],
                'timestamp': row[2].isoformat() if row[2] else None,
                'totalAmount': float(row[3]),
                'status': row[4],
                'customerName': row[5]
            } for row in results]
            
     except Exception as e:
        print(f"Error in filter_owner_finances: {str(e)}")
        return None
     
    def get_finance_summary(self, owner_id, period='month'):
     try:
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            
            # Set date format based on period
            date_format = {
                'day': 'yyyy-MM-dd',
                'week': 'yyyy-WW',
                'month': 'yyyy-MM',
                'year': 'yyyy'
            }.get(period, 'yyyy-MM')
                
            cursor.execute(f"""
                SELECT 
                    FORMAT([timestamp], ?) as period,
                    COUNT(*) as transaction_count,
                    SUM(totalAmount) as total_amount,
                    AVG(totalAmount) as avg_amount
                FROM Finances
                WHERE paidToUserID = ?
                GROUP BY FORMAT([timestamp], ?)
                ORDER BY period DESC
            """, date_format, owner_id, date_format)
            
            results = cursor.fetchall()
            
            return [{
                'period': row[0],
                'transactionCount': row[1],
                'totalAmount': float(row[2]) if row[2] else 0,
                'avgAmount': float(row[3]) if row[3] else 0
            } for row in results]
            
     except Exception as e:
        print(f"Error in get_finance_summary: {str(e)}")
        return None
     
    def get_agribusiness_analytics(self, owner_id):
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                # Get monthly revenue
                cursor.execute("""
                    SELECT ISNULL(SUM(f.totalAmount), 0) as monthly_revenue
                    FROM dbo.Finances f
                    INNER JOIN dbo.Orders o ON f.orderID = o.orderID
                    WHERE o.ownerID = ?
                    AND f.[timestamp] >= DATEADD(month, -1, GETDATE())
                """, owner_id)
                monthly_revenue = cursor.fetchone()[0]

                # Get active products count
                cursor.execute("""
                    SELECT COUNT(*) as active_products
                    FROM Items
                    WHERE ownerID = ? AND quantityAvailable > 0
                """, owner_id)
                active_products = cursor.fetchone()[0]

                # Get completed orders
                cursor.execute("""
                    SELECT COUNT(*) as completed_orders
                    FROM dbo.Orders
                    WHERE ownerID = ? AND orderStatus = 'Delivered'
                """, owner_id)
                completed_orders = cursor.fetchone()[0]

                # Get pending orders
                cursor.execute("""
                    SELECT COUNT(*) as pending_orders
                    FROM dbo.Orders
                    WHERE ownerID = ? AND orderStatus != 'Delivered'
                """, owner_id)
                pending_orders = cursor.fetchone()[0]

                return {
                    'monthly_revenue': float(monthly_revenue),
                    'active_products': active_products,
                    'completed_orders': completed_orders,
                    'pending_orders': pending_orders
                }

        except Exception as e:
            print(f"Error fetching agribusiness analytics: {str(e)}")
            return None

    def get_farmer_analytics(self, owner_id):
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                # Get monthly revenue
                cursor.execute("""
                    SELECT ISNULL(SUM(f.totalAmount), 0) as monthly_revenue
                    FROM dbo.Finances f
                    INNER JOIN dbo.Orders o ON f.orderID = o.orderID 
                    WHERE o.ownerID = ?
                    AND f.[timestamp] >= DATEADD(month, -1, GETDATE())
                """, owner_id)
                monthly_revenue = cursor.fetchone()[0]

                # Get active products count
                cursor.execute("""
                    SELECT COUNT(*) as active_products
                    FROM Items
                    WHERE ownerID = ? AND quantityAvailable > 0
                """, owner_id)
                active_products = cursor.fetchone()[0]

                # Get total spendings
                cursor.execute("""
                    SELECT ISNULL(SUM(f.totalAmount), 0) as total_spendings
                    FROM dbo.Finances f
                    INNER JOIN dbo.Orders o ON f.orderID = o.orderID
                    WHERE o.clientID = ?
                """, owner_id)
                total_spendings = cursor.fetchone()[0]
                # Get completed orders
                cursor.execute("""
                    SELECT COUNT(*) as completed_orders
                    FROM dbo.Orders
                    WHERE ownerID = ? AND orderStatus = 'Delivered'
                """, owner_id)
                completed_orders = cursor.fetchone()[0]

                # Get pending orders
                cursor.execute("""
                    SELECT COUNT(*) as pending_orders
                    FROM dbo.Orders
                    WHERE ownerID = ? AND orderStatus != 'Delivered'
                """, owner_id)
                pending_orders = cursor.fetchone()[0]

                # Get active negotiations
                cursor.execute("""
                    SELECT COUNT(*) as active_negotiations
                    FROM price_negotiations
                    WHERE farmerID = ? AND negotiation_status = 'Pending'
                """, owner_id)
                active_negotiations = cursor.fetchone()[0]

                return {
                    'monthly_revenue': float(monthly_revenue),
                    'active_products': active_products,
                    'completed_orders': completed_orders,
                    'pending_orders': pending_orders,
                    'active_negotiations': active_negotiations,
                    'total_spendings':float(total_spendings)
                }

        except Exception as e:
            print(f"Error fetching farmer analytics: {str(e)}")
            return None

    def get_consumer_analytics(self, user_id):
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                # Get total orders placed
                cursor.execute("""
                    SELECT COUNT(*) as total_orders
                    FROM dbo.Orders
                    WHERE clientID = ?
                """, user_id)
                total_orders = cursor.fetchone()[0]

                # Get total spendings
                cursor.execute("""
                    SELECT ISNULL(SUM(f.totalAmount), 0) as total_spendings
                    FROM dbo.Finances f
                    INNER JOIN dbo.Orders o ON f.orderID = o.orderID
                    WHERE o.clientID = ?
                """, user_id)
                total_spendings = cursor.fetchone()[0]

                # Get accepted negotiations
                cursor.execute("""
                    SELECT COUNT(*) as accepted_negotiations
                    FROM price_negotiations
                    WHERE consumerID = ? AND negotiation_status = 'Accepted'
                """, user_id)
                accepted_negotiations = cursor.fetchone()[0]

                # Get pending orders
                cursor.execute("""
                    SELECT COUNT(*) as pending_orders
                    FROM dbo.Orders
                    WHERE clientID = ? AND orderStatus != 'Delivered'
                """, user_id)
                pending_orders = cursor.fetchone()[0]

                return {
                    'total_orders': total_orders,
                    'total_spendings': float(total_spendings),
                    'accepted_negotiations': accepted_negotiations,
                    'pending_orders': pending_orders
                }

        except Exception as e:
            print(f"Error fetching consumer analytics: {str(e)}")
            return None
        
    def get_user_notifications(self, user_id):
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                query = """
                SELECT n.*, 
                       (SELECT COUNT(*) 
                        FROM notifications 
                        WHERE userID = ? AND status = 'unread') as unread_count
                FROM notifications n
                WHERE n.userID = ?
                ORDER BY n.timestamp DESC
                """
                
                cursor.execute(query, (user_id, user_id))
                columns = [column[0] for column in cursor.description]
                notifications = []
                
                for row in cursor.fetchall():
                    notification = dict(zip(columns, row))
                    notifications.append(notification)
                
                if notifications:
                    unread_count = notifications[0]['unread_count']
                    return {"notifications": notifications, "unread_count": unread_count}, HTTPStatus.OK
                
                return {"notifications": [], "unread_count": 0}, HTTPStatus.OK
                
        except Exception as e:
            return {"error": str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR

    def mark_notification_read(self, notification_id, user_id):
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                # Verify notification belongs to user
                verify_query = """
                SELECT userID FROM notifications 
                WHERE notificationID = ?
                """
                cursor.execute(verify_query, (notification_id,))
                result = cursor.fetchone()
                
                if not result:
                    return {"error": "Notification not found"}, HTTPStatus.NOT_FOUND
                
                if result[0] != user_id:
                    return {"error": "Unauthorized access"}, HTTPStatus.FORBIDDEN
                
                update_query = """
                UPDATE notifications 
                SET status = 'read'
                WHERE notificationID = ?
                """
                cursor.execute(update_query, (notification_id,))
                conn.commit()
                
                return {"message": "Notification marked as read"}, HTTPStatus.OK
                
        except Exception as e:
            return {"error": str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR

    def delete_notification(self, notification_id, user_id):
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                # Verify notification belongs to user
                verify_query = """
                SELECT userID FROM notifications 
                WHERE notificationID = ?
                """
                cursor.execute(verify_query, (notification_id,))
                result = cursor.fetchone()
                
                if not result:
                    return {"error": "Notification not found"}, HTTPStatus.NOT_FOUND
                
                if result[0] != user_id:
                    return {"error": "Unauthorized access"}, HTTPStatus.FORBIDDEN
                
                delete_query = """
                DELETE FROM notifications 
                WHERE notificationID = ?
                """
                cursor.execute(delete_query, (notification_id,))
                conn.commit()
                
                return {"message": "Notification deleted successfully"}, HTTPStatus.OK
                
        except Exception as e:
            return {"error": str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR

    def create_notification(self, user_id, notification_type, text):
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                insert_query = """
                INSERT INTO notifications (userID, type, text, status)
                VALUES (?, ?, ?, 'unread')
                """
                
                cursor.execute(insert_query, (user_id, notification_type, text))
                conn.commit()
                
                return {"message": "Notification created successfully"}, HTTPStatus.CREATED
                
        except Exception as e:
            return {"error": str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR
        
    def create_iot_request(self, data):
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                insert_query = """
                INSERT INTO iot_integration_requests 
                (user_id, farm_size, crop_type, sensor_preference, budget_range, 
                phone_number, location, preferred_contact_time, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
                """
                
                cursor.execute(insert_query, (
                    data['userId'],
                    data['farmSize'],
                    data['cropType'],
                    data['sensorPreference'],
                    data['budget'],
                    data['phoneNumber'],
                    data['location'],
                    data['preferredContactTime']
                ))
                conn.commit()
                
                return {"message": "IoT integration request created successfully"}, HTTPStatus.CREATED
                
        except Exception as e:
            return {"error": str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR

    def get_user_request(self, user_id):
        try:
            with pyodbc.connect(self.conn_str) as conn:
                cursor = conn.cursor()
                
                select_query = """
                SELECT * FROM iot_integration_requests 
                WHERE user_id = ? 
                ORDER BY created_at DESC
                """
                
                cursor.execute(select_query, (user_id,))
                row = cursor.fetchone()
                
                if row:
                    columns = [column[0] for column in cursor.description]
                    request_data = dict(zip(columns, row))
                    return {"data": request_data}, HTTPStatus.OK
                return {"message": "No request found"}, HTTPStatus.NOT_FOUND
                
        except Exception as e:
            return {"error": str(e)}, HTTPStatus.INTERNAL_SERVER_ERROR