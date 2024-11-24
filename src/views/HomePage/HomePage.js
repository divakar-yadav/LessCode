import React, {useState, useEffect } from 'react';
import './HomePage.css'
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import CircularProgressBar from '../../components/CircularProgressBar/CircularProgressBar';
import Upload from '../../components/Upload/Upload';
import JsonViewer from '../../components/JsonViewer/JsonViewer'

const HomePage = ()=> {

    return <div className='homepage_main_container'>
                <div className='homepage_batch_information_component'>
                    <div className='homepage_batch_information_component_current_batch_status'>
                        <div className='homepage_batch_information_component_current_batch_status_wrapper'>
                            <span className='homepage_batch_information_component_current_batch_status_wrapper_text'>Over Trained Completion</span>
                            <CircularProgressBar completion = {35}/>
                        </div>
                    </div>
                    <div className='homepage_batch_information_component_batches'>
                            <div className='homepage_batch_information_component_batch'>
                                <span className='homepage_batch_information_component_batch_text'>Batch #288</span>
                            <ProgressBar/>
                            </div>
                            <div className='homepage_batch_information_component_batch'>
                                <span className='homepage_batch_information_component_batch_text'>Batch #287</span>
                            <ProgressBar/>
                            </div>
                            <div className='homepage_batch_information_component_batch'>
                                <span className='homepage_batch_information_component_batch_text'>Batch #286</span>
                            <ProgressBar/>
                            </div>
                    </div>
                </div>
                <div className='homepage_batch_information_component_json_viewer'>
                    <div className='homepage_batch_information_component_json_viewer_wrapper'>
                    <JsonViewer/>
                    </div>
                </div>
                <div className='homepage_batch_information_component_upload'>
                    <div className='homepage_batch_information_component_wrapper'>
                    <Upload maxFiles={1}/>
                    </div>
                </div>
        </div>
}

export default HomePage;