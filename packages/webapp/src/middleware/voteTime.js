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
            store.dispatch(setVoteTimeLeft(0));
            clearInterval(timer);
        } else {
            timer = setTimeout(() => { updateTimer(store) }, 60);
        }
    }

    const closeTimer = (store, time, x) => {
        const newTime = time - (60 * x);
        store.dispatch(setVoteTimeLeft(newTime));

        if (time < 0) {
            store.dispatch(endVoting());
            store.dispatch(setVoteTimeLeft(0));
            clearInterval(timer);
        } else {
            timer = setTimeout(() => { closeTimer(store, newTime, x + 1) }, 60);
        }
    }

    return store => next => action => {
        if (action.type === 'block/setBlockAttr') {
            currentBlockTime = action.payload.blockTime;
            updateTimer(store);
        } else if (action.type === 'vote/triggerSettlement') {
            // store.dispatch(setVoteTimeLeft(0))
            // clearInterval(timer);
            // clearInterval(timer);
            // closeTimer(store, dayjs().valueOf() - currentBlockTime, 1);
        }

        return next(action);
    }

};

export default voteTime();