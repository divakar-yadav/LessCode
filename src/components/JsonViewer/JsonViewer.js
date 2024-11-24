import React, { useState, useEffect } from 'react';
import './JsonViewer.css';

const JsonViewer = ()=> {
  const [jsonData, setJsonData] = useState('');

  useEffect(() => {
    const myData = {
      "address": {
        "House_Number": 505,
        "Street_Direction": "",
        "Street_Name": "s",
        "Street_Type": "Street",
        "Apt": "15L",
        "Burough": "Brooklyn",
        "State": "NY",
        "Zip": "10451",
        "Phone": "718-777-7777"
      },
      "casehead": 0,
      "adults": [{
        "Last_Name": "Foo",
        "First_Name": "A",
        "Sex": "M",
        "Date_Of_Birth": "01011980"
      }],
      "children": []
    };

    const textedJson = JSON.stringify(myData, undefined, 4);
    setJsonData(textedJson);
  }, []);

  return (
    <div style={{ padding: '2rem', fontSize: '16px' }}>
        <div className='json_viewer_title'> Training data format</div>
      <textarea
        id="myTextarea"
        cols="30"
        rows="10"
        style={{
          width: '100%',
          minHeight: 'auto',
          fontFamily: '"Lucida Console", Monaco, monospace',
          fontSize: '0.6rem',
          lineHeight: 1.2,
          outline: 'none'
        }}
        value={jsonData}
        readOnly
      />
    </div>
  );
}
export default JsonViewer;
