import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Modal from '../Modal';
import classes from './SettledAuctionModal.module.css';
import { Image } from 'react-bootstrap';

import { ImageData, getNounSeedFromBlockHash, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import { resetPrevSettledBlockHash } from '../../state/slices/settlement';
const { palette } = ImageData;

const SettledAuctionModal: React.FC<{}> = props => {
  const dispatch = useAppDispatch();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [successfulSettle, setSuccessfulSettle] = useState(false);
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

    console.log("two block hashes: ", attemptedSettleBlockHash, prevSettledBlockHash);
    if (prevSettledBlockHash) {
      getNounImg();
      showModalHandler();
      attemptedSettleBlockHash === prevSettledBlockHash ? setSuccessfulSettle(true) : setSuccessfulSettle(false);
      dispatch(resetPrevSettledBlockHash());
    }
  }, [attemptedSettleBlockHash, prevSettledBlockHash, nextNounId, dispatch]);

  const copy = successfulSettle ? `Hello, Noun ${localNounId}!` : "We weren't able to mint a Noun in time.";
  const title = successfulSettle ? "We minted a Noun!" : "A new Noun has been minted.";

  const settledAuctionContent = (
    <>
    <Image src={`data:image/svg+xml;base64,${img}`} className={classes.NounImg} alt={`Minted Noun`}/>
    <p className={classes.Copy}>{copy}</p>
    <p className={classes.Footer}>Come back tomorrow to play FOMO Nouns</p>
    </>
    );

  return (
    <div className={classes.ModalWrapper}>
      {showConnectModal && <Modal title={title} content={settledAuctionContent} onDismiss={hideModalHandler} />}
    </div>
  )
};
export default SettledAuctionModal;