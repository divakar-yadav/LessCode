import "./App.css";
import React, { useState, useEffect } from "react";
import HomePage from "./views/HomePage/HomePage";
import ChatRoom from "./views/ChatRoom/ChatRoom";
import contribution from './assets/contribution.png';
import setting from './assets/setting.png';
import live from './assets/live.png';
import feedback from './assets/feedback.png';
import add from './assets/add.png';
import wifi from './assets/wifi.png';
import nowifi from './assets/no-wifi.png'
import Toggle from './components/Toggle/Toggle';
import chat from './assets/chat.png'
import ImportProject from "./views/ImportProject/ImportProject";
import SyntheticDataGenerator from "./views/SyntheticDataGenerator/SyntheticDataGenerator";


const App = () => {

    const [status, setStatus] = useState('Offline');
    const [tab, setTab] = useState('homepage');

    const handleToggle = ()=>{

        if(status==='Online'){
            setStatus('Offline')
        }
        else{
            setStatus('Online')
        }
    }
    // useEffect(()=>{
    //     renderComponents("homepage")
    // })

  const renderComponents = (route) => {
    switch (route) {
      case "homepage":
        // code block
        return <HomePage />;
      case "projects":
        return <ChatRoom/>
      case "import-project":
        return <ImportProject/>
      case "synthetic-data-generator":
        return <SyntheticDataGenerator/>
        // code block
        break;
      default:
      // code block
    }
  };
  return (
        <div className='homepage'>
          <div className="homepage_toolbar">
        <div className="homepage_toolbar_visibility">
          <span
            className={
              status === "Offline"
                ? "homepage_toolbar_visibility_offline"
                : "homepage_toolbar_visibility_online"
            }
          >
            {status}
          </span>
          <img
            className="item_icon"
            src={status === "Online" ? wifi : nowifi}
          />
        </div>
        <div className="homepage_toolbar_online_offline">
          <Toggle handleToggle={handleToggle} />
        </div>
      </div>
      <div className='homepage_body'>
        <div className='homepage_sidenav'>
        <div className='sidenav_links'>
                    <ul>
                    {/* <li className='homepage_sidenav_master_button'>
                            <div className='sidenav_item_master_button'>
                                <div className='redirect'>Contribute New</div>
                                <img className='item_icon' src={add}/>
                            </div>
                        </li> */}
                        <li>
                        <div className='sidenav_item' onClick={()=>setTab('homepage')}>
                        {/* <img className='item_icon' src={contribution}/> */}
                                <div className='redirect'>Open Folder</div>
                            </div>
                        </li>
                        <li>
                            <div className='sidenav_item' onClick={()=>setTab('import-project')}>
                                {/* <img className='item_icon' src={setting}/> */}
                                <div className='redirect'>Clone Repository</div>
                            </div>
                        </li>
                        {/* <li>
                            <div className='sidenav_item' onClick={()=>setTab('projects')}>
                                <img className='item_icon' src={chat}/>
                                <div className='redirect'>Chat</div>
                            </div>
                        </li> */}
                        {/* <li>
                            <div className='sidenav_item' onClick={()=>setTab('synthetic-data-generator')}>
                                <img className='item_icon' src={live}/>
                                <div className='redirect'>Synthetic Data Generator</div>
                            </div>
                        </li> */}
                        {/* <li>
                            <div className='sidenav_item' onClick={()=>setTab('projects')}>
                                <img className='item_icon' src={contribution}/>
                                <div className='redirect'>Approved</div>
                            </div>
                        </li>
                        <li>
                            <div className='sidenav_item' onClick={()=>setTab('projects')}>
                                <img className='item_icon' src={contribution}/>
                                <div className='redirect'>Profile</div>
                            </div>
                        </li> */}
                        {/* <li>
                            <div className='sidenav_item'>
                                <img className='item_icon' src={contribution}/>
                                <div className='redirect'>Your Contributions</div>
                            </div>
                        </li>
                        <li>
                            <div className='sidenav_item'>
                                <img className='item_icon' src={setting}/>
                                <div className='redirect'>Recent</div>
                            </div>
                        </li>
                        <li>
                            <div className='sidenav_item'>
                                <img className='item_icon' src={live}/>
                                <div className='redirect'>Terms</div>
                            </div>
                        </li>
                        <li>
                            <div className='sidenav_item'>
                                <img className='item_icon' src={contribution}/>
                                <div className='redirect'>Differential Privacy</div>
                            </div>
                        </li>
                        <li>
                            <div className='sidenav_item'>
                                <img className='item_icon' src={setting}/>
                                <div className='redirect'>FAQ</div>
                            </div>
                        </li>
                        <li>
                            <div className='sidenav_item'>
                                <img className='item_icon' src={live}/>
                                <div className='redirect'>Share</div>
                            </div>
                        </li>
                        <li>
                            <div className='sidenav_item'>
                                <img className='item_icon' src={feedback}/>
                                <div className='redirect'>Send Feedback</div>
                            </div>
                        </li> */}
                    </ul>
                </div>
        </div>
        {renderComponents(tab)}
        </div>
    </div>
  );
};

export default App;
