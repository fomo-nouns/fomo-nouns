import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Modal from '../Modal';
import classes from './SettledAuctionModal.module.css';
import Confetti from 'react-dom-confetti';
import axios from 'axios';

import { ImageData, getNounSeedFromBlockHash, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import { resetPrevSettledBlockHash } from '../../state/slices/settlement';
const { palette } = ImageData;

const SettledAuctionModal: React.FC<{}> = props => {

  const confettiConfig = {
      angle: 80,
      spread: 180,
      startVelocity: 70,
      elementCount: 150,
      dragFriction: 0.12,
      duration: 9000,
      stagger: 8,
      width: "10px",
      height: "10px",
      colors: ["#a864fd", "#29cdff", "#8efc62", "#fa5768", "#fdff6a", '#f9b9f2']
  };

  const dispatch = useAppDispatch();

  // local state variables
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [successfulSettle, setSuccessfulSettle] = useState(false);
  const [localNounId, setLocalNounId] = useState(0);
  const [img, setImg] = useState("");
  const [showConfetti, setConfetti] = useState(false);
  const [shareCopy, setShareCopy] = useState("");
  const [mediaURL, setMediaURL] = useState("");
  const [showTwitter, setShowTwitter] = useState(false);
  
  const prevSettledBlockHash = useAppSelector(state => state.settlement.prevSettledBlockHash);
  const attemptedSettleBlockHash = useAppSelector(state => state.settlement.attemptedSettleBlockHash);
  const nextNounId = useAppSelector(state => state.noun.nextNounId);

  const showModalHandler = () => {
    setShowConnectModal(true);
  };

  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  // get the image of the most recently minted Noun from Twitter
  useEffect(() => {
    if (showConnectModal && successfulSettle && localNounId > 0) {
      setShareCopy(encodeURI("gm, I just minted this Noun for @nounsdao by playing FOMO Nouns! "));
      // wait for 750ms, then fetch image from twitter
      setTimeout(() => {
        axios.get('/.netlify/functions/twitter', {params: {id: localNounId}})
        .then( res => {
          const data = res.data;
          setMediaURL(data.mediaUrl);
          setShowTwitter(mediaURL !== "");
          //reload the twitter widgets
          if (window) {
            (window as any).twttr.widgets.load();
          }
        });
      }, 15000);
      
      setConfetti(true);
    }
  }, [showConnectModal, successfulSettle, showConfetti, localNounId, mediaURL]);

  useEffect(() => {
    const getNounImg = () => {
      if (nextNounId === undefined || nextNounId === null) return;
      if (!prevSettledBlockHash) return;
      const adjNounId = nextNounId - 1;
      setLocalNounId(adjNounId);
      const seed = getNounSeedFromBlockHash(adjNounId, prevSettledBlockHash);
      const { parts, background } = getNounData(seed);
  
      const svgBinary = buildSVG(parts, palette, background);
      setImg(btoa(svgBinary));
    }

    if (prevSettledBlockHash) {
      getNounImg();
      attemptedSettleBlockHash === prevSettledBlockHash ? setSuccessfulSettle(true) : setSuccessfulSettle(false);
      showModalHandler();
      dispatch(resetPrevSettledBlockHash());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptedSettleBlockHash, prevSettledBlockHash, nextNounId, dispatch]);

  const copy = successfulSettle ? `Hello, Noun ${localNounId} 👋` : `Someone else minted Noun ${localNounId}`;
  const title = successfulSettle ? "We minted a Noun!" : "We missed it!";
  const settledAuctionContent = (
    <>
    <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
    <Confetti active={showConfetti} config={confettiConfig}/>
    <h3>{title}</h3>
    <img src={`data:image/svg+xml;base64,${img}`} className={classes.NounImg} alt={`Minted Noun`}/>
    <h3>{copy}</h3>
    <p className={classes.Footer}>Come back and play again tomorrow!</p>
    {showTwitter && 
    <a className='twitter-share-button' href={`https://twitter.com/intent/tweet/?text=${shareCopy + mediaURL}`}>Tweet </a>}
    </>
    );

  return (
    <div className={classes.ModalWrapper}>
      {showConnectModal && <Modal content={settledAuctionContent} onDismiss={hideModalHandler}/>}
    </div>
  )
};
export default SettledAuctionModal;