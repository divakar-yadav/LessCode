import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const { ipcRenderer } = window.require('electron');
import './Upload.css';

const Upload = ({ maxFiles }) => {
    const [selectedFile, setSelectedFile] = useState([]);
    const [progress, setProgress] = useState(0);
    const [highchartsData, setHighchartsData] = useState(null);
    const [isTraining, setIsTraining] = useState(false);

    useEffect(() => {
        ipcRenderer.on('python-script-output', (event, data) => {
            try {
                console.log(event, "----event-----");
                console.log(data, "----data-----");

                // Check if data is a Uint8Array
                if (data instanceof Uint8Array) {
                    // Convert Uint8Array to string
                    const dataString = new TextDecoder().decode(data);
                    // Parse the string as JSON
                    data = JSON.parse(dataString);
                }

                if (data.progress !== undefined) {
                    setProgress(data.progress * 100);
                } else {
                    setIsTraining(false);
                    setProgress(0);
                    setHighchartsData(data.highcharts_data);
                }
            } catch (error) {
                console.error('Error parsing data:', error);
                alert('Something went wrong. Please try again.');
            }
        });

        return () => {
            ipcRenderer.removeAllListeners('python-script-output');
        };
    }, []);

    const fileSize = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        let newFiles = selectedFile;

        if (maxFiles) {
            const totalAllowedFiles = maxFiles - newFiles.length;
            newFiles = [...newFiles, ...files.slice(0, totalAllowedFiles)];
            if (files.length > totalAllowedFiles) {
                alert(`You can only upload ${maxFiles} files. Additional files have been ignored.`);
            }
        } else {
            newFiles = [...newFiles, ...files];
        }

        const filesWithDetails = newFiles.map((file, index) => {
            if (file && file instanceof File) {
                return {
                    id: index,
                    filename: file.name,
                    filetype: file.type,
                    filepath: file.path,
                    fileimage: URL.createObjectURL(file),
                    datetime: file.lastModifiedDate.toLocaleString('en-IN'),
                    filesize: fileSize(file.size)
                };
            } else {
                console.error('Invalid file detected:', file);
                return null;
            }
        }).filter(file => file !== null);

        setSelectedFile(filesWithDetails);
    };

    const deleteFile = (id) => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            const remainingFiles = selectedFile.filter(file => {
                if (file.id !== id) {
                    return true;
                } else {
                    URL.revokeObjectURL(file.fileimage);
                    return false;
                }
            });
            setSelectedFile(remainingFiles);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const filePaths = selectedFile.map(file => file.filepath);
        ipcRenderer.send('run-python-script', filePaths);
        setSelectedFile([]);
        setIsTraining(true);
        setProgress(0);
    };

    return (
        <div className="fileupload-view">
            <div className="row justify-content-center m-0">
                <div className="col-md-6">
                    <div className="card mt-5">
                        <div className="card-body">
                            <div className="kb-data-box">
                                <div className="kb-modal-data-title">
                                    {!isTraining && 
                                    (<div className="kb-data-title">
                                        <h6>Upload the training data</h6>
                                    </div>)
                                    }

                                </div>
                                {highchartsData && (
                                    <div>
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={{
                                                title: { text: highchartsData.title },
                                                xAxis: highchartsData.xAxis,
                                                yAxis: highchartsData.yAxis,
                                                series: highchartsData.series
                                            }}
                                        />
                                    </div>
                                )}
                                {isTraining && (
                                    <div>
                                        <h6>Training in progress...</h6>
                                        <div className="progress-bar">
                                            <div className="bar" style={{ width: `${progress}%` }}>
                                                <span className="perc">{`${progress.toFixed(2)}%`}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {!isTraining && (                                
                                <form onSubmit={handleSubmit}>
                                    <div className="kb-file-upload">
                                        <div className="file-upload-box">
                                            <input
                                                type="file"
                                                id="fileupload"
                                                className="file-upload-input"
                                                onChange={handleChange}
                                                multiple
                                            />
                                            <span>Drag and drop or <span className="file-link">Choose your files</span></span>
                                        </div>
                                    </div>
                                    <div className="kb-attach-box mb-3">
                                        {selectedFile.map((data, index) => (
                                            <div className="file-atc-box" key={data.id}>
                                                <div className="file-image">
                                                    {data.filename.match(/.(jpg|jpeg|png|gif|svg)$/i) ? (
                                                        <img src={data.fileimage} alt="" />
                                                    ) : (
                                                        <i className="far fa-file-alt"></i>
                                                    )}
                                                </div>
                                                <div className="file-detail">
                                                    <h6>{data.filename}</h6>
                                                    <p>
                                                        <span>Size: {data.filesize}</span>
                                                        <span className="ml-2">Modified Time: {data.datetime}</span>
                                                    </p>
                                                    <div className="file-actions">
                                                        <button type="button" className="file-action-btn" onClick={() => deleteFile(data.id)}>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {selectedFile.length > 0 ?                                    
                                        <div className="kb-buttons-box">
                                            <button type="submit" className="btn btn-primary form-submit">Start Training</button>
                                        </div> 
                                    : null}
                                </form>)}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;
