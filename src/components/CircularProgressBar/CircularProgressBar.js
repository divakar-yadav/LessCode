import React, {useState, useEffect } from 'react';
import './CircularProgressBar.css';

const CircularProgressBar = (props) => {
    // Define the custom properties as a regular style object key
    const [style, setStyle] = useState({
        '--value': 67  // Note the value as a number or string depending on usage
    });


    useEffect(()=>{
        setStyle({
            '--value': props.completion  // Note the value as a number or string depending on usage
        })
    },[props.completion])
    return (
        <div
            role="progressbar"
            aria-valuenow={props.completion}
            aria-valuemin="0"
            aria-valuemax="100"
            style={style}  // Apply the style object here
        >
        </div>
    );
}

export default CircularProgressBar;
