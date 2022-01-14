import React, { useCallback, useEffect, useState } from 'react';
import loadingNoun from '../../assets/loading-skull-noun.gif';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveBackground } from '../../state/slices/noun';
import classes from './Noun.module.css';

import { ImageData, getNounSeedFromBlockHash, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
const { palette } = ImageData;


const Noun: React.FC<{ alt: string }> = props => {
  const { alt } = props;

  const dispatch = useAppDispatch();
  const [img, setImg] = useState('');

  const blockhash = useAppSelector(state => state.block.blockHash);
  const nextNounId = useAppSelector(state => state.noun.nextNounId)!;
  const ethereumConnected = useAppSelector(state => state.block.connected);

  const generateNoun = useCallback(async () => {
    if (!blockhash) return;

    const isNounder = nextNounId % 10 === 0;
    const adjNextNounId = isNounder ? nextNounId + 1 : nextNounId;

    const seed = getNounSeedFromBlockHash(adjNextNounId, blockhash);
    const { parts, background } = getNounData(seed);

    const svgBinary = buildSVG(parts, palette, background);
    setImg(btoa(svgBinary));
    dispatch(setActiveBackground(seed.background === 0));
  }, [dispatch, nextNounId, blockhash]);

  useEffect(() => {
    generateNoun();
  }, [generateNoun, blockhash]);
  

  let htmlImg, htmlAlt;
  if (!nextNounId || !ethereumConnected) {
    htmlImg = loadingNoun;
    htmlAlt = 'Loading Noun';
  } else {
    htmlImg = `data:image/svg+xml;base64,${img}`;
    htmlAlt = alt;
  }

  return (
    <div className={classes.imgWrapper}>
        <img className={classes.img}
          src={htmlImg}
          alt={htmlAlt}
          height="500px"
          width="500px"
        />
      </div>
  );
};

export default Noun;