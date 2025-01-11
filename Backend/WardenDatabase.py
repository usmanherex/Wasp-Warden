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
            
            elif user_type == 'Agri-Business':
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
                    'minimumBulkAmount': row[7],
                    'category': row[8],
                    'metricSystem': row[9]
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
                        itemImage = COALESCE(?, itemImage)
                    WHERE itemID = ?
                """, (
                    product_data['itemName'],
                    product_data['itemPrice'],
                    product_data['itemDescription'],
                    product_data['quantityAvailable'],
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
   