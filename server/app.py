from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, messaging
from dotenv import load_dotenv
import os
from flask_sqlalchemy import SQLAlchemy
#from flask_cors import CORS

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
#CORS(app, origins=['http://localhost:3002'])


from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']
SUPABASE_SECRET = os.environ['SUPABASE_SECRET']

options = {
    "headers": {
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
}

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)



@app.route('/test_supabase', methods=['GET'])
def test_supabase():
    try:
        response = supabase_client.table('users').select('*').limit(1).execute()
        return jsonify({'message': 'Supabase connection successful', 'data': response.data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/store_user', methods=['POST'])
def store_user():
    data = request.json
    name = data['name']
    location = data['location']
    email = data['email']
    #token = data['token']

    # Create a new user in the Supabase table
    user = supabase_client.table('fcm_users').insert({
        'username': name,
        'email': email,
        'location': location,
        'authority' : 'admin',
        #'token': {'fcm_token': token},
    }).execute()

    return jsonify({'message': 'User created successfully'})

@app.route('/store_token', methods=['POST'])
def store_token():
    try:
        data = request.json
        user_email = data['email']
        token = data['token']

        # Fetch the user ID from the Supabase table
        user = supabase_client.table('fcm_users').select('id').eq('email', user_email).execute()
        
        if not user.data:
            return jsonify({'error': 'User not found'}), 404
        
        user_id = user.data[0]['id']

        # Update the user token in the Supabase table
        supabase_client.table('fcm_users').update({
            'token': {'fcm_token': token}
        }).eq('id', user_id).execute()

        return jsonify({'message': 'Token stored successfully'})
    except Exception as e:
        app.logger.error(f"Error in store_token: {str(e)}")
        return jsonify({'error': str(e)}), 500

#send fcm code

cred = credentials.Certificate(os.environ['GOOGLE_APPLICATION_CREDENTIALS'])
firebase_admin.initialize_app(cred)

@app.route('/send_web_push', methods=['POST'])
def send_web_push_notification():
    try:
        # Retrieve all user tokens from the Supabase database
        users = supabase_client.table('fcm_users').select('token').execute()
        
        # Filter out any users without valid tokens
        tokens = [user['token']['fcm_token'] for user in users.data if user.get('token') and user['token'].get('fcm_token')]
        
        if not tokens:
            return jsonify({'message': 'No valid tokens found'}), 400

        # Create a notification message
        message = messaging.MulticastMessage(
            notification=messaging.Notification(
                title='Web Push Notification from Flask',
                body='This is a web push notification'
            ),
            tokens=tokens
        )

        # Send the message
        response = messaging.send_multicast(message)
        
        # Log the response
        app.logger.info(f'Successfully sent message: {response}')
        
        # Provide more detailed response
        return jsonify({
            'message': 'Web push notification sent successfully',
            'success_count': response.success_count,
            'failure_count': response.failure_count
        })

    except Exception as e:
        app.logger.error(f"Error in send_web_push: {str(e)}")
        return jsonify({'error': str(e)}), 500


## INCIDENTS
@app.route('/incidents', methods=['POST'])
def create_incident():
    try:
        data = request.json
        incident_type = data['incident_type']
        image_url = data.get('image_url')  # Optional field

        new_incident = supabase_client.table('incidents').insert({
            'incident_type': incident_type,
            'image_url': image_url
        }).execute()

        return jsonify(new_incident.data[0]), 201
    except Exception as e:
        app.logger.error(f"Error in create_incident: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/incidents', methods=['GET'])
def get_all_incidents():
    try:
        incidents = supabase_client.table('incidents').select('*').order('time_of_incident', desc=True).execute()
        return jsonify(incidents.data)
    except Exception as e:
        app.logger.error(f"Error in get_all_incidents: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/incidents/latest', methods=['GET'])
def get_latest_incident():
    try:
        latest_incident = supabase_client.table('incidents').select('*').order('time_of_incident', desc=True).limit(1).execute()
        if latest_incident.data:
            return jsonify(latest_incident.data[0])
        else:
            return jsonify({'message': 'No incidents found'}), 404
    except Exception as e:
        app.logger.error(f"Error in get_latest_incident: {str(e)}")
        return jsonify({'error': str(e)}), 500



## MODEL


if __name__ == '__main__':
    app.run(debug=True)