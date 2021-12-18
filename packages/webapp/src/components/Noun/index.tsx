import React, { useCallback, useEffect, useState } from 'react';
import loadingNoun from '../../assets/loading-skull-noun.gif';
import Image from 'react-bootstrap/Image';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveBackground } from '../../state/slices/noun';
import classes from './Noun.module.css';

import { ImageData, getNounSeedFromBlockHash, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
const { palette } = ImageData;


const LoadingNoun = () => {
  return <Image src={loadingNoun} className={classes.img} alt={'loading noun'}/>;
};

const Noun: React.FC<{ alt: string }> = props => {
  const { alt } = props;

  const dispatch = useAppDispatch();
  const [img, setImg] = useState('');

  const blockhash = useAppSelector(state => state.block.blockHash);
  const nextNounId = useAppSelector(state => state.noun.nextNounId)!;

  const generateNoun = useCallback(async () => {
    if (!blockhash) return;

    const isNounder = nextNounId % 10 === 0;
    const adjNextNounId = isNounder ? nextNounId + 1 : nextNounId;

    const seed = getNounSeedFromBlockHash(adjNextNounId, blockhash);
    const { parts, background } = getNounData(seed);

    const svgBinary = buildSVG(parts, palette, background);
    setImg(btoa(svgBinary));
    dispatch(setActiveBackground(seed.background === 0));
  }, [nextNounId, blockhash]);

  useEffect(() => {
    generateNoun();
  }, [blockhash]);


  return (
    <div className={classes.imgWrapper}>
      {nextNounId && <Image className={classes.img} src={`data:image/svg+xml;base64,${img}`} alt={alt} fluid />}
      {!nextNounId && <LoadingNoun />}
    </div>
  );
};

export default Noun;