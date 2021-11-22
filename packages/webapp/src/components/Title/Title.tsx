import React from "react";
import classes from "./Title.module.css";

const Title: React.FC<{content: string}> = props => {
    const {content} = props
    return (
        <div className={classes.Wrapper}>
            <h1 className={classes.Title}>{content}</h1>
        </div>
    )

};

export default Title;