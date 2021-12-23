import React from "react";
import classes from "./Footer.module.css";


const Footer: React.FC<{}> = props => {
  return (
    <div className={classes.Footer}>
      Built by <a href="https://twitter.com/_forager">@forager</a> and <a href="https://twitter.com/0xRayo">@rayo</a>
    </div>
  )
};

export default Footer;