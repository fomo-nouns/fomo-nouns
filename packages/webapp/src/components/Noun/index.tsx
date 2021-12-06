import React, { useCallback, useEffect, useState } from 'react';
import loadingNoun from '../../assets/loading-skull-noun.gif';
import Image from 'react-bootstrap/Image';
import { contract as SeederContract } from '../../wrappers/nounsSeeder';
import { contract as DesciptorContract } from '../../wrappers/nounsDescriptor';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveBackground } from '../../state/slices/background';
import classes from './Noun.module.css';

const LoadingNoun = () => {
  return <Image src={loadingNoun} className={classes.img} alt={'loading noun'}/>;
};

const Noun: React.FC<{ alt: string }> = props => {
  const dispatch = useAppDispatch();
  const [img, setImg] = useState('');

  const blockNum = useAppSelector(state => state.block.blockNumber);
  const nextNounId = useAppSelector(state => state.noun.nextNounId)!;
  const generateNoun = useCallback( async() => {
    const isNounder = nextNounId % 10 === 0;
    const adjNextNounId = isNounder ? nextNounId + 1 : nextNounId;
    const seed = await SeederContract.generateSeed(
      adjNextNounId,
      DesciptorContract.address,
      {
        blockTag: 'pending'
      }
      );
      const useGreyBg = seed[0] === 0;
      const svg = await DesciptorContract.generateSVGImage(seed);
      setImg(svg);
      dispatch(setActiveBackground(useGreyBg));
    }, [dispatch, nextNounId]);

    useEffect(() => {
      generateNoun();
    }, [blockNum, generateNoun]);
    
  const { alt } = props;
  return (
    <div className={classes.imgWrapper}>
      {nextNounId && <Image className={classes.img} src={`data:image/svg+xml;base64,${img}`} alt={alt} fluid />}
      {!nextNounId && <LoadingNoun />}
    </div>
  );
};

export default Noun;