import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { ipcRenderer } from "electron"; // Import ipcRenderer for communication
import './TrainingDashboard.css'; // Import the CSS file

const TrainingDashboard = ({ options, trained_weights_biases }) => {
  const [trainingAccuracy, setTrainingAccuracy] = useState(0);
  const [validationAccuracy, setValidationAccuracy] = useState(0);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [lossChart, setLossChart] = useState({
    title: { text: "Training Loss Over Time" },
    xAxis: { categories: [] },
    series: [{ data: [] }]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTrainingAccuracy((prev) => Math.min(prev + Math.random() * 5, 100));
      setValidationAccuracy((prev) => Math.min(prev + Math.random() * 5, 100));
      setTrainingProgress((prev) => Math.min(prev + 10, 100));

      setLossChart((prevChart) => ({
        ...prevChart,
        xAxis: {
          ...prevChart.xAxis,
          categories: [...prevChart.xAxis.categories, `Epoch ${prevChart.xAxis.categories.length + 1}`],
        },
        credits: {enabled: false},
        series: [
          {
            name: "Loss",
            data: [...prevChart.series[0].data, Math.random() * 1.5] 
          }
        ]
      }));
    }, 1000);

    if (trainingProgress === 100) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [trainingProgress]);

  const handleSyncWithServer = () => {
    // Send the weights and biases to the main process using the 'send-weights' event
    console.log(trained_weights_biases,"--------trained_weights_biases-----")
    ipcRenderer.send('send-weights', trained_weights_biases);

    // Listen for the response from the main process
    ipcRenderer.on('send-weights-response', (event, data) => {
      console.log('Received response from /send-weights:', data);
      alert('Weights and biases synced successfully!');
    });

    // Handle any error during the process
    ipcRenderer.on('send-weights-error', (event, error) => {
      console.error('Error sending weights:', error);
      alert('Error syncing weights with server.');
    });
  };

  return (
    <div className="dashboard-container">
      <h2>Model Training Dashboard</h2>
      <div className="metrics-container">
        <div className="metric-card">
          <h3>Training Accuracy</h3>
          <p>{trainingAccuracy.toFixed(2)}%</p>
        </div>
        <div className="metric-card">
          <h3>Validation Accuracy</h3>
          <p>{validationAccuracy.toFixed(2)}%</p>
        </div>
      </div>

      <div className="progress-bar-container">
        <h4>Training Progress</h4>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${trainingProgress}%` }}
          ></div>
        </div>
        <p>{trainingProgress}%</p>
      </div>

      <div className="chart-container">
        <HighchartsReact highcharts={Highcharts} options={lossChart} />
      </div>

      <div className="confusion-matrix">
        <h4>Confusion Matrix</h4>
        <div className="matrix-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div className="matrix-cell" key={i}>0</div>
          ))}
        </div>
      </div>

      <div className="model-info">
        <h4>Model Information</h4>
        <p>Layers: 3</p>
        <p>Total Parameters: 5</p>
        <p>Trainable Parameters: 4</p>
      </div>

      <HighchartsReact highcharts={Highcharts} options={options} />
      
      <div onClick={handleSyncWithServer} className="model-sync-with-server">
        Sync with Server
      </div>
    </div>
  );
};

export default TrainingDashboard;
