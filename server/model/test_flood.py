import numpy as np
import joblib
import ee

# Initialize Earth Engine
credentials_path = 'C:/Users/LENOVO/Downloads/flood404-539d02bd2eec.json'
client_email = 'your-client-email@your-project-id.iam.gserviceaccount.com'
ee.Initialize(ee.ServiceAccountCredentials(client_email, credentials_path))

# Load the pre-trained model
model = joblib.load('flood_model.pkl')

# Define the flood-prone area in Chennai
roi_flood_prone_chennai = ee.Geometry.Polygon([
    [
        [80.1, 13.0],
        [80.1, 13.2],
        [80.4, 13.2],
        [80.4, 13.0]
    ]
])

# Set time range for real-time data
start_date = ee.Date('2023-09-01')
end_date = ee.Date('2024-09-02')

# Fetch and process real-time data
def get_real_time_data_for_location(start_date, end_date, location):
    # Precipitation dataset
    precip_dataset = ee.ImageCollection('NASA/GPM_L3/IMERG_V07') \
        .filterBounds(location) \
        .filterDate(start_date, end_date) \
        .mean() \
        .reproject(crs='EPSG:4326')
    
    # Temperature dataset
    temp_dataset = ee.ImageCollection('NASA/GLDAS/V021/NOAH/G025/T3H') \
        .filterBounds(location) \
        .filterDate(start_date, end_date) \
        .mean() \
        .reproject(crs='EPSG:4326')
    
    # Extract data
    precip_data = precip_dataset.reduceRegion(reducer=ee.Reducer.mean(), geometry=location, scale=10000).getInfo()
    temp_data = temp_dataset.reduceRegion(reducer=ee.Reducer.mean(), geometry=location, scale=10000).getInfo()
    
    return precip_data.get('precipitation', 0), temp_data.get('Tair_f_inst', 0)

# Get real-time data for the specified location
precipitation, temperature = get_real_time_data_for_location(start_date, end_date, roi_flood_prone_chennai)

# Print extracted feature values
#print(f"Extracted features - Precipitation: {precipitation}, Temperature: {temperature}")

# Prepare feature array
X_location = np.array([[precipitation, temperature]])

# Predict using the trained model
prediction = model.predict(X_location)

# Interpret the result
if prediction[0] == 1:
    result = "Flood-prone"
else:
    result = "Not flood-prone"

print(f"Prediction for the location : {result}")
