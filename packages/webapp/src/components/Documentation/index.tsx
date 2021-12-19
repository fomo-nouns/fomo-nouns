// import Section from '../../layout/Section';
import { Col } from 'react-bootstrap';
import classes from './Documentation.module.css';
import Accordion from 'react-bootstrap/Accordion';
import Link from '../Link';

import config from '../../config';
import { buildEtherscanContractLink } from '../../utils/etherscan';


const Documentation = () => {
  const fomoDiscourseLink = (
    <Link text="Nouns DAO Discourse" url="https://discourse.nouns.wtf/t/fomo-nouns-force-mint-our-nouns/117" leavesPage={true} />
  );

  const proposalEightLink = (
    <Link text="Proposal #8" url="https://nouns.wtf/vote/8" leavesPage={true} />
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
            O'Clock, when the next Noun is chosen, users can watch potential Nouns appear
            with every block and vote for which one to mint. This happens <i>really</i> fast,
            so we hope you'll feel the FOMO.
          </p>
          <p>
            This project was approved as part of Nouns DAO {proposalEightLink} after discussion with
            the Nouns community on the {fomoDiscourseLink}.
          </p>
        </div>
        <Accordion flush>
          <Accordion.Item eventKey="0" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader} id="faq">Summary</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li>Every 24 hours a Nouns auction ends at Noun O'Clock</li>
                <li>The auction must be "settled" to start the next auction</li>
                <li>The block that "settlement" occurs in determines the next Noun</li>
                <li>FOMO Nouns lets you watch, block by block, the next possible Nouns</li>
                <li>Vote for Nouns you like, and if enough people agree, we'll try to mint it</li>
                <li>They change REALLY FAST, so get your votes in quickly</li>
                <li>A winning Noun can't always be minted if the chain moves too fast. Keep trying!</li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Voting</Accordion.Header>
            <Accordion.Body>
              <p>
                After a Nouns auction completes, the community must pick a block to settle the
                old auction, mint a new Noun, and start the next auction. Every Ethereum block
                has the potential to mint a different Noun. However, the auction must be settled
                in that <i>exact</i> block, or the Noun disappears forever. And these new blocks
                appear every ~13 seconds.
              </p>
              <p>
                We need to gather votes, execute the transaction, and get it mined in the next
                block <i>all</i> within 13 seconds. This means you only have ~6 seconds to cast
                your votes. If you miss a great Noun, you may not see it again for another
                40,393,080 blocks or approximately 17 years.
              </p>
              <p>
                A winning vote is when 60% of the connected users like (👍) a Noun. However, we
                want to mint only the best Nouns, so you can also dislike (👎) it to subtract one
                from the score. If 20% of users dislike a Noun, you need every single other
                user (all 80%) to like it in order to reach to 60% threshold.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Donations</Accordion.Header>
            <Accordion.Body>
              <p>
                Settling the auction requires Ethereum gas fees, which can be expensive. We built 
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
                architecture, and even deploy the application yourself from our {gitHubLink}.
              </p>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className={classes.accordionItem}>
            <Accordion.Header className={classes.accordionHeader}>Nouns Artwork</Accordion.Header>
            <Accordion.Body>
              <p>
                Nouns are generated randomly based on Ethereum block hashes. There are no 'if'
                statements or other rules governing noun trait scarcity, which makes all nouns
                equally rare. As of this writing, nouns are made up of:
              </p>
              <ul>
                <li>backgrounds (2)</li>
                <li>bodies (30)</li>
                <li>accessories (137)</li>
                <li>heads (234)</li>
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