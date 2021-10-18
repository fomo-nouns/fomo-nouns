import classes from './VoteProgressBar.module.css'
import { ProgressBar } from "react-bootstrap";

const VoteProgressBar: React.FC<{progress: number}> = props => {
    const { progress } = props;
    return(
        <div className={classes.progressBar}>
            <ProgressBar label={`${progress}%`}/>
        </div>
    )
};

export default VoteProgressBar;