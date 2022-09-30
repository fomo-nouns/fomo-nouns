import React from "react";
import classes from './CornerHelpText.module.css';
import { isMobileScreen } from "../../utils/isMobile";
import clsx from 'clsx';
import { usePickByState } from "../../utils/colorResponsiveUIUtils";


const CornerHelpText: React.FC<{}> = (props) => {
  const display = isMobileScreen() ? 'none' : 'flex';
  const wrapperStyle = {
    display
  };

  const style = usePickByState(classes.Cool, classes.Warm)

  const textStyle = clsx(classes.Text, style)
  const keyStyle = clsx(classes.Key, style)

  return (
    <div className={classes.Wrapper} style={wrapperStyle}>
      <div className={textStyle}>Vote with</div>
      <svg className={keyStyle} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12.3005V5.91192C12 5.1046 11.0927 4.63006 10.4296 5.09055L5.31875 8.63975C4.71065 9.06205 4.75632 9.97573 5.40351 10.3353L10.5144 13.1746C11.1809 13.5449 12 13.063 12 12.3005Z" />
      </svg>
      <svg className={keyStyle} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 5.69951L6 12.0881C6 12.8954 6.90729 13.3699 7.57039 12.9094L12.6812 9.36025C13.2894 8.93795 13.2437 8.02427 12.5965 7.66472L7.48564 4.82536C6.81911 4.45506 6 4.93703 6 5.69951Z" />
      </svg>
      <div className={textStyle}>keys</div>
    </div>
  );
}

export default CornerHelpText;