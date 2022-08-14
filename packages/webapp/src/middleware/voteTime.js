import { default as config } from '../config';
import { endVoting, setVoteTimeLeft } from '../state/slices/vote';
import dayjs from 'dayjs';

const voteTimeSetting = config.voteTime;

const voteTime = () => {
    let currentBlockTime = null;
    let timer = null

    const updateTimer = (store) => {
        const timeSinceLastBlock = dayjs().valueOf() - currentBlockTime;
        const voteTimeLeft = voteTimeSetting - timeSinceLastBlock
        store.dispatch(setVoteTimeLeft(voteTimeLeft));

        if (voteTimeLeft < 0) {
            store.dispatch(endVoting());
            store.dispatch(setVoteTimeLeft(voteTimeSetting));
            clearInterval(timer);
        } else {
            timer = setTimeout(() => { updateTimer(store) }, 60);
        }
    }

    return store => next => action => {
        if (action.type === 'block/setBlockAttr') {
            currentBlockTime = action.payload.blockTime;
            updateTimer(store);
        }

        return next(action);
    }

};

export default voteTime();