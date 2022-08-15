import { VOTE_OPTIONS } from "../state/slices/vote";
import { yesVotesNeeded } from "../utils/voteMath";
import { setConsensusRequiredLikes, setConsensusUnreachable } from '../state/slices/vote';

const trackedActions = ['vote/setActiveVoters', 'vote/incrementCount']

const consensusMiddleware = () => {
    return store => next => action => {
        if (action.type === 'block/setBlockAttr') {
            const activeVoters = store.getState().vote.activeVoters;
            const requiredLikes = yesVotesNeeded(0, activeVoters);
            store.dispatch(setConsensusRequiredLikes(requiredLikes))
        } else if (trackedActions.includes(action.type)) {
            const state = store.getState()

            if (!state.vote.consensusUnreachable) {
                let activeVoters = state.vote.activeVoters;
                const votes = state.vote.voteCounts;
                let dislikes = votes[VOTE_OPTIONS.voteDislike];

                if (action.type === 'vote/incrementCount' && action.payload === 'voteDislike') {
                    dislikes += 1;
                } else if (action.type === 'vote/setActiveVoters') {
                    activeVoters = action.payload;
                }

                const requiredLikes = yesVotesNeeded(dislikes, activeVoters);

                if ((requiredLikes + dislikes) > activeVoters) {
                    store.dispatch(setConsensusUnreachable())
                } else {
                    store.dispatch(setConsensusRequiredLikes(requiredLikes))
                }
            }
        }

        return next(action);
    }

};

export default consensusMiddleware();