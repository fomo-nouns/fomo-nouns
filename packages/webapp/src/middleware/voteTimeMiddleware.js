import { default as config } from '../config';
import { endVoting, setVoteTimeLeft } from '../state/slices/vote';
import dayjs from 'dayjs';

const voteTimeSetting = config.voteTime;

const closeVoteActions = ['vote/triggerSettlement', 'vote/setConsensusUnreachable']

const voteTimeMiddleware = () => {
    let currentBlockTime = null;
    let timer = null

    const closeVoting = (store) => {
        clearInterval(timer);
        store.dispatch(endVoting());
        store.dispatch(setVoteTimeLeft(0));
    }

    const updateTimer = (store) => {
        const timeSinceLastBlock = dayjs().valueOf() - currentBlockTime;
        const voteTimeLeft = voteTimeSetting - timeSinceLastBlock

        if (voteTimeLeft < 0) {
            closeVoting(store);
        } else {
            store.dispatch(setVoteTimeLeft(voteTimeLeft));
            timer = setTimeout(() => { updateTimer(store) }, 60);
        }
    }

    // TODO: fix problems with UI glitching side effects this sometimes causes
    const closeTimer = (store, time, x) => {
        const newTime = time - (60 * x);

        if (time < 0) {
            closeVoting(store);
        } else {
            store.dispatch(setVoteTimeLeft(newTime));
            timer = setTimeout(() => { closeTimer(store, newTime, x + 1) }, 60);
        }
    }

    return store => next => action => {
        if (action.type === 'block/setBlockAttr') {
            clearInterval(timer);
            currentBlockTime = action.payload.blockTime;
            updateTimer(store);
        } else if (closeVoteActions.includes(action.type)) {
            closeVoting(store);

            // clearInterval(timer);
            // closeTimer(store, dayjs().valueOf() - currentBlockTime, 1);
        }

        return next(action);
    }

};

export default voteTimeMiddleware();