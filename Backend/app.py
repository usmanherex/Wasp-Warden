from email.utils import formatdate
import secrets
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import smtplib 
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from werkzeug.security import generate_password_hash
from WardenDatabase import WardernDatabase
import jwt
from datetime import datetime, timedelta
from functools import wraps

from flask_mail import Mail, Message

# Initialize password reset tokens storage (in production, use a database)
reset_tokens = {}

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'waspxxx'

def send_reset_email(recipient_email, reset_link, user_name):
    html_content = f"""
    <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>Hello {user_name},</p>
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <p><a href="{reset_link}">Reset Password</a></p>
            <p>Or copy and paste this link in your browser:</p>
            <p>{reset_link}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Best regards,</p>
            <p>WaspWarden Team</p>
        </body>
    </html>
    """

    smtp_server = 'smtp-mail.outlook.com'
    smtp_port = 587
    smtp_user = 'yourEmailHere'
    smtp_password = 'yourPasswordHere'
    from_email = 'yourEmailHere'
    message = MIMEMultipart('alternative')
    message['From'] = from_email
    message['To'] = recipient_email
    message['Subject'] = 'Password Reset Request - WaspWarden'
    message['Date'] = formatdate(localtime=True)

    text_part = MIMEText(reset_link, 'plain')
    html_part = MIMEText(html_content, 'html')

    print(reset_link)
    message.attach(text_part)
    message.attach(html_part)

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(message)
        server.quit()
        print("Email sent successfully")
        return True
    except Exception as e:
        print(f"Failed to send email. Error: {e}")
        return False

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({'message': 'Email is required'}), 400

        user = db.get_user_by_email(email)
        if not user:
            return jsonify({'message': 'Password reset instructions have been sent if the email exists'}), 200

        reset_token = secrets.token_urlsafe(32)
        reset_tokens[reset_token] = {
            'email': email,
            'expires': datetime.utcnow() + timedelta(hours=1)
        }

        reset_link = f"http://localhost:3000/reset-password/{reset_token}"
        
        if send_reset_email(email, reset_link, user.get('FirstName', '')):
            return jsonify({
                'message': 'Password reset instructions have been sent to your email',
                'status': 'success'
            }), 200
        else:
            return jsonify({
                'message': 'Failed to send reset email. Please try again later.',
                'status': 'error'
            }), 500

    except Exception as e:
        print(f"Password reset error: {str(e)}")
        return jsonify({
            'message': 'An error occurred during password reset',
            'status': 'error',
            'error': str(e)
        }), 500


@app.route('/api/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    try:
        if token not in reset_tokens:
            return jsonify({'message': 'Invalid or expired reset token'}), 400

        token_data = reset_tokens[token]
        if datetime.utcnow() > token_data['expires']:
            del reset_tokens[token]
            return jsonify({'message': 'Reset token has expired'}), 400

        if request.method == 'GET':
            return jsonify({'message': 'Token valid. Proceed with resetting your password.'}), 200

        data = request.get_json()
        new_password = data.get('new_password')

        if not new_password:
            return jsonify({'message': 'New password is required'}), 400

        hashed_password = generate_password_hash(new_password)
        db.update_user_password(token_data['email'], hashed_password)

        del reset_tokens[token]

        return jsonify({'message': 'Password has been reset successfully'}), 200

    except Exception as e:
        return jsonify({'message': str(e)}), 500

    except Exception as e:
        return jsonify({'message': str(e)}), 500

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token.split()[1], app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['user']
        except:
            return jsonify({'message': 'Token is invalid'}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

db = WardernDatabase(
    server='DESKTOP-6HS4LFD\\SQLEXPRESS', 
    database='WaspWardenDB',
    #Username and Password will be used when db is not local
    username='your_username', 
    password='your_password'
)

@app.route('/register', methods=['POST'])
def register_user():
    try:
        # Handle profile picture
        profile_picture = request.files.get('profilePicture')
        profile_picture_binary = None
        if profile_picture:
            # Read file and convert to binary
            profile_picture_binary = profile_picture.read()

        # Prepare user data
        user_data = {
            'userName': request.form.get('userName'),
            'firstName': request.form.get('firstName'),
            'lastName': request.form.get('lastName'),
            'email': request.form.get('email'),
            'password': generate_password_hash(request.form.get('password')),
            'phoneNumber': request.form.get('phoneNumber'),
            'nationalID': request.form.get('nationalID'),
            'address': request.form.get('address', ''),
            'gender': request.form.get('gender'),
            'profilePicture': profile_picture_binary
        }

        # Determine user type and additional data
        user_type = request.form.get('userType')
        
        if user_type.lower() == 'consumer':
            additional_data = {
                'consumerType': request.form.get('consumerType'),
                'associatedCompany': request.form.get('associatedCompany', '')
            }
        
        elif user_type.lower() == 'agri-business':
            additional_data = {
                'businessName': request.form.get('businessName'),
                'businessDescription': request.form.get('businessDescription'),
                'businessType': request.form.get('businessType'),
                'businessRegistrationNumber': request.form.get('businessRegistrationNumber')
            }
        
        elif user_type.lower() == 'farmer':
            additional_data = {
                'farmAddress': request.form.get('farmAddress'),
                'farmSize': float(request.form.get('farmSize', 0)),
                'specialization': request.form.get('specialization'),
                'farmYieldCapacity': float(request.form.get('farmYieldCapacity', 0))
            }
        
        else:
            return jsonify({'message': 'Invalid user type'}), 400

        user_id = db.register_user(user_data, additional_data, user_type.capitalize())

        return jsonify({'message': 'Registration successful', 'userId': user_id}), 201

    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        identifier = data.get('identifier')
        password = data.get('password')

        if not identifier or not password:
            return jsonify({'message': 'Missing identifier or password'}), 400

        user = db.authenticate_user(identifier, password)
        
        if user:
            token = jwt.encode({
                'user': user,
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, app.config['SECRET_KEY'])
            
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': user
            }), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'message': str(e)}), 500

    except Exception as e:
        return jsonify({'message': str(e)}), 500

    
if __name__ == '__main__':
    app.run(debug=True)