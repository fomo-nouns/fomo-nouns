import React from "react";
import classes from './YoloWidget.module.css';


const YoloWidget: React.FC<{}> = (props) => {
  const onClick = () => {
    // TODO: "open" widget
    console.log('click')
  }

  return(
    <div className={classes.Wrapper} onClick={onClick}>
        <div className={classes.Text}>Yolo It!</div>
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
    </div>
  );
}

export default YoloWidget;