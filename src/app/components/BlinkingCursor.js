import React, { useState, useEffect } from 'react';
import '../globals.css';

function BlinkingCursor() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setVisible((prevVisible) => !prevVisible);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <span className={`blinking-cursor ${visible ? 'visible' : ''}`} />;
}

export default BlinkingCursor;
