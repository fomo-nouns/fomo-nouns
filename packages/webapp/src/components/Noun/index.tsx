// import classes from './Noun.module.css';
import React, { useEffect, useState } from 'react';
import loadingNoun from '../../assets/loading-skull-noun.gif';
import Image from 'react-bootstrap/Image';
import { utils } from 'ethers';
import { contract as SeederContract } from '../../wrappers/nounsSeeder';
import { contract as DesciptorContract } from '../../wrappers/nounsDescriptor';
import { contract as AuctionContract } from '../../wrappers/nounsAuction';
import { provider } from '../../config';
import { useAppDispatch } from '../../hooks';
import { setActiveBackground } from '../../state/slices/background';
import classes from './Noun.module.css';

const LoadingNoun = () => {
  return <Image src={loadingNoun} alt={'loading noun'} fluid />;
};

const Noun: React.FC<{ alt: string }> = props => {
  const dispatch = useAppDispatch();
  const [img, setImg] = useState('');

  const [lockBlock, setLockBlock] = useState(-1);
  const [lockImg, setLockImg] = useState(false);

  async function getNextNounId() {
    const res =  await AuctionContract.auction();
    const nounNumber = utils.bigNumberify(res.nounId).toNumber();
    return nounNumber + 1;
    
  }

  function subBlocks() {
    provider.on('block', (blockNumber) => {
      if(blockNumber > lockBlock) {
        setLockBlock(blockNumber)
        generateNoun();
      }
    });
  }

  useEffect(() => {
    subBlocks();
  },);

  const generateNoun = async () => {

    if(lockImg) {
      return;
    }
    setLockImg(true);
    const nounId = await getNextNounId();
    const isNounder = nounId % 10 === 0;
    const nextNounId = isNounder ? nounId + 1 : nounId;
    
    const seed = await SeederContract.generateSeed(
      nextNounId,
      DesciptorContract.address,
      {
        blockTag: 'pending'
      }
    );
    const useGreyBg = seed[0] === 0;
    dispatch(setActiveBackground(useGreyBg));
    const svg = await DesciptorContract.generateSVGImage(seed);
    setImg(svg);
    setLockImg(false);
  }
  const { alt } = props;
  return (
    <div className={classes.imgWrapper}>
      {img && <Image className={classes.img} src={`data:image/svg+xml;base64,${img}`} alt={alt} fluid />}
      {!img && <LoadingNoun />}
    </div>
  );
};

export default Noun;