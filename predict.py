import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd

# Load the dataset for scaling
def load_data(file_path):
    data = pd.read_csv(file_path, encoding='ISO-8859-1')
    numeric_features = data.select_dtypes(include=[np.number]).columns.tolist()
    X = data[numeric_features].iloc[:, :-1].values  # All features except the target
    y = data[numeric_features].iloc[:, -1].values  # Target column (price)
    return X, y

# Function to predict house price based on sample input
def predict_house_price(model_path, scaler, sample_input):
    # Load the trained model
    model = load_model(model_path)
    
    # Scale the sample input using the previously fitted scaler
    sample_input_scaled = scaler.transform(sample_input)
    
    # Make a prediction
    predicted_price = model.predict(sample_input_scaled)
    return predicted_price.flatten()

# Main function to demonstrate predictions
def main(file_path, model_path, sample_inputs):
    # Load and scale the training data
    X, _ = load_data(file_path)
    scaler = StandardScaler()
    scaler.fit(X)  # Fit the scaler on the training data
    
    # Predict prices for each sample input
    for sample_input in sample_inputs:
        sample_input_array = np.array([sample_input])  # Convert to 2D array for model input
        predicted_price = predict_house_price(model_path, scaler, sample_input_array)
        print(f"Input: {sample_input} => Predicted Price: ${predicted_price[0]:.2f}")

if __name__ == "__main__":
    # Path to the training dataset for scaler fitting
    file_path = 'trainingData/large_house_price_dataset.csv'
    
    # Path to the pre-trained model
    model_path = 'models/model.h5'

    # Define sample inputs similar to training dataset
    sample_inputs = [
        [3, 1500, 4],  # 3 rooms, 1500 sqft, location rating of 4
        [5, 2500, 5],  # 5 rooms, 2500 sqft, location rating of 5
        [2, 900, 3],   # 2 rooms, 900 sqft, location rating of 3
        [4, 1800, 2],  # 4 rooms, 1800 sqft, location rating of 2
    ]
    
    # Run predictions
    main(file_path, model_path, sample_inputs)
