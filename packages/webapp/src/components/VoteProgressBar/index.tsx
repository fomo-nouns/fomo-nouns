import classes from './VoteProgressBar.module.css';

const VoteProgressBar: React.FC<{progress: number}> = props => {
    const { progress } = props;
    const barWidth = {
        width: `${progress}%`
    }

    return(
        <div className={classes.ParentWrapper}>
            <div className={classes.ChildWrapper} style={barWidth}>
                <span className={classes.ProgressBar}></span>
            </div>
        </div>
    )
};

export default VoteProgressBar;