import React from 'react';
import './Toggle.css';

const Toggle = (props)=> {
    return <div class="toggle">
                <span class="switch">
                    <input onChange={props.handleToggle} id="switch-rounded" type="checkbox" />
                    <label for="switch-rounded"></label>
                </span>
            </div>
}

export default Toggle;