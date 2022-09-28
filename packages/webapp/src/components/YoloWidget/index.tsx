import React from "react";
import classes from './YoloWidget.module.css';
import classesApp from '../../App.module.css';
import { Row, Col, Spinner } from 'react-bootstrap';

import { useAppSelector } from '../../hooks';
import { useEffect, useState } from 'react';
import { utils } from 'ethers';
import { Contract } from '@ethersproject/contracts'
import { useContractFunction } from '@usedapp/core';

import yoloLogo from './assets/YOLOLogo.png';
import yoloNounsAuctionHouseABI from './assets/YOLONounsAuctionHouse.json';

import { default as config } from '../../config';

const yoloAddress: string = config.yoloAuctionProxyAddress;
const yoloAuctionHouseABI = new utils.Interface(yoloNounsAuctionHouseABI);
const yoloPrice = utils.parseEther('0.01');
const yoloUri = "https://yolonouns.wtf";
const gasLimit = 285000;

const iconLinkExternal =
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M8.90802 2.66666C8.71241 2.66666 8.52481 2.74436 8.38649 2.88268C8.24817 3.021 8.17047 3.2086 8.17047 3.40421C8.17047 3.59982 8.24817 3.78742 8.38649 3.92574C8.52481 4.06406 8.71241 4.14177 8.90802 4.14177H10.8153L6.99442 7.96269C6.92397 8.03073 6.86778 8.11211 6.82913 8.2021C6.79048 8.29208 6.77013 8.38886 6.76928 8.48679C6.76843 8.58473 6.78709 8.68185 6.82417 8.77249C6.86126 8.86313 6.91602 8.94548 6.98528 9.01473C7.05453 9.08398 7.13688 9.13875 7.22752 9.17583C7.31816 9.21292 7.41528 9.23158 7.51322 9.23073C7.61115 9.22988 7.70793 9.20953 7.79791 9.17088C7.8879 9.13222 7.96928 9.07603 8.03732 9.00559L11.8582 5.18467V7.09199C11.8582 7.2876 11.936 7.4752 12.0743 7.61352C12.2126 7.75184 12.4002 7.82954 12.5958 7.82954C12.7914 7.82954 12.979 7.75184 13.1173 7.61352C13.2556 7.4752 13.3334 7.2876 13.3334 7.09199V3.40421C13.3334 3.2086 13.2556 3.021 13.1173 2.88268C12.979 2.74436 12.7914 2.66666 12.5958 2.66666H8.90802Z" fill="#5f5f5f"/>
		<path d="M4.17096 4.30768C3.772 4.30768 3.38938 4.46617 3.10728 4.74827C2.82517 5.03038 2.66669 5.413 2.66669 5.81196V11.829C2.66669 12.228 2.82517 12.6106 3.10728 12.8927C3.38938 13.1748 3.772 13.3333 4.17096 13.3333H10.1881C10.587 13.3333 10.9696 13.1748 11.2517 12.8927C11.5338 12.6106 11.6923 12.228 11.6923 11.829V9.57264C11.6923 9.37316 11.6131 9.18185 11.472 9.0408C11.331 8.89974 11.1397 8.8205 10.9402 8.8205C10.7407 8.8205 10.5494 8.89974 10.4083 9.0408C10.2673 9.18185 10.1881 9.37316 10.1881 9.57264V11.829H4.17096V5.81196H6.42737C6.62685 5.81196 6.81816 5.73271 6.95921 5.59166C7.10026 5.45061 7.17951 5.2593 7.17951 5.05982C7.17951 4.86034 7.10026 4.66903 6.95921 4.52798C6.81816 4.38692 6.62685 4.30768 6.42737 4.30768H4.17096Z" fill="#5f5f5f"/>
	</svg>

const YoloWidget: React.FC<{}> = (props) => {

  const isCoolBackground = useAppSelector(state => state.noun.isCoolBackground);
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

  return(
	<div>
		{ showPanel && (
		 	<div className={`${classes.panel} ${isCoolBackground ? classesApp.bgGrey : classesApp.bgBeige}`}>
		        <Row >
		          <Col lg={12} className={classes.logo}>
					<img src={yoloLogo} alt='YOLO Nouns' width="115" className={classes.logoImage}
		          	/>
		          </Col>
		        </Row>
		        <Row >
		          <Col lg={12} className={classes.instructions}>
					Mint the current FOMO Noun!
					<br />
					<span style={{fontWeight: 'bold', color: resultTextContent.color }}>{resultTextContent.content}</span>
		          </Col>
		        </Row>
		        <Row >
		          <Col lg={12}>
				    <Row>
				      <Col xs={6} lg={6} className={classes.price}>
				        <span className={classes.priceText}>
				          Price
				        </span>
				      </Col>
				      <Col xs={6} lg={6} className={classes.amount}>
				        <span className={classes.amountText}>
				          Ξ 0.01
				        </span>
				      </Col>
				    </Row>                                   
		          </Col>
		        </Row>
		
				<button className={classes.mintButton} onClick={mintNounHandler} disabled={disabled}>
			        <span className={classes.voteText}> 
			        	{mintButtonContent.loading ? <Spinner animation="border" style={{height: '1rem', width: '1rem'}} /> : mintButtonContent.content}
			        </span>
		      	</button>
		
		        <Row >
		          <Col lg={12} className={classes.footer}>
					<a href={yoloUri} target="_blank" rel="noreferrer">
			      		Learn more {iconLinkExternal}	
		            </a>	      
		          </Col>
		        </Row>
		      	    
				<div className={classes.closeButton} onClick={togglePanel}>
			        <div className={classes.closeButtonText}>close</div>
			        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 20 20">
			           <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" clipRule="evenodd" />
			        </svg>
		        </div>	    
			</div>  	
        ) }	        
        
		{ !showPanel && (
    		<div className={classes.openButton} onClick={togglePanel}>
		        <div className={classes.openButtonText}>YOLO!</div>
		        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 20 20">
		           <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
		        </svg>
	        </div>
        ) }	        
	</div>
  );
}

export default YoloWidget;