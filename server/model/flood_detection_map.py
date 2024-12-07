import ee
import geemap
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Initialize Earth Engine
credentials_path = 'C:/Users/LENOVO/Downloads/flood404-539d02bd2eec.json'
ee.Initialize(ee.ServiceAccountCredentials('aswathysajith2006@gmail.com', credentials_path))

# Define the region of interest (Kerala)
roi = ee.Geometry.Polygon([
    [[76.5, 8.5], [76.5, 12.5], [80.5, 12.5], [80.5, 8.5]]
])

# Set time range for historical data
start_date = ee.Date('2018-01-01')
end_date = ee.Date('2024-01-01')

# Load the IMERG dataset for precipitation data
precip_dataset = ee.ImageCollection('NASA/GPM_L3/IMERG_V07') \
    .filterBounds(roi) \
    .filterDate(start_date, end_date) \
    .select('precipitation') \
    .filter(ee.Filter.calendarRange(1, 365, 'day_of_year'))

# Load the GLDAS dataset for temperature data
temp_dataset = ee.ImageCollection('NASA/GLDAS/V021/NOAH/G025/T3H') \
    .filterBounds(roi) \
    .filterDate(start_date, end_date) \
    .select('Tair_f_inst') \
    .filter(ee.Filter.calendarRange(1, 365, 'day_of_year'))

# Function to calculate mean precipitation and temperature for a given period
def calculate_values_for_period(date_range):
    precip_mean = precip_dataset.filterDate(date_range.start(), date_range.end()).mean()
    temp_mean = temp_dataset.filterDate(date_range.start(), date_range.end()).mean()
    
    return precip_mean.addBands(temp_mean)

# Example: Manually define dates of known floods
flood_dates = [
    ('2018-08-15', '2018-08-20'),
    ('2019-08-10', '2019-08-15')
]
flood_periods = [ee.DateRange(start, end) for start, end in flood_dates]

non_flood_dates = ('2020-01-01', '2020-01-10')
non_flood_period = ee.DateRange(*non_flood_dates)

# Calculate values for flood and non-flood periods
flood_values = [calculate_values_for_period(period) for period in flood_periods]
non_flood_values = calculate_values_for_period(non_flood_period)

# Function to sample numerical data from an image
def extract_samples(image, label, num_points=500):
    points = image.sample(region=roi, scale=10000, numPixels=num_points).getInfo()
    samples = [(feature['properties']['precipitation'], feature['properties']['Tair_f_inst'], label) for feature in points['features']]
    return samples

# Sample data for flood periods
flood_samples = [extract_samples(values, label=1) for values in flood_values]

# Sample data for non-flood period
non_flood_samples = extract_samples(non_flood_values, label=0)

# Combine flood and non-flood samples into a dataset
data = [sample for sublist in flood_samples for sample in sublist] + non_flood_samples

# Convert to NumPy arrays (features and labels)
X = np.array([[sample[0], sample[1]] for sample in data])  # Precipitation and temperature values
y = np.array([sample[2] for sample in data])  # Labels (1 for flood, 0 for non-flood)

# Split data into training (80%) and testing (20%) sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create and train a RandomForestClassifier model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict on the test set
y_pred = model.predict(X_test)

joblib.dump(model, 'flood_model.pkl')
# Calculate accuracy and generate a classification report
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy * 100:.2f}%")
print(classification_report(y_test, y_pred))


