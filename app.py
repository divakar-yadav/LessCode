import json
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd
import asyncio
import websockets
import sys
import numpy as np
async def send_message(message):
    uri = "ws://localhost:8081"
    async with websockets.connect(uri) as websocket:
        await websocket.send(message)

class ProgressCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        progress = (epoch + 1) / self.params['epochs']
        data = {
            'type': 'progress',
            'progress': progress,
            'logs': logs
        }
        message = json.dumps(data)
        asyncio.run(send_message(message))

def get_weights_and_biases(model):
    # Extract weights and biases from each layer in the model and make them JSON-serializable
    weights_biases = []
    for layer in model.layers:
        layer_weights_biases = layer.get_weights()
        json_serializable_weights_biases = [w.tolist() for w in layer_weights_biases]
        weights_biases.append(json_serializable_weights_biases)
    return weights_biases


def main(file_path):
    # Load the dataset with specified encoding
    data = pd.read_csv(file_path, encoding='ISO-8859-1')  # or 'latin1' if needed

    # Check if the dataset has any missing values
    if data.isnull().values.any():
        data = data.dropna()

    # Select only numeric columns for features
    numeric_features = data.select_dtypes(include=[np.number]).columns.tolist()
    X = data[numeric_features].iloc[:, :-1].values
    y = data[numeric_features].iloc[:, -1].values

    # Feature scaling
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    # Split data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Load the pre-trained model from models/model.h5
    model_path = 'models/model.h5'
    model = load_model(model_path)
    print(f"Model loaded successfully from {model_path}")
    # Recompile the model to ensure it is compatible with the current optimizer
    model.compile(optimizer='adam', loss='mean_squared_error')
    print("Model recompiled with Adam optimizer and MSE loss")

    # Train the model with progress callback
    progress_callback = ProgressCallback()
    model.fit(X_train, y_train, epochs=10, callbacks=[progress_callback])

    # Evaluate the model
    y_pred = model.predict(X_test).flatten()
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    # Print model weights and indicate that training is done-
    print("Training completed!")
    weights = model.get_weights()
    print("Model Weights:", weights)

    # Prepare data for Highcharts
    highcharts_data = {
        'title': 'Simple Linear Regression',
        'xAxis': {
            'title': 'X',
            'categories': list(range(len(y_test)))
        },
        'yAxis': {
            'title': 'y'
        },
        'series': [
            {
                'name': 'Actual data',
                'data': y_test.tolist(),
                'type': 'scatter'
            },
            {
                'name': 'Predicted data',
                'data': y_pred.tolist(),
                'type': 'line'
            }
        ]
    }

    # Prepare additional data for JavaScript
    data = {
        'type': 'result',
        'Coefficients': model.get_weights()[0].tolist(),
        'Intercept': model.get_weights()[1].tolist(),
        'Mean_squared_error': mse,
        'Coefficient_of_determination': r2,
        'highcharts_data': highcharts_data,
        'trained_weights_biases': get_weights_and_biases(model)
    }

    # Convert Python dictionary to JSON string
    json_output = json.dumps(data)

    # Send final result
    asyncio.run(send_message(json_output))

if __name__ == "__main__":
    file_path = sys.argv[1]
    main(file_path)
    # main('trainingData/training_data_10_features.csv')
