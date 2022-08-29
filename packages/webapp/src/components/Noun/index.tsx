import React, { useEffect, useMemo } from 'react';
import loadingNoun from '../../assets/loading-skull-noun.gif';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setActiveBackground } from '../../state/slices/noun';
import classes from '../Noun/Noun.module.css';
import { ImageData, getNounSeedFromBlockHash, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
import NounPlatform, { PlatformType } from '../NounPlatform';

const { palette } = ImageData;

function getNounImage(nounId: number, blockhash: string) {
  const seed = getNounSeedFromBlockHash(nounId, blockhash);
  const { parts } = getNounData(seed);

  const svgBinary = buildSVG(parts, palette, 'ffffff00');
  return { src: `data:image/svg+xml;base64,${btoa(svgBinary)}`, seed };
}

const Noun: React.FC = props => {
  const dispatch = useAppDispatch();

  const blockhash = useAppSelector(state => state.block.blockHash);
  let nextNounId = useAppSelector(state => state.noun.nextNounId)!;
  const displaySingleNoun = useAppSelector(state => state.noun.displaySingleNoun)!;
  const ethereumConnected = useAppSelector(state => state.block.connected);

  if (nextNounId % 10 === 0 && displaySingleNoun) {
    nextNounId += 1;
  }
  const nounImageData = useMemo(() => {
    const data = []

    // Return the Loading Noun
    if (!blockhash || !nextNounId || !ethereumConnected) {
      data.push({ seed: { background: 0 }, src: loadingNoun, alt: 'Loading Noun', nounId: '' });
      return data
    }

    // Push the first Noun
    const { src, seed } = getNounImage(nextNounId, blockhash)
    data.push({ seed, src, alt: `Noun ${nextNounId}` })

    // Every 10th Noun, push another Noun
    if (nextNounId % 10 === 0) {
      const { src, seed } = getNounImage(nextNounId + 1, blockhash)
      data.push({ seed, src, alt: `Noun ${nextNounId + 1}` })
    }

    return data

  }, [nextNounId, blockhash, ethereumConnected]);

  useEffect(() => {
    // Change app background to match the nouner noun
    if (nounImageData.length === 1) {
      dispatch(setActiveBackground(nounImageData[0].seed.background === 0));
    } else {
      dispatch(setActiveBackground(nounImageData[1].seed.background === 0));
    }
  }, [dispatch, nounImageData])


  const Imgs = nounImageData.map(({ seed, src, alt }, i) => {
    let imgWrapper = [classes.imgWrapper]
    let nounderLightStyle = {}

    if (nounImageData.length > 1) imgWrapper.push(classes[`noun-${i + 1}`])
    if (!displaySingleNoun) imgWrapper.push(classes.twoNouns)

    if ((nextNounId + i) % 10 === 0 && seed.background !== nounImageData[1].seed.background) {
      imgWrapper.push(classes.differentBackgrounds)

      if (seed.background === 0) {
        nounderLightStyle = {
          background: 'linear-gradient(0deg, var(--brand-cool-background) 86%, #00000000 100%)'
        }
      } else {
        nounderLightStyle = {
          background: 'linear-gradient(0deg, var(--brand-warm-background) 86%, #00000000 100%)'
        }
      }
    }

    const platform = !displaySingleNoun && (nextNounId + i) % 10 === 0
      ? <NounPlatform type={PlatformType.nounder} background={seed.background} />
      : <NounPlatform type={PlatformType.nouner} background={seed.background} />

    return (
      <div className={`${imgWrapper.join(' ')}`}>
        <img
          className={classes.img}
          src={src}
          alt={alt}
        />
        <div className={classes.platform}>
          {platform}
        </div>
        <div className={classes.nounderLight} style={nounderLightStyle} />
      </div>
    )
  })

  let wrapperClass = classes.nounWrapper
  if (nounImageData.length > 1) {
    wrapperClass = classes.nounsWrapper
  }

  return (
    <div className={wrapperClass}>
      {Imgs}
    </div>
  );
};

export default Noun;