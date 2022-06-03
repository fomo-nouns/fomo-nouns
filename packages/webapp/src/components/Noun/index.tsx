import React, { useEffect, useMemo } from 'react';
import loadingNoun from '../../assets/loading-skull-noun.gif';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveBackground } from '../../state/slices/noun';
import classes from '../Noun/Noun.module.css';

import { ImageData, getNounSeedFromBlockHash, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
const { palette } = ImageData;

function getNounImage(nounId: number, blockhash: string){
  const seed = getNounSeedFromBlockHash(nounId, blockhash);
  const { parts, background } = getNounData(seed);

  const svgBinary = buildSVG(parts, palette, background);
  return {src: `data:image/svg+xml;base64,${btoa(svgBinary)}`, seed};
}

const Noun: React.FC = props => {

  const dispatch = useAppDispatch();

  const blockhash = useAppSelector(state => state.block.blockHash);
  const nextNounId = useAppSelector(state => state.noun.nextNounId)!;
  const ethereumConnected = useAppSelector(state => state.block.connected);

  const nounImageData = useMemo(() => {
    const data = []

    // Return the Loading Noun
    if (!blockhash || !nextNounId || !ethereumConnected){
      data.push({seed: {background: 0}, src: loadingNoun, alt: 'Loading Noun', nounId:''});
      return data
    }

    // Push the first Noun
    const {src, seed} = getNounImage(nextNounId, blockhash)
    data.push({seed, src, alt: `Noun ${nextNounId}`})

    // Every 10th Noun, push another Noun
    if (nextNounId % 10 === 0){
      const {src, seed} = getNounImage(nextNounId+1, blockhash)
      data.push({seed, src, alt: `Noun ${nextNounId+1}`})
    }

    return data

  }, [nextNounId, blockhash, ethereumConnected]);

  useEffect(()=>{
    // When there's only 1 Noun, change the page background to match
    if (nounImageData.length > 1) return;
    dispatch(setActiveBackground(nounImageData[0].seed.background === 0));
  },[dispatch, nounImageData])


  const Imgs = nounImageData.map( ({src, alt}, i) => {
    return (
      <div>
        <img
          className={classes.img}
          src={src}
          alt={alt}
        />
      </div>
      )
  })

  return (
    <div className={Imgs.length > 1 ? classes.multinounWrapper : classes.imgWrapper}>
      {Imgs}
    </div>
  );
};

export default Noun;