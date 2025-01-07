from base64 import b64encode
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
            