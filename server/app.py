from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, messaging
from dotenv import load_dotenv
import os

app = Flask(__name__)

load_dotenv()  # Load environment variables from .env file

cred = credentials.Certificate(os.environ['GOOGLE_APPLICATION_CREDENTIALS'])
firebase_admin.initialize_app(cred)


@app.route('/send_fcm', methods=['POST'])
def send_fcm_message():
    # Get the registration token from the request
    registration_token = request.json['token']  # <--- Changed to 'token'

    # Create a notification message
    message = messaging.Message(
        notification=messaging.Notification(
            title='FCM Message from Flask',
            body='This is a notification message'
        ),
        token=registration_token
    )

    # Send the message
    response = messaging.send(message)
    print('Successfully sent message:', response)
    return jsonify({'message': 'FCM message sent successfully'})

if __name__ == '__main__':
    app.run(debug=True)