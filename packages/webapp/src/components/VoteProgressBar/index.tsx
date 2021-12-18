import classes from './VoteProgressBar.module.css';
import { useAppSelector } from '../../hooks';

const VoteProgressBar: React.FC<{}> = props => {
    const activeAuction = useAppSelector(state => state.auction.activeAuction);
    let score = useAppSelector(state => state.vote.score) * 100;
    if (activeAuction) {
        score = 0;
    } else {
        const min = 5;
        score = score < min ? min : score;
        const max = 100;
        score = score > max ? max : score; 
    }
    const barStyle = {
        width: `${score}%`,
        transition: 'width .15s ease-out'
    };
    
    const opacity = activeAuction ? 0.5 : 1;
    const parentStyle = {
        opacity: opacity 
    };
    return(
        <div className={classes.Wrapper}>
            <div className={classes.BarOutline} style={parentStyle}>
                <div className={classes.ProgressBar} style={barStyle}/>
            </div>
        </div>
    )
};

export default VoteProgressBar;