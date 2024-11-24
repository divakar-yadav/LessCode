import React, { useState, useEffect } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import path from 'path/posix'
import fs from 'fs';
import TrainingDashboard from '../../components/TrainingDashboard/TrainingDashboard';
import './ImportProject.css';
const { ipcRenderer } = require('electron');

const ImportProject = () => {
  const [hashCode, setHashCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [projectInfo, setProjectInfo] = useState(null); // State for project information
  const [progress, setProgress] = useState(0); // State for download progress
  const [isDownloading, setIsDownloading] = useState(false); // State to track if the model is being downloaded
  const [isModelAvailable, setIsModelAvailable] = useState(false); // State to track if the model is available locally
  const [isTraining, setIsTraining] = useState(false); // State to track if training is in progress
  const [trainingProgress, setTrainingProgress] = useState(0); // State for training progress
  const [trainingFile, setTrainingFile] = useState(null); // State for the uploaded training file
  const [chartData, setChartData] = useState(null); // State to store chart data for Highcharts
  const [modelInfo, setModelInfo] = useState(null); // State to store model info
  const [trainedWeights, setTrainedWeights] = useState(null);

  useEffect(() => {
    // Cleanup listener to avoid memory leaks
    return () => {
      ipcRenderer.removeAllListeners('project-data-response');
      ipcRenderer.removeAllListeners('download-progress');
      ipcRenderer.removeAllListeners('download-complete');
      ipcRenderer.removeAllListeners('python-script-output');

      ipcRenderer.removeAllListeners('load-model-info');
      ipcRenderer.removeAllListeners('model-info-response');
      ipcRenderer.removeAllListeners('model-info-error');

    };
  }, []);

  const handleErrorToast= (msg) =>{
    setError(msg); // Clear the error message after 3 seconds
        setTimeout(() => {
          setError(''); // Clear the error message after 3 seconds
        }, 2000);
  }
  const handleInputChange = (e) => {
    setHashCode(e.target.value);
    handleErrorToast('');
    setSuccessMessage('');
    setProjectInfo(null); // Clear previous project info when input changes
  };

  // Send a request to the main process to fetch the project data
  const fetchProjectData = (hashCode) => {
    ipcRenderer.send('fetch-project-data', hashCode);

    // Listen for the response from the main process
    ipcRenderer.on('project-data-response', (event, data) => {
      const projectData = JSON.parse(data);
      console.log('Project Data:', projectData);
      setProjectInfo(projectData); // Set the project info
      setSuccessMessage(`Project with given hashcode fetched successfully!`);

      // Set a timeout to clear the success message after 2 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    });
  };

  // Function to trigger the loading of model info
const getModelInfo = () => {
  const dirPath = path.join(__dirname, 'models');
  
  // Ensure the directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const modelPath = path.join(dirPath, 'model.h5'); // Define the full file path
  // Send message to load the model info
  ipcRenderer.send('load-model-info', modelPath);

  // Listen for the model info response
  ipcRenderer.on('model-info-response', (event, modelInfo) => {
    console.log('Model Info:', modelInfo);
    setModelInfo(modelInfo); // Set the model info in the state to display it on UI
  });

  // Handle any errors during model info fetching
  ipcRenderer.on('model-info-error', (event, errorMessage) => {
    console.error('Error loading model info:', errorMessage);
    handleErrorToast('Error loading model info.');
  });
};

  const handleDownloadModel = () => {
    setIsDownloading(true); // Start download state
    setProgress(0); // Reset progress
  
    // Send a message to the main process to start the model download
    ipcRenderer.send('download-model', projectInfo);
  
    // Listen for download progress updates from the main process
    ipcRenderer.on('download-progress', (event, progressData) => {
      const progressPercentage = Math.round(progressData.percent); // Assuming progressData.percent is a number from 0 to 100
      console.log(`Progress: ${progressPercentage}%`);
      setProgress(progressPercentage);
  
      // Stop the download progress when it reaches 100%
      if (progressPercentage === 100) {
        setIsDownloading(false);
      }
    });
  
    // Handle download completion
    ipcRenderer.on('download-complete', () => {
      setIsDownloading(false);
      setProgress(100); // Ensure progress is set to 100 when done
      console.log("Download completed!");
  
      // Show success toast message using the existing success_toast class
      setSuccessMessage('Model downloaded successfully and available locally!');
      setIsModelAvailable(true); // Set the state indicating model is available locally
      // getModelInfo();
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Toast will disappear after 3 seconds
    });
  
    // Handle download failure
    ipcRenderer.on('download-error', (event, errorMessage) => {
      setIsDownloading(false);
      handleErrorToast(`Download failed: ${errorMessage}`);
      console.error("Download failed:", errorMessage);
    });
  };
  

  // Handle the start of training
// Handle the start of training
const handleStartTraining = () => {
  if (!trainingFile) {
    handleErrorToast('Please upload a training data file before starting training.')
    return;
  }

  setIsTraining(true);
  setTrainingProgress(0); // Reset training progress

  // Path to the downloaded model file and training file
  const trainingFilePath = trainingFile.path; // Path of the uploaded training file

  // Send the file path to the main process to start training via the Python script
  ipcRenderer.send('run-python-script-start-training', [trainingFilePath]);

  // Listen for progress updates from the Python script
ipcRenderer.on('python-script-output', (event, data) => {
  console.log('Python Script Output:', data);

  // Check if the data is a Uint8Array (likely the case from the error message)
  if (data instanceof Uint8Array) {
    // Convert Uint8Array to string
    const dataString = new TextDecoder().decode(data); // Convert the array to string
    console.log('Converted Data String:', dataString);
    
    try {
      // Parse the string as JSON
      const parsedData = JSON.parse(dataString);

      // Handle progress updates
      if (parsedData.type === '') {
        setTrainingProgress(parsedData.progress * 100); // Update progress
      }

      // Handle result data when training completes
      if (parsedData.type === 'result') {
        setIsTraining(false);
        setSuccessMessage('Training completed successfully!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);

        // Set chart data for Highcharts
        setChartData(parsedData.highcharts_data);
        const obj = {model_id : "2024-10-14T09:23:20.530861670ce308d04d133838bfed8e",
          trained_weights_biases : parsedData.trained_weights_biases
        }
        setTrainedWeights(obj)
      }
    } catch (error) {
      console.error('Error parsing data:', error);
      handleErrorToast('An error occurred while parsing the training progress data.');
    }
  } else {
    // If it's a string or unexpected data, handle it accordingly
    if (typeof data === 'string') {
      // Handle as plain text (for stderr output or simple messages)
      if (data.includes('stderr')) {
        handleErrorToast(data);
        setIsTraining(false);
      } else {
        handleErrorToast('An unexpected error occurred during training.');
        console.error('Received non-JSON data:', data);
      }
    } else {
      console.error('Received unknown data type:', data);
    }
  }
});

};


  // Handle file selection for training
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setTrainingFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that hashCode is 64 characters long
    if (hashCode.length !== 64) {
      handleErrorToast('The hashcode must be exactly 64 characters.')
      return;
    }

    // Fetch project information using the hashCode
    fetchProjectData(hashCode);
  };
  const handleImportAnother = ()=>{
    setProjectInfo(null); 
    setHashCode(''); 
    setIsModelAvailable(false);
    setChartData(null)
  }
  return (
    <div className="import-project-container">
      {/* If projectInfo is available, display project details and hide the form */}
      {projectInfo ? (
        <>
          {successMessage && <p className="success_toast">{successMessage}</p>}
          {error && <p className="error_toast">{error}</p>}
          <div className="project-info">
            <div className='project-import-another'>
              <button type="submit" onClick={handleImportAnother} className="submit_button_training">Import Another Project</button>
            </div>
            <div className='project-main-info-container'>
              <p className='project-title'>{projectInfo.project.title}</p>
              <p className='project-description'> {projectInfo.project.short_description}</p>
              <p className='project-start_date'>{new Date(projectInfo.project.start_date).toLocaleString()}</p>

              {/* Download Progress Bar */}
              {isDownloading && (
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                  <p>Download Progress: {progress}%</p>
                </div>
              )}

              {/* Check if the model is available locally */}
              {!isModelAvailable && (
                <>
                  {/* Button to Download the Model */}
                  <button type="button" onClick={handleDownloadModel} className="submit_button_training">
                    Download the Model
                  </button>
                </>
              )}

              {/* Show if model is available locally */}
              {isModelAvailable && !isTraining && !chartData && (
                <div className="model-available">
                  <p>The model is available locally and ready for training!</p>
                  <input type="file" onChange={handleFileUpload} /> {/* File upload for training data */}
                  <button className="start_training_button" onClick={handleStartTraining}>Start Training</button>
                </div>
              )}

              {/* Show training progress if training is ongoing */}
              {isTraining && (
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${trainingProgress}%` }}
                  ></div>
                  <p>Training Progress: {trainingProgress}%</p>
                </div>
              )}

              {/* Render Highcharts if training is completed */}
              {chartData && (
                <div className="chart-container">
                  <TrainingDashboard 
                    options={{
                      title: { text: chartData.title },
                      xAxis: chartData.xAxis,
                      yAxis: chartData.yAxis,
                      credits: {enabled: false},
                      series: chartData.series
                    }}
                    trained_weights_biases={trainedWeights}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='project-import-headline'>Import Project</div>
          <form onSubmit={handleSubmit} className="form">
            <label htmlFor="hashcode" className="label">Enter 64-Character Hashcode</label>
            <input
              type="text"
              id="hashcode"
              name="hashcode"
              value={hashCode}
              onChange={handleInputChange}
              maxLength={64} // Update character limit to 64
              placeholder="Enter hashcode"
              className="input"
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="submit_button">Import</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ImportProject;
