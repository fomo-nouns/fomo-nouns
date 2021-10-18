// import classes from './Noun.module.css';
import React, { useEffect, useState } from 'react';
import loadingNoun from '../../assets/loading-skull-noun.gif';
import Image from 'react-bootstrap/Image';
import { utils } from 'ethers';
import { contract as SeederContract } from '../../wrappers/nounsSeeder';
import { contract as DesciptorContract } from '../../wrappers/nounsDescriptor';
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

  function subBlocks() {
    provider.on('block', (blockNumber) => {
      generateNoun(91);
    });
  }

  function subAuction() {
    console.log("looking for events..");
    const filter = {
      address: "0xF15a943787014461d94da08aD4040f79Cd7c124e",
      topics: [
        utils.id("AuctionCreated(uint256, uint256, uint256)"),
      ]
    };

    const filter2 = {
      address: "0xF15a943787014461d94da08aD4040f79Cd7c124e",
      topics: [
        utils.id("AuctionExtended(uint256, uint256)"),
      ]
    };

    provider.on(filter, (log, event) => {
      console.log(log);
      console.log(event)
    });

    provider.on(filter2, (log, event) => {
      console.log(log);
      console.log(event)
    });
  }

  useEffect(()=> {
    subAuction();
    subBlocks();
  }, []);

  const generateNoun = async (nounId: Number) => {
      const seed = await SeederContract.generateSeed(
        nounId,
        DesciptorContract.address,
        {
          blockTag: 'pending'
        }
      );
      const useGreyBg = seed[0] === 0;
      dispatch(setActiveBackground(useGreyBg));
      const svg = await DesciptorContract.generateSVGImage(seed);
      setImg(svg);
  }
  const { alt } = props;
  return (
    <div className={classes.imgWrapper}>
      {img && <Image className={classes.img} src={`data:image/svg+xml;base64,${img}`} alt={alt} fluid />}
      {!img && <LoadingNoun/>}
    </div>
    );
};

export default Noun;