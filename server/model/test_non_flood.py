import numpy as np
import joblib
import ee

# Initialize Earth Engine
credentials_path = 'C:/Users/LENOVO/Downloads/flood404-539d02bd2eec.json'
client_email = 'your-client-email@your-project-id.iam.gserviceaccount.com'
ee.Initialize(ee.ServiceAccountCredentials(client_email, credentials_path))

# Load the pre-trained model
model = joblib.load('flood_model.pkl')

# Define the non-flood-prone area in Kerala
roi_non_flood_prone_kerala = ee.Geometry.Polygon([
    [
        [76.5, 10.0],
        [76.5, 10.2],
        [76.7, 10.2],
        [76.7, 10.0]
    ]
])

# Set time range for real-time data
start_date = ee.Date('2023-01-01')
end_date = ee.Date('2023-01-02')

# Fetch and process real-time data
def get_real_time_data_for_location(start_date, end_date, location):
    # Precipitation dataset
    precip_dataset = ee.ImageCollection('NASA/GPM_L3/IMERG_V07') \
        .filterBounds(location) \
        .filterDate(start_date, end_date) \
        .select('precipitation') \
        .mean() \
        .reproject(crs='EPSG:4326')
    
    # Temperature dataset
    temp_dataset = ee.ImageCollection('NASA/GLDAS/V021/NOAH/G025/T3H') \
        .filterBounds(location) \
        .filterDate(start_date, end_date) \
        .select('Tair_f_inst') \
        .mean() \
        .reproject(crs='EPSG:4326')
    
    # Extract data
    precip_data = precip_dataset.reduceRegion(reducer=ee.Reducer.mean(), geometry=location, scale=10000).getInfo()
    temp_data = temp_dataset.reduceRegion(reducer=ee.Reducer.mean(), geometry=location, scale=10000).getInfo()
    
    # Cast the data to numeric values
    precipitation = float(precip_data.get('precipitation', 0))
    temperature = float(temp_data.get('Tair_f_inst', 0))
    
    return precipitation, temperature

# Get real-time data for the specified location
precipitation, temperature = get_real_time_data_for_location(start_date, end_date, roi_non_flood_prone_kerala)

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

print(f"Prediction for the location: {result}")
