import React, {useState, useEffect } from 'react';
import './HomePage.css'
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import CircularProgressBar from '../../components/CircularProgressBar/CircularProgressBar';
import Upload from '../../components/Upload/Upload';
import JsonViewer from '../../components/JsonViewer/JsonViewer'
import FileEditor from '../FileEditor/FileEditor'
const HomePage = ()=> {
    const [code, setCode] = useState("// Write your JavaScript code here");
    const [output, setOutput] = useState("");

    return <div className='homepage_main_container'>
            <FileEditor code={code} setCode={setCode} />
        </div>
}

export default HomePage;