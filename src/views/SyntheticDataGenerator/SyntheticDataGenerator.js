import React, { useState } from 'react';
import './SyntheticDataGenerator.css';
import { ipcRenderer } from 'electron';

const SyntheticDataGenerator = () => {
    const [file, setFile] = useState(null);
    const [syntheticData, setSyntheticData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleGenerateSyntheticData = () => {
        if (!file) {
            alert('Please upload a training data file.');
            return;
        }
        
        setLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            ipcRenderer.once('run-synthetic-data-generator', (event, message) => {
                setLoading(false);
                try {
                    const generatedData = JSON.parse(message);
                    setSyntheticData(generatedData);
                } catch (error) {
                    alert('Error generating synthetic data: ' + message);
                }
            });
            
            ipcRenderer.send('run-synthetic-data-generator', fileContent);
        };
        reader.readAsText(file);
    };

    return (
        <div className="synthetic-data-generator">
            <h1>Synthetic Data Generator</h1>
            <div className="input-container">
                <label>
                    Upload Training Data:
                    <input
                        type="file"
                        accept=".csv, .json"
                        onChange={handleFileChange}
                    />
                </label>
                <button onClick={handleGenerateSyntheticData} disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Synthetic Data'}
                </button>
            </div>
            {syntheticData && (
                <div className="data-output">
                    <h2>Generated Synthetic Data</h2>
                    <pre>{JSON.stringify(syntheticData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default SyntheticDataGenerator;
