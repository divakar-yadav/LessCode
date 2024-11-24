import json
import sys
from tensorflow.keras.models import load_model

def get_model_info(model_path):
    try:
        # Load the model from the given path
        model = load_model(model_path)

        # Get the model summary in a dictionary form
        model_info = {
            'layers': [],
            'total_params': model.count_params()
        }

        for layer in model.layers:
            layer_info = {
                'name': layer.name,
                'type': layer.__class__.__name__,
                'output_shape': layer.output_shape,
                'params': layer.count_params()
            }
            model_info['layers'].append(layer_info)

        return model_info

    except Exception as e:
        return {'error': str(e)}

if __name__ == "__main__":
    # model_path = sys.argv[1]
    model_path = 'models/model.h5'
    model_info = get_model_info(model_path)

    # Convert dictionary to JSON and print to standard output
    print(json.dumps(model_info))
