import json
import sys
import pandas as pd
from sdv.single_table import CTGANSynthesizer
from sdv.metadata import SingleTableMetadata
import os


def main():
    # Read the file path from the argument
    if len(sys.argv) < 2:
        print("Error: No file path provided.", file=sys.stderr)
        sys.exit(1)
    print("Inside Main")
    file_path = sys.argv[1]

    # Check if file exists
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found.", file=sys.stderr)
        sys.exit(1)

    # Try to parse the file as JSON or CSV
    try:
        data = pd.read_json(file_path)
    except ValueError:
        try:
            data = pd.read_csv(file_path)
        except Exception as e:
            print(f"Error: Could not read file. {e}", file=sys.stderr)
            sys.exit(1)

    # Generate metadata
    metadata = SingleTableMetadata()
    metadata.detect_from_dataframe(data)

    # Create the synthesizer and fit the model
    synthesizer = CTGANSynthesizer(metadata)
    synthesizer.fit(data)

    # Generate synthetic data
    synthetic_data = synthesizer.sample(num_rows=10)

    # Output the synthetic data as JSON
    print(synthetic_data.to_json(orient='records'))


if __name__ == "__main__":
    main()
