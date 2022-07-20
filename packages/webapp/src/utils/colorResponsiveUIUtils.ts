import { useAppSelector } from '../hooks';

/**
 * Utility function that takes three items and returns whichever one corresponds to the current
 * page state (white, cool, warm)
 * @param whiteState  What to return if the state is white
 * @param coolState  What to return if the state is cool
 * @param warmState  What to return is the state is warm
 * @param history  History object from useHistory
 * @returns item corresponding to current state
 */
export const usePickByState = (whiteState: any, coolState: any, warmState: any) => {
  const isCoolState = useAppSelector(state => state.noun.isCoolBackground);

  if (isCoolState) {
    return coolState;
  }
  return warmState;
};
