import React from "react";
import classes from './YoloWidget.module.css';
import { Spinner } from 'react-bootstrap';

import { useAppSelector } from '../../hooks';
import { useEffect, useState } from 'react';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts'
import { useContractFunction } from '@usedapp/core';

import yoloLogo from './assets/YOLOLogo.png';
import yoloNounsAuctionHouseABI from './assets/YOLONounsAuctionHouse.json';

import { default as config } from '../../config';
import { usePickByState } from "../../utils/colorResponsiveUIUtils";
import clsx from "clsx";

const yoloAddress: string = config.yoloAuctionProxyAddress;
const yoloAuctionHouseABI = new utils.Interface(yoloNounsAuctionHouseABI);
const yoloPrice = utils.parseEther('0.01');
const yoloUri = "https://yolonouns.wtf";
const gasLimit = 285000;

const iconLinkExternal = (
	<svg xmlns="http://www.w3.org/2000/svg" height='16' viewBox="0 0 20 20">
		<path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
		<path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
	</svg>
)

const YoloWidget: React.FC<{}> = (props) => {
	const activeAccount = useAppSelector(state => state.account.activeAccount);

	const [showPanel, setShowPanel] = useState(false)

	//create new Contract (workaround for type issues)
	const nounsAuctionHouseContract = new Contract(
		yoloAddress,
		yoloAuctionHouseABI
	);

	const defaultButtonText = <>YOLO!</>;
	const [mintButtonContent, setMintButtonContent] = useState({
		loading: false,
		content: defaultButtonText
	});

	const defaultResultText = <></>;
	const [resultTextContent, setResultTextContent] = useState({
		color: 'black',
		content: defaultResultText
	});

	const { send: mintNoun, state: mintNounState } = useContractFunction(
		nounsAuctionHouseContract,
		'mintNoun'
	);

	const mintNounHandler = async () => {
		if (!activeAccount) {
			return;
		}

		mintNoun({
			value: yoloPrice,
			gasLimit: gasLimit
		});
	};

	// mint noun transaction state hook
	useEffect(() => {
		switch (mintNounState.status) {
			case 'None':
				setMintButtonContent({ loading: false, content: defaultButtonText });
				setResultTextContent({ color: 'black', content: defaultResultText });

				break;
			case 'PendingSignature':
				setMintButtonContent({ loading: true, content: <></> });
				setResultTextContent({ color: 'black', content: defaultResultText });

				break;
			case 'Mining':
				setMintButtonContent({ loading: true, content: <></> });
				setResultTextContent({ color: 'black', content: defaultResultText });

				break;
			case 'Success':
				const logsLength = mintNounState.receipt!.logs.length; //to get the latest minted item
				const mintedTokenId = parseInt(mintNounState.receipt!.logs[logsLength - 1].topics[3]);

				setMintButtonContent({ loading: false, content: defaultButtonText });
				setResultTextContent({ color: 'black', content: <><a href={yoloUri} target="_blank" rel="noreferrer">You minted YOLO Noun {mintedTokenId}, check it out here {iconLinkExternal}</a></> });

				break;
			case 'Fail':
				setResultTextContent({ color: 'red', content: <>Transaction Failed: {mintNounState?.errorMessage}</> });
				setMintButtonContent({ loading: false, content: defaultButtonText });

				break;
			case 'Exception':
				setResultTextContent({ color: 'red', content: <>Error: {mintNounState?.errorMessage}</> });
				setMintButtonContent({ loading: false, content: defaultButtonText });

				break;
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mintNounState]);

	const disabled = !activeAccount || (mintNounState.status === 'PendingSignature') || (mintNounState.status === 'Mining');

	const togglePanel = () => {
		setShowPanel(!showPanel);
	}

	const style = usePickByState(classes.cool, classes.warm)

	return (
		<div>
			{showPanel && (
				<div className={clsx(classes.panel, style)}>
					<div className={classes.logo}>
						<img src={yoloLogo} alt='YOLO Nouns' height='36' />
					</div>
					<div className={classes.instructions}>
						Mint the current Noun and have it as part of the YOLO collection!
						<br />
						<span style={{ fontWeight: 'bold', color: resultTextContent.color }}>{resultTextContent.content}</span>
					</div>
					<div className={classes.priceWrapper}>
						<div className={classes.priceText}>
							Price
						</div>
						<div className={classes.amountText}>
							Ξ 0.01
						</div>
					</div>

					{ !activeAccount && (
						<span style={{ fontSize: 'small', fontStyle: 'italic' }}>Please connect your wallet to get started.</span>
					)}
					<button className={clsx(classes.mintButton, style)} onClick={mintNounHandler} disabled={disabled}>
						<span className={classes.voteText}>
							{mintButtonContent.loading ? <Spinner animation="border" style={{ height: '1rem', width: '1rem' }} /> : mintButtonContent.content}
						</span>
					</button>

					<div className={clsx(classes.footer, style)}>
						<a href={yoloUri} target="_blank" rel="noreferrer">
							<div>Learn more</div>
							{iconLinkExternal}
						</a>
						<div className={clsx(classes.closeButton, style)} onClick={togglePanel}>
							<div className={classes.closeButtonText}>Close</div>
							<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
							</svg>
						</div>
					</div>
				</div>
			)
			}

			{
				!showPanel && (
					<div className={clsx(classes.openButton, style)} onClick={togglePanel}>
						<div className={classes.openButtonText}>YOLO!</div>
						<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
						</svg>
					</div>
				)
			}
		</div >
	);
}

export default YoloWidget;