// import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';

import config from '../../config';
import { buildEtherscanContractLink } from '../../utils/etherscan';


const Documentation = () => {
  const fomoDiscourseLink = (
    <Link text="Discourse Discussion" url="https://discourse.nouns.wtf/t/fomo-nouns-force-mint-our-nouns/117" leavesPage={true} />
  );

  const proposalEightLink = (
    <Link text="On-chain Proposal" url="https://nouns.wtf/vote/8" leavesPage={true} />
  );

  const gitHubLink = (
    <Link text="FOMO Nouns GitHub" url="https://github.com/fomo-nouns/fomo-nouns" leavesPage={true} />
  );

  const settlementEtherscanLink = buildEtherscanContractLink(config.fomoSettlerAddress);
  const smartContractLink = (
    <Link text="FOMO Settlement Contract" url={settlementEtherscanLink} leavesPage={true} />
  );

  const nounsDaoLink = (
    <Link text="Nouns DAO" url="https://nouns.wtf" leavesPage={true} />
  );


  return (
    <div className={classes.Documentation}>
      <Col lg={{ span: 7, offset: 0 }}>
        <div className={classes.headerWrapper} id="wtf">
          <h1>WTF?</h1>
          <p>
            FOMO Nouns is a social project for the {nounsDaoLink} community. Every Noun
            O'Clock, when a new Noun is chosen, users can watch new possible Nouns appear with
            every block and vote for which one they want to see minted. This has to happen
            <i>really</i> fast, so we hope you'll feel the FOMO.
          </p>
          <p>
            The project was sponsored as part of {proposalEightLink} after discussing with the
            Nouns community at the {fomoDiscourseLink}.
          </p>
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader} id="faq">Summary</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>Every 24h a Nouns auction ends at Noun O'Clock</li>
                <li>The auction must be "settled" to start the next auction</li>
                <li>The next Noun is determined by the block that "settlement" occurs</li>
                <li>FOMO Nouns let you watch, block-by-block, the possible Nouns we could mint</li>
                <li>Vote on whether you like each Noun, and if we reach quorum, we'll try to mint it</li>
                <li>Nouns change quick, so you have to get your votes in REALLY FAST!</li>
                <li>Occasionally, the chain moves so fast we'll miss a winning Noun. Keep trying!</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Voting</Accordion.Header>
            <Accordion.Body>
              <p>
                The next Noun's appearance is determined by the latest Ethereum block's
                'blockhash', a unique signature for the block. These blocks are mined every ~13
                seconds, and once a new block appears, the old Noun is gone forever.
              </p>
              <p>
                Minting a great Noun means we need to get votes, execute the transaction, and get
                it into the next mined block all within 13 seconds! As a result, we only give you
                ~6 seconds to cast your votes, so you need to FOMO <i>quick</i>.
              </p>
              <p>
                A winning vote is when 60% of the connected users like a particular Noun. Each 👍
                counts as +1, and each 🤷‍♂️ counts as +0. However, we only want to mint the best Nouns,
                so you can also cast a 👎 which <i>reduces</i> the score by -1.
              </p>
              <p>
                This means if 20% of users don't like a Noun, you need all of the remaining 80% of
                users to like the Noun in order for it to win!
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Donations</Accordion.Header>
            <Accordion.Body>
              <p>
                Settling the auction requires Ethereum gas fees, which can be expensive! We built 
                a {smartContractLink} to trustlessly hold donations from the community to help with
                these settlement expenses. These funds can <i>only</i> be used for settling a Nouns
                auction, and only {nounsDaoLink} has access to pull funds from the contract.
              </p>
              <p>
                If you see the ETH in the contract is low, please considering donating if you are
                enjoying the FOMO Nouns experience!
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Code</Accordion.Header>
            <Accordion.Body>
              <p>
                FOMO Nouns was built entirely in public, and you can find all of the code,
                architecture, and even fork the application yourself from our {gitHubLink}.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Nouns Artwork</Accordion.Header>
            <Accordion.Body>
              <p>
                Nouns are generated randomly based Ethereum block hashes. There are no 'if'
                statements or other rules governing noun trait scarcity, which makes all nouns
                equally rare. As of this writing, nouns are made up of:
              </p>
              <ul>
                <li>backgrounds (2) </li>
                <li>bodies (30)</li>
                <li>accessories (137) </li>
                <li>heads (234) </li>
                <li>glasses (21)</li>
              </ul>
              <p>
                Nouns are stored directly on Ethereum and do not utilize pointers to other networks
                such as IPFS. This is possible because noun parts are compressed and stored on-chain
                using a custom run-length encoding (RLE), which is a form of lossless compression.
              </p>
              <p>
                The compressed parts are efficiently converted into a single base64 encoded SVG
                image on-chain. To accomplish this, each part is decoded into an intermediate format
                before being converted into a series of SVG rects using batched, on-chain string
                concatenation. Once the entire SVG has been generated, it is base64 encoded.
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </div>
  );
};

export default Documentation;