import base64
from http import HTTPStatus
import json
import os
import secrets
import jwt
import smtplib 
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from werkzeug.utils import secure_filename
from base64 import b64decode
from email.utils import formatdate
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from werkzeug.security import generate_password_hash
from WardenDatabase import WardernDatabase
import jwt
from datetime import datetime, timedelta
from functools import wraps
import stripe
reset_tokens = {}

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'waspxxx'

socketio = SocketIO(app, cors_allowed_origins="*")

db = WardernDatabase(
    server='DEADSEC', 
    database='WaspWardenDB',
    #Username and Password will be used when db is not local
    username='your_username', 
    password='your_password'
)

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


@app.route('/register', methods=['POST'])
def register_user():
    try:
        profile_picture = request.files.get('profilePicture')
        profile_picture_binary = None
        user_type = request.form.get('userType') 
        if profile_picture:
            profile_picture_binary = profile_picture.read()

        user_data = {
            'userName': request.form.get('userName'),
            'firstName': request.form.get('firstName'),
            'lastName': request.form.get('lastName'),
            'email': request.form.get('email'),
            'password': generate_password_hash(request.form.get('password')),
            'phoneNumber': request.form.get('phoneNumber'),
            'nationalID': request.form.get('nationalID'),
            'address': request.form.get('businessAddress', '') if user_type == 'Agri-business' else request.form.get('address', ''),
            'gender': request.form.get('gender'),
            'profilePicture': profile_picture_binary
        }

        # Determine user type and additional data
        
        print(user_type)
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

@app.route('/api/users/profile-picture/<int:user_id>', methods=['GET'])
def get_profile_picture(user_id):
    try:
        image_binary = db.get_user_profile_picture(user_id)
        
        if image_binary:
            return send_file(
                image_binary,
                mimetype='image/jpeg', 
                as_attachment=False
            )
        else:
            return jsonify({'error': 'No profile picture found'}), 404
            
    except Exception as e:
        print(f"Error fetching profile picture: {e}")
        return jsonify({'error': 'Internal server error'}), 500
        
def authenticate_socket(token):
    try:
        return jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except:
        return None

@socketio.on('connect')
def handle_connect():
    token = request.args.get('token')
    if not token or not authenticate_socket(token):
        return False
    return True

@socketio.on('join_chat')
def handle_join_chat(data):
    chat_id = data['chatId']
    room = f"chat_{chat_id}"
    join_room(room)

@socketio.on('leave_chat')
def handle_leave_chat(data):
    chat_id = data['chatId']
    room = f"chat_{chat_id}"
    leave_room(room)

@socketio.on('send_message')
def handle_message(data):
    token = request.args.get('token')
    decoded_token = authenticate_socket(token)
    if not decoded_token:
        return

    chat_id = data['chatId']
    sender_id = decoded_token['user']['userId']
    receiver_id = data['receiverId']
    message_type = data['messageType']
    content = data.get('content')
    
    file_data = None
    content_type = None
    if 'fileData' in data:
        file_data = b64decode(data['fileData'].split(',')[1])
        content_type = data['contentType']

    message = db.save_message(
        chat_id, sender_id, receiver_id, message_type, 
        content, file_data, content_type
    )
    
    room = f"chat_{chat_id}"
    emit('new_message', message, room=room)

@socketio.on('initiate_call')
def handle_call_initiation(data):
    token = request.args.get('token')
    decoded_token = authenticate_socket(token)
    if not decoded_token:
        return

    caller_id = decoded_token['user']['userId']
    receiver_id = data['receiverId']
    call_type = data['callType']  # 'audio' or 'video'
    chat_id = data['chatId']
    
    # Save call record to database
    call = db.create_call(
        chat_id=chat_id,
        caller_id=caller_id,
        receiver_id=receiver_id,
        call_type=call_type
    )
    
    # Emit call request to the receiver
    room = f"chat_{chat_id}"
    emit('incoming_call', {
        'callId': call['callId'],
        'callerId': caller_id,
        'callType': call_type,
        'chatId': chat_id
    }, room=room)

@socketio.on('accept_call')
def handle_call_accept(data):
    token = request.args.get('token')
    decoded_token = authenticate_socket(token)
    if not decoded_token:
        return
        
    call_id = data['callId']
    chat_id = data['chatId']
    
    # Update call status in database
    db.update_call_status(call_id, 'connected')
    
    room = f"chat_{chat_id}"
    emit('call_accepted', {
        'callId': call_id,
        'peerId': decoded_token['user']['userId']
    }, room=room)

@socketio.on('reject_call')
def handle_call_reject(data):
    call_id = data['callId']
    chat_id = data['chatId']
    reason = data.get('reason', 'declined')
    
    # Update call status in database
    db.update_call_status(call_id, 'rejected')
    
    room = f"chat_{chat_id}"
    emit('call_rejected', {
        'callId': call_id,
        'reason': reason
    }, room=room)


@socketio.on('end_call')
def handle_call_end(data):
    try:
        call_id = data['callId']
        chat_id = data['chatId']
        
        db.end_call(call_id)
        
        room = f"chat_{chat_id}"
        emit('call_ended', {
            'callId': call_id
        }, room=room)
    except KeyError as e:
        print(f"Missing required data for end_call: {str(e)}")
        return {'error': f'Missing required field: {str(e)}'}

@app.route('/api/chats/<int:user_id>', methods=['GET'])
def get_chats(user_id):
    chats = db.get_user_chats(user_id)
    return jsonify(chats)

@app.route('/api/messages/<int:chat_id>', methods=['GET'])
def get_messages(chat_id):
    messages = db.get_chat_messages(chat_id)
    return jsonify(messages)

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({
            'message': 'File uploaded successfully',
            'fileUrl': f'/uploads/{filename}'
        }), 201

def send_reset_email(recipient_email, reset_link, user_name):
    html_content = f"""
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    color: #333;
                }}
                .logo {{
                    text-align: center;
                    margin-bottom: 30px;
                }}
                .logo img {{
                    width: 100px;
                }}
                h1 {{
                    color: #1B8755;
                    text-align: center;
                    font-size: 24px;
                }}
                .button {{
                    background-color: #1B8755;
                    color: white !important;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 4px;
                    display: inline-block;
                    margin: 20px 0;
                }}
                .center {{
                    text-align: center;
                }}
                .warning {{
                    background-color: #fff9e6;
                    border-left: 4px solid #ffd700;
                    padding: 15px;
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                    margin-top: 40px;
                }}
            </style>
        </head>
        <body>
            <div class="logo">
                <a href="https://imgbb.com/"><img src="https://i.ibb.co/gvNCKYj/wasp.png" alt="wasp" border="0"></a>
            </div>
            <h1>Password Reset Request</h1>
            <p>Hello {user_name},</p>
            <p>We received a request to reset your password for your WaspWarden account. Click the button below to create a new password:</p>
            <div class="center">
                <a href="{reset_link}" class="button">Reset Your Password</a>
            </div>
            <p>You can also paste this link directly into your browser:</p>
            <p><a href="{reset_link}">{reset_link}</a></p>
            <div class="warning">
                <strong>Important:</strong> This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact our support team.
            </div>
            <p>If you need assistance, please contact our support team.</p>
            <div class="footer">
                <p>Best regards,<br>
                WaspWarden Team</p>
                <p>© 2024 WaspWarden. All rights reserved.</p>
            </div>
        </body>
    </html>
    """

    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user = 'waspwardenproject@gmail.com'
    smtp_password = 'deif snid bkuv wbon'
    from_email = 'waspwardenproject@gmail.com'
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
        db.create_notification(db.authenticate_userID(recipient_email),"MailWarning","A password reset link has been sent to your email address")
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
    
@app.route('/farmer-products/create', methods=['POST'])
def create_product():
    try:
        data = request.json
        
        # Validate user is logged in and is a farmer
        if not data.get('userId'):
            return jsonify({
                'success': False,
                'message': 'User not logged in'
            }), 401
        
        if data.get('userType') != 'Farmer':
            return jsonify({
                'success': False,
                'message': 'Only farmers can create products'
            }), 403

        # Validate required fields
        required_fields = ['title', 'category', 'description', 'price', 
                         'metric', 'quantity', 'minimumBulk']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400

        # Create product with item
        success, message = db.create_product_with_item({
            'userId': data['userId'],
            'title': data['title'],
            'description': data['description'],
            'category': data['category'],
            'price': float(data['price']),
            'metric': data['metric'],
            'quantity': int(data['quantity']),
            'minimumBulk': int(data['minimumBulk']),
            'image': data.get('image')
        })

        if success:
            return jsonify({
                'success': True,
                'message': message
            })
        else:
            return jsonify({
                'success': False,
                'message': f'Failed to create product: {message}'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500

@app.route('/agribusiness-products/create', methods=['POST'])
def create_product_agribusiness():
    try:
        data = request.json
        
        # Validate user is logged in and is a farmer
        if not data.get('userId'):
            return jsonify({
                'success': False,
                'message': 'User not logged in'
            }), 401
        
        if data.get('userType') != 'Agri-business':
            return jsonify({
                'success': False,
                'message': 'Only AgriBusiness can create products'
            }), 403

        # Validate common required fields
        common_required_fields = ['userId', 'title',  'description', 'price', 'quantity in Stock' ]
        for field in common_required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400

        # Additional validation based on product type
        if data.get('productType') == 'Machine':
            required_fields = ['machineType', 'machineWeight', 'powerSource', 'warranty']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({
                        'success': False,
                        'message': f'Missing required field for machine: {field}'
                    }), 400

        elif data.get('productType') == 'Chemical':
            required_fields = ['metricSystem', 'chemicalType', 'expiryDate', 'hazardLevel','quantity']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({
                        'success': False,
                        'message': f'Missing required field for chemical: {field}'
                    }), 400

        # Create product with item
        success, message = db.create_agribusiness_item(data)
        
        if success:
            return jsonify({
                'success': True,
                'message': message
            })
        else:
            return jsonify({
                'success': False,
                'message': f'Failed to create product: {message}'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500
    
@app.route('/agribusiness-products/<user_id>', methods=['GET'])
def get_agribusiness_products(user_id):
    try:
        # Get user type from request
        user_type = request.args.get('userType')
        
        if user_type != 'Agri-business':
            return jsonify({
                'success': False,
                'message': 'Only Agri-business users can access these products'
            }), 403

        success, results = db.get_agribusiness_items(user_id)
        
        if success:
            return jsonify({
                'success': True,
                'data': results
            })
        else:
            return jsonify({
                'success': False,
                'message': f'Failed to fetch products: {results}'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500
    
@app.route('/farmer-products/<int:farmer_id>', methods=['GET'])
def get_farmer_products(farmer_id):
    success, result = db.get_farmer_products(farmer_id)
    if success:
        return jsonify({
            'success': True,
            'products': result
        })
    return jsonify({
        'success': False,
        'message': str(result)
    }), 500
# API route using the function
@app.route('/agribusiness-product/<int:product_id>', methods=['PUT'])
def update_product_agribusiness(product_id):
    try:
        data = request.json
      
        success, result = db.update_agribusiness_product(product_id, data)
        
        if success:
            return jsonify({
                'success': True,
                'message': result
            })
        return jsonify({
            'success': False,
            'message': result
        }), 500
        
    except Exception as e:
        print(f"Error in update_product route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
    
@app.route('/agribusiness-product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        success, result = db.get_agribusiness_product(product_id)
        
        if success:
            return jsonify({
                'success': True,
                'product': result
            })
        return jsonify({
            'success': False,
            'message': result
        }), 404 if result == "Product not found" else 500
        
    except Exception as e:
        print(f"Error in get_product route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/agribusiness-product/<int:product_id>', methods=['DELETE'])
def delete_agribusiness_product(product_id):
    try:
        success, result = db.delete_agribusiness_product(product_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': result
            })
        return jsonify({
            'success': False,
            'message': result
        }), 404 if result == "Product not found" else 500
        
    except Exception as e:
        print(f"Error in delete_product route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
    
@app.route('/farmer/products/<int:product_id>', methods=['GET'])
def get_product_details(product_id):
    success, result = db.get_product_details(product_id)
    if success:
        return jsonify({
            'success': True,
            'product': result
        })
    return jsonify({
        'success': False,
        'message': str(result)
    }), 404 if result == "Product not found" else 500

@app.route('/farmer/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    # Verify that the product belongs to the requesting farmer
    success, product = db.get_product_details(product_id)
    if not success:
        return jsonify({
            'success': False,
            'message': 'Product not found'
        }), 404
    
    if product['ownerId'] != request.json.get('userId'):
        return jsonify({
            'success': False,
            'message': 'Unauthorized to modify this product'
        }), 403
    
    success, message = db.update_product(product_id, request.json)
    if success:
        return jsonify({
            'success': True,
            'message': message
        })
    return jsonify({
        'success': False,
        'message': str(message)
    }), 500

@app.route('/farmer/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    # Verify that the product belongs to the requesting farmer
    success, product = db.get_product_details(product_id)
    if not success:
        return jsonify({
            'success': False,
            'message': 'Product not found'
        }), 404
    data = request.get_json()
    user_id = data.get('userId')
    if product['ownerId'] != int(user_id):
        return jsonify({
            'success': False,
            'message': 'Unauthorized to delete this product'
        }), 403
    
    success, message = db.delete_product(product_id)
    if success:
        return jsonify({
            'success': True,
            'message': message
        })
    return jsonify({
        'success': False,
        'message': str(message)
    }), 500

@app.route('/disease-reports', methods=['POST'])
def save_report():
    try:
        report_data = request.json
        success, message = db.save_disease_report(report_data)
        
        if success:
            return jsonify({
                'success': True,
                'message': message
            })
        return jsonify({
            'success': False,
            'message': message
        }), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/disease-reports/user/<int:user_id>', methods=['GET'])
def get_user_reports(user_id):
    limit = request.args.get('limit', type=int)
    success, result = db.get_user_reports(user_id, limit)
    
    if success:
        return jsonify({
            'success': True,
            'reports': result
        })
    return jsonify({
        'success': False,
        'message': str(result)
    }), 500

@app.route('/disease-reports/<string:report_id>', methods=['GET'])
def get_report_details(report_id):
    success, result = db.get_report_details(report_id)
    
    if success:
        return jsonify({
            'success': True,
            'report': result
        })
    return jsonify({
        'success': False,
        'message': str(result)
    }), 404 if result == "Report not found" else 500

@app.route('/disease-reports/<report_id>', methods=['DELETE'])
def delete_report(report_id):
    try:
        success, message = db.delete_report(report_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Report deleted successfully'
            })
        
        return jsonify({
            'success': False,
            'message': message
        }), 404 if message == "Report not found" else 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/users/<user_id>/name', methods=['GET'])
def get_user_name(user_id):
    try:
        user_name = db.get_user_name(user_id)
        
        if user_name:
            return jsonify({
                'success': True,
                'UserName': user_name
            })

        return jsonify({
            'success': False,
            'message': 'User not found'
        }), 404

    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/user-profile/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    try:
        user_data = db.get_user_profile(user_id)
        if not user_data:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify(user_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update-profile/<int:user_id>', methods=['PUT'])
def update_user_profile(user_id):
    try:
        data = request.json
        # If there's a base64 image in the request, decode it
        if data.get('profileImage') and isinstance(data['profileImage'], str):
            try:
                # Remove the data URL prefix if present
                if 'base64,' in data['profileImage']:
                    base64_string = data['profileImage'].split('base64,')[1]
                else:
                    base64_string = data['profileImage']
                data['profileImage'] = base64.b64decode(base64_string)
            except Exception as e:
                return jsonify({'error': 'Invalid image format'}), 400

        success = db.update_user_profile(user_id, data)
        if success:
            return jsonify({'message': 'Profile updated successfully'}), 200
        return jsonify({'error': 'Failed to update profile'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/start-chat', methods=['POST'])
def start_chat():
    try:
        data = request.json
        success = db.initialize_chat(data.get('user1Id'), data.get('user2Id'))
        if success:
            return jsonify(success), 200
        return jsonify({'error': 'Failed to initialize chat'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/check-chat/<int:user1_id>/<int:user2_id>', methods=['GET'])
def check_existing_chat(user1_id, user2_id):
    try:
        result = db.get_chat(user1_id, user2_id)
        if result:
            return jsonify(result), 200
        return jsonify({'error': 'Chat not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/farmer/products', methods=['GET'])
def get_all_products():
    success, result = db.get_all_products()
    if success:
        return jsonify({
            'success': True,
            'products': result
        })
    return jsonify({
        'success': False,
        'message': str(result)
    }), 500

@app.route('/agribusiness/products', methods=['GET'])
def get_all_agribusinessproducts():
    try:
        success, result = db.get_all_agribusiness_products()
        
        if success:
            return jsonify({
                'success': True,
                'products': result
            })
        return jsonify({
            'success': False,
            'message': result
        }), 500
        
    except Exception as e:
        print(f"Error in get_all_products route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/savedproducts', methods=['POST'])
def save_product():
    try:
        data = request.get_json()
        item_id = data.get('itemID')
        user_id = data.get('userID')
        
        if not item_id or not user_id:
            return jsonify({
                'success': False,
                'message': 'itemID and userID are required'
            }), 400
            
        success, result = db.save_product(item_id, user_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Product saved successfully'
            })
        return jsonify({
            'success': False,
            'message': result
        }), 500
        
    except Exception as e:
        print(f"Error in save_product route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/savedproducts/<int:user_id>', methods=['GET'])
def get_saved_products(user_id):
    try:
        success, result = db.get_saved_products(user_id)
        
        if success:
            return jsonify({
                'success': True,
                'savedProducts': result
            })
        return jsonify({
            'success': False,
            'message': result
        }), 500
        
    except Exception as e:
        print(f"Error in get_saved_products route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/savedproducts/<int:user_id>/<int:item_id>', methods=['DELETE'])
def remove_saved_product(user_id, item_id):
    try:
        success, result = db.remove_saved_product(user_id, item_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Product removed from saved items successfully'
            })
        return jsonify({
            'success': False,
            'message': result
        }), 500
        
    except Exception as e:
        print(f"Error in remove_saved_product route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/products/<int:item_id>/reviews', methods=['GET', 'POST'])
def handle_product_reviews(item_id):
    try:
        if request.method == 'POST':
            # Get review data from request
            data = request.get_json()
            user_id = data.get('userId')
            rating = data.get('rating')
            comment = data.get('comment')
            
            # Validate required fields
            if not all([user_id, rating]):
                return jsonify({
                    'success': False,
                    'message': 'Missing required fields'
                }), 400
            
            # Validate rating range
            if not (1 <= rating <= 5):
                return jsonify({
                    'success': False,
                    'message': 'Rating must be between 1 and 5'
                }), 400
            
            success, result = db.save_product_review(item_id, user_id, rating, comment)
            
            if success:
                return jsonify({
                    'success': True,
                    'message': result
                })
            return jsonify({
                'success': False,
                'message': result
            }), 500
            
        else:  # GET request
            success, result = db.get_product_reviews(item_id)
            
            if success:
                return jsonify({
                    'success': True,
                    'data': result
                })
            return jsonify({
                'success': False,
                'message': result
            }), 500
            
    except Exception as e:
        print(f"Error in handle_product_reviews: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
    
@app.route('/products/reviews/<int:review_id>', methods=['PUT', 'DELETE'])
def handle_review_edit_delete(review_id):
    try:
        # Get user ID from request data
        data = request.get_json()
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'User ID is required'
            }), 400
        
        if request.method == 'PUT':
            # Get updated review data
            rating = data.get('rating')
            comment = data.get('comment')
            
            # Validate required fields
            if rating is None:
                return jsonify({
                    'success': False,
                    'message': 'Rating is required'
                }), 400
                
            # Validate rating range
            if not (1 <= rating <= 5):
                return jsonify({
                    'success': False,
                    'message': 'Rating must be between 1 and 5'
                }), 400
            
            success, result = db.edit_product_review(review_id, user_id, rating, comment)
            
            if success:
                return jsonify({
                    'success': True,
                    'message': result
                })
            return jsonify({
                'success': False,
                'message': result
            }), 403 if "unauthorized" in result.lower() else 500
            
        else:  # DELETE request
            success, result = db.delete_product_review(review_id, user_id)
            
            if success:
                return jsonify({
                    'success': True,
                    'message': result
                })
            return jsonify({
                'success': False,
                'message': result
            }), 403 if "unauthorized" in result.lower() else 500
            
    except Exception as e:
        print(f"Error in handle_review_edit_delete: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

# Optional: Route for getting a single review
@app.route('/products/reviews/<int:review_id>', methods=['GET'])
def get_single_review(review_id):
    try:
        success, result = db.get_single_review(review_id)
        
        if success:
            return jsonify({
                'success': True,
                'data': result
            })
        return jsonify({
            'success': False,
            'message': result
        }), 404 if result == "Review not found" else 500
            
    except Exception as e:
        print(f"Error in get_single_review route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/products/reviews/<int:review_id>/reaction', methods=['POST'])
def handle_review_reaction(review_id):
    data = request.get_json()
    print(data)
    try:
        
       
        user_id = data.get('userId')
        reaction_type = data.get('type')  # 'like' or 'dislike'
        is_add = data.get('isAdd')  # True to add, False to remove
        print(review_id, user_id, reaction_type, is_add)
        if not all([review_id, user_id, reaction_type, is_add is not None]):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
            
        success, result = db.update_review_reaction(review_id, user_id, reaction_type, is_add)
        
        if success:
            return jsonify({
                'success': True,
                'message': result
            })
        return jsonify({
            'success': False,
            'message': result
        }), 404 if "not found" in result.lower() else 500
            
    except Exception as e:
        print(f"Error in handle_review_reaction: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/cart/add', methods=['POST'])
def add_to_cart():
    try:
        data = request.json
        required_fields = ['userID', 'itemID', 'ownerName', 'quantity', 'price']
        
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        success, result = db.add_cart_item(data)
        
        if success:
            return jsonify({
                'success': True,
                'data': result
            })
        return jsonify({
            'success': False,
            'message': result
        })
            
    except Exception as e:
        print(f"Error in add_to_cart route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/cart/delete/<int:cart_id>/<int:item_id>', methods=['DELETE'])
def delete_from_cart(cart_id, item_id):
    try:
        success, result = db.delete_cart_item(cart_id, item_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Item removed from cart successfully'
            })
        return jsonify({
            'success': False,
            'message': result
        }), 404 if result == "Item not found in cart" else 500
            
    except Exception as e:
        print(f"Error in delete_from_cart route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/cart/items/<int:user_id>', methods=['GET'])
def get_user_cart_items(user_id):
    try:
        success, result = db.get_user_cart_items(user_id)
        
        if success:
            return jsonify({
                'success': True,
                'data': result
            })
        return jsonify({
            'success': False,
            'message': result
        })
            
    except Exception as e:
        print(f"Error in get_user_cart_items route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/negotiations/create', methods=['POST'])
def create_negotiation():
    try:
        data = request.json
        required_fields = ['consumerId', 'farmerId', 'productId', 'newPrice', 'originalPrice', 'notes','quantity']
        
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        notes = data.get('notes') if data.get('notes') else ""
      
        success, result = db.create_negotiation_request(
            data['consumerId'],
            data['farmerId'],
            data['productId'],
            data['newPrice'],
            data['originalPrice'],
            data['quantity'],
            notes 
        )

        if success:
            return jsonify({
                'success': True,
                'data': result
            })
        
        return jsonify({
            'success': False,
            'message': result
        }), 400

    except Exception as e:
        print(f"Error in create_negotiation route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/negotiations/farmer/<int:farmer_id>', methods=['GET'])
def get_farmer_negotiations(farmer_id):
    try:
        success, result = db.get_farmer_negotiations(farmer_id)
        
        if success:
            return jsonify({
                'success': True,
                'data': result
            })
            
        return jsonify({
            'success': False,
            'message': result
        }), 400

    except Exception as e:
        print(f"Error in get_farmer_negotiations route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
    
@app.route('/negotiations/consumer/<int:consumer_id>', methods=['GET'])
def get_consumer_negotiations(consumer_id):
    try:
        success, result = db.get_consumer_negotiations(consumer_id)
        
        if success:
            return jsonify({
                'success': True,
                'data': result
            })
            
        return jsonify({
            'success': False,
            'message': result
        }), 400

    except Exception as e:
        print(f"Error in get_consumer_negotiations route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
    
@app.route('/negotiations/update/<string:negotiation_id>', methods=['PUT'])
def update_negotiation_status(negotiation_id):
    try:
        data = request.json
        if 'status' not in data:
            return jsonify({
                'success': False,
                'message': 'Status is required'
            }), 400

        success, result = db.update_negotiation_request(
            negotiation_id,
            data['status']
           
        )

        if success:
            return jsonify({
                'success': True,
                'data': result
            })
            
        return jsonify({
            'success': False,
            'message': result
        }), 400

    except Exception as e:
        print(f"Error in update_negotiation_status route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

stripe.api_key = 'sk_test_51OD2bKKNmXucvr4ctf7q3dzdbQOqAhhMb6tHiRQ1QFsBKS5udzPtsXL7tX3Fi8Vrk3iaZ72QPvEOfmauuTAwMDEr00rT69ET7Z'

'''@app.route('/api/create-payment', methods=['POST'])
def create_payment():
    try:
        # Get the payment data from the request
        data = request.get_json()
        payment_method_id = data.get('payment_method_id')
        amount = data.get('amount')

        # Create a payment intent
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,  # amount in cents
            currency='usd',
            payment_method=payment_method_id,
            confirm=True,  # Confirm the payment immediately
            automatic_payment_methods={
                'enabled': True,
                'allow_redirects': 'never'
            }
        )

        return jsonify({
            'success': True,
            'clientSecret': payment_intent.client_secret
        })

    except stripe.error.CardError as e:
        # Handle card errors (e.g., declined card)
        return jsonify({
            'error': {
                'message': e.error.message,
                'code': e.error.code
            }
        }), 400

    except stripe.error.StripeError as e:
        # Handle other Stripe errors
        return jsonify({
            'error': {
                'message': str(e),
                'code': 'stripe_error'
            }
        }), 500

    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({
            'error': {
                'message': str(e),
                'code': 'server_error'
            }
        }), 500

# CORS settings if needed

    return response
'''
# Route definition
@app.route('/api/process-payment', methods=['POST'])
def process_payment():
    try:
        data = request.json
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400

        user_id = data['orderDetails']['userId']
        items = data['orderDetails']['items']
        
        payment_details = data['customerDetails']
        
        success, result = db.process_order_and_payment(user_id, items, payment_details)
        result2= {
                'orders': result.get('orders'),
                'message': result.get('message')
                
            }
        if success:
            send_order_confirmation_email(payment_details['email'],payment_details['name'],result.get('email_orders'))
            return jsonify({
                'success': True,
                'data': result2,
            })
        
        return jsonify({
            'success': False,
            'message': result2
        }), 400

    except Exception as e:
        print(f"Error in process_payment route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

def send_order_confirmation_email(recipient_email, user_name, email_orders):
    html_content = f"""
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                body {{
                    font-family: 'Segoe UI', Arial, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    color: #333;
                    line-height: 1.6;
                    background-color: #f9f9f9;
                }}
                .container {{
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    padding: 30px;
                    margin: 20px 0;
                }}
                .logo {{
                    text-align: center;
                    margin-bottom: 35px;
                    padding: 20px;
                    background: linear-gradient(to right, #f8f9fa, #ffffff, #f8f9fa);
                    border-radius: 8px;
                }}
                .logo img {{
                    width: 140px;
                    height: auto;
                    transition: transform 0.3s ease;
                }}
                .logo img:hover {{
                    transform: scale(1.05);
                }}
                h1 {{
                    color: #1B8755;
                    text-align: center;
                    font-size: 32px;
                    margin-bottom: 30px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }}
                .success-banner {{
                    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
                    border-left: 4px solid #1B8755;
                    padding: 20px 25px;
                    margin: 30px 0;
                    border-radius: 0 8px 8px 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }}
                .order-section {{
                    border: 1px solid #e0e0e0;
                    border-radius: 12px;
                    padding: 25px;
                    margin: 30px 0;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.08);
                    background-color: #ffffff;
                }}
                .order-header {{
                    background: linear-gradient(to right, #f8f9fa, #ffffff);
                    padding: 20px 25px;
                    margin: -25px -25px 25px -25px;
                    border-radius: 12px 12px 0 0;
                    border-bottom: 2px solid #e0e0e0;
                }}
                .order-header-details {{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }}
                .order-id {{
                    font-size: 18px;
                    font-weight: 600;
                    color: #1B8755;
                }}
                .order-date {{
                    color: #666;
                    font-size: 15px;
                    font-weight: 500;
                }}
                .item-row {{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px solid #eee;
                    margin: 0 15px;
                }}
                .item-details {{
                    flex: 1;
                    padding-right: 20px;
                }}
                .item-name {{
                    font-weight: 600;
                    color: #2c3e50;
                    font-size: 16px;
                    margin-bottom: 5px;
                }}
                .item-quantity {{
                    color: #666;
                    font-size: 14px;
                }}
                .item-price {{
                    text-align: right;
                    font-weight: 600;
                    font-size: 16px;
                    color: #2c3e50;
                    min-width: 100px;
                }}
                .price-details {{
                    margin: 25px 15px 0 15px;
                    padding: 20px;
                    border-top: 2px solid #eee;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                }}
                .price-row {{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    color: #666;
                }}
                .price-row span:first-child {{
                    font-weight: 500;
                }}
                .price-row span:last-child {{
                    min-width: 100px;
                    text-align: right;
                }}
                .total-row {{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 0 10px 0;
                    font-weight: 700;
                    font-size: 20px;
                    color: #1B8755;
                    border-top: 2px solid #1B8755;
                    margin-top: 15px;
                }}
                .total-row span:last-child {{
                    min-width: 100px;
                    text-align: right;
                }}
                .shipping-info {{
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 25px 15px;
                    border: 1px solid #e0e0e0;
                }}
                .shipping-info strong {{
                    color: #1B8755;
                    display: block;
                    margin-bottom: 10px;
                    font-size: 16px;
                }}
                .support-note {{
                    background: linear-gradient(135deg, #f8f9fa, #ffffff);
                    padding: 25px;
                    border-radius: 8px;
                    margin: 30px 0;
                    text-align: center;
                    color: #666;
                    border: 1px solid #e0e0e0;
                }}
                .support-note strong {{
                    color: #1B8755;
                    font-size: 18px;
                    display: block;
                    margin-bottom: 10px;
                }}
                .footer {{
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                    margin-top: 45px;
                    padding-top: 25px;
                    border-top: 2px solid #eee;
                }}
                .footer p {{
                    margin: 8px 0;
                }}
                .copyright {{
                    color: #999;
                    font-size: 13px;
                    margin-top: 15px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                    <a href="https://imgbb.com/"><img src="https://i.ibb.co/gvNCKYj/wasp.png" alt="wasp" border="0"></a>
                </div>
                <h1>Order Confirmation</h1>
                <p>Dear {user_name},</p>
                <div class="success-banner">
                    <strong>Thank you for your order!</strong> Your order has been successfully placed and payment has been processed.
                </div>
    """
    
    # Add order sections for each order in email_orders
    for order in email_orders:
        formatted_date = datetime.fromisoformat(order['orderDate']).strftime('%B %d, %Y')
        
        html_content += f"""
            <div class="order-section">
                <div class="order-header">
                    <div class="order-header-details">
                        <span class="order-id">Order #{order['orderID']}</span>
                    
                    </div>
                </div>
        """
        
        # Add items for this order
        for item in order['items']:
            price = item['negotiatedPrice'] if item['negotiatedPrice'] else item['originalPrice']
            total_item_price = price * item['quantity']
            
            html_content += f"""
                <div class="item-row">
                    <div class="item-details">
                        <div class="item-name">{item['itemName']}</div>
                        <div class="item-quantity">Quantity: {item['quantity']}</div>
                    </div>
                    <div class="item-price">${total_item_price:.2f}</div>
                </div>
            """
        
        # Add price details
        subtotal = order['totalPrice'] / 1.05  # Assuming 5% tax
        tax = order['totalPrice'] - subtotal
        
        html_content += f"""
                <div class="price-details">
                    <div class="price-row">
                        <span>Subtotal</span>
                         <span> </span>
                        <span> ${subtotal:.2f}</span>
                    </div>
                    <div class="price-row">
                        <span>Tax (5%)</span>
                        <span> </span>
                        <span> ${tax:.2f}</span>
                    </div>
                    <div class="total-row">
                        <span>Total</span>
                         <span> </span>
                        <span> ${order['totalPrice']:.2f}</span>
                    </div>
                </div>
                
                <div class="shipping-info">
                    <strong>Shipping Information</strong>
                    {order['fullName']}<br>
                    {order['shippingAddress']}<br>
                    Phone: {order['phoneNum']}<br>
                    Email: {order['email']}
                </div>
            </div>
        """

    # Add support note and footer
    html_content += f"""
                <div class="support-note">
                    <strong>Need Help?</strong>
                    Our customer support team is here to assist you. Feel free to contact us with any questions about your order.
                </div>
                
                <div class="footer">
                    <p>Thank you for shopping with WaspWarden!</p>
                    <p>Best regards,<br>
                    The WaspWarden Team</p>
                    <p class="copyright">© 2024 WaspWarden. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
    """

    text_content = f"""
    Order Confirmation
    
    Dear {user_name},
    
    Thank you for your order! Your order has been successfully placed and payment has been processed.
    
    Order Details:
    """
    
    for order in email_orders:
        formatted_date = datetime.fromisoformat(order['orderDate']).strftime('%B %d, %Y')
        text_content += f"\nOrder #{order['orderID']} - Ordered on {formatted_date}\n"
        
        for item in order['items']:
            price = item['negotiatedPrice'] if item['negotiatedPrice'] else item['originalPrice']
            text_content += f"{item['itemName']} × {item['quantity']}: ${price * item['quantity']:.2f}\n"
        
        text_content += f"\nTotal: ${order['totalPrice']:.2f}\n"
        text_content += f"\nShipping to:\n{order['fullName']}\n{order['shippingAddress']}\n"

    # Email sending configuration
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user = 'waspwardenproject@gmail.com'
    smtp_password = 'deif snid bkuv wbon'
    from_email = 'waspwardenproject@gmail.com'
    
    message = MIMEMultipart('alternative')
    message['From'] = from_email
    message['To'] = recipient_email
    message['Subject'] = 'Order Confirmation - WaspWarden'
    message['Date'] = formatdate(localtime=True)

    text_part = MIMEText(text_content, 'plain')
    html_part = MIMEText(html_content, 'html')

    message.attach(text_part)
    message.attach(html_part)

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(message)
        server.quit()
        print("Order confirmation email sent successfully")
        return True
    except Exception as e:
        print(f"Failed to send order confirmation email. Error: {e}")
        return False

@app.route('/api/orders/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    try:
        success, result = db.get_user_orders(user_id)
        
        if success:
            return jsonify({
                'success': True,
                'data': result
            })
        return jsonify({
            'success': False,
            'message': result
        })
            
    except Exception as e:
        print(f"Error in get_user_orders route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
    
@app.route('/api/ownerOrders/<int:owner_id>', methods=['GET'])
def get_owner_orders(owner_id):
    try:
        success, result = db.get_owner_orders(owner_id)   
        if success:
            return jsonify({
                'success': True,
                'data': result
            })
        return jsonify({
            'success': False,
            'message': result
        })
            
    except Exception as e:
        print(f"Error in get_owner_orders route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
    
@app.route('/api/orders/<string:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    try:
        data = request.json
        new_status = data.get('status')
        owner_id = data['userId'] 
        if not new_status:
            return jsonify({
                'success': False,
                'message': 'New status is required'
            }), 400
            
        success, result = db.update_order_status(order_id, new_status, owner_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': result
            })
        return jsonify({
            'success': False,
            'message': result
        }), 400
            
    except Exception as e:
        print(f"Error in update_order_status route: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/ownerFinances/<int:owner_id>', methods=['GET'])
def get_owner_finances(owner_id):
    analytics = db.get_finance_analytics(owner_id)
    if analytics:
        return jsonify(analytics)
    return jsonify({'error': 'Failed to fetch finance data'}), 500

# Add additional endpoint for filtering finances
@app.route('/api/ownerFinances/<int:owner_id>/filter', methods=['GET'])
def filter_finances_route(owner_id):
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    status = request.args.get('status')
    
    result = db.filter_owner_finances(owner_id, start_date, end_date, status)
    if result is not None:
        return jsonify(result)
    return jsonify({'error': 'Failed to fetch filtered finance data'}), 500

@app.route('/api/ownerFinances/<int:owner_id>/summary', methods=['GET'])
def finance_summary_route(owner_id):
    period = request.args.get('period', 'month')
    result = db.get_finance_summary(owner_id, period)
    if result is not None:
        return jsonify(result)
    return jsonify({'error': 'Failed to fetch finance summary'}), 500


@app.route('/api/agribusiness/analytics/<int:owner_id>', methods=['GET'])
def get_agribusiness_analytics(owner_id):
    analytics = db.get_agribusiness_analytics(owner_id)
    if analytics:
        return jsonify(analytics)
    return jsonify({'error': 'Failed to fetch agribusiness analytics'}), 500

@app.route('/api/farmer/analytics/<int:owner_id>', methods=['GET'])
def get_farmer_analytics(owner_id):
    analytics = db.get_farmer_analytics(owner_id)
    if analytics:
        return jsonify(analytics)
    return jsonify({'error': 'Failed to fetch farmer analytics'}), 500

@app.route('/api/consumer/analytics/<int:user_id>', methods=['GET'])
def get_consumer_analytics(user_id):
    analytics = db.get_consumer_analytics(user_id)
    if analytics:
        return jsonify(analytics)
    return jsonify({'error': 'Failed to fetch consumer analytics'}), 500

@app.route('/api/notifications/<int:user_id>', methods=['GET'])
def get_notifications(user_id):
    return db.get_user_notifications(user_id)

@app.route('/api/notifications/<int:notification_id>/read/<int:user_id>', methods=['PUT'])
def mark_read(notification_id, user_id):
    return db.mark_notification_read(notification_id, user_id)

@app.route('/api/notifications/<int:notification_id>/<int:user_id>', methods=['DELETE'])
def delete_notification_route(notification_id, user_id):
    return db.delete_notification(notification_id, user_id)

@app.route('/api/notifications', methods=['POST'])
def create_notification_route():
        data = request.get_json()
        required_fields = ['userId', 'notificationType', 'text']
        
        
        if not all(field in data for field in required_fields):
            return {"error": "Missing required fields"}, HTTPStatus.BAD_REQUEST
            
        return db.create_notification(
            data['userId'],
            data['notificationType'],
            data['text']
        )

if __name__ == '__main__':
    socketio.run(app, debug=True)