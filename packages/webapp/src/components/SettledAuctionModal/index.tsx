import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Modal from '../Modal';
import classes from './SettledAuctionModal.module.css';
import { Image } from 'react-bootstrap';
import Confetti from 'react-dom-confetti';

import { ImageData, getNounSeedFromBlockHash, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import { resetPrevSettledBlockHash } from '../../state/slices/settlement';
const { palette } = ImageData;

const SettledAuctionModal: React.FC<{}> = props => {

  const confettiConfig = {
      angle: 90,
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
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [successfulSettle, setSuccessfulSettle] = useState(false);
  const [showConfetti, setConfetti] = useState(false);
  const [img, setImg] = useState("");
  const [localNounId, setLocalNounId] = useState(0);

  const prevSettledBlockHash = useAppSelector(state => state.settlement.prevSettledBlockHash);
  const attemptedSettleBlockHash = useAppSelector(state => state.settlement.attemptedSettleBlockHash);
  const nextNounId = useAppSelector(state => state.noun.nextNounId);

  const showModalHandler = () => {
    setShowConnectModal(true);
  };

  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  useEffect(() => {
    if (showConnectModal && successfulSettle) {
      setConfetti(true);
    }
  }, [showConnectModal, successfulSettle, showConfetti]);

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
      showModalHandler();
      attemptedSettleBlockHash === prevSettledBlockHash ? setSuccessfulSettle(true) : setSuccessfulSettle(false);
      dispatch(resetPrevSettledBlockHash());
    }
  }, [attemptedSettleBlockHash, prevSettledBlockHash, nextNounId, dispatch]);

  const copy = successfulSettle ? `Hello, Noun ${localNounId} 👋` : `Someone else minted Noun ${localNounId}`;
  const title = successfulSettle ? "We minted a Noun!" : "We missed it!";

  const settledAuctionContent = (
    <>
    <Confetti active={showConfetti} config={confettiConfig}/>
    <h3>{title}</h3>
    <Image src={`data:image/svg+xml;base64,${img}`} className={classes.NounImg} alt={`Minted Noun`}/>
    <h3>{copy}</h3>
    <p className={classes.Footer}>Come back and play again tomorrow!</p>
    </>
    );

  return (
    <div className={classes.ModalWrapper}>
      {showConnectModal && <Modal content={settledAuctionContent} onDismiss={hideModalHandler}/>}
    </div>
  )
};
export default SettledAuctionModal;