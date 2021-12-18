import classes from './Banner.module.css';
import { Col } from 'react-bootstrap';
import lightningNoun from './lightningNoun.png';


const Banner = () => {
  return (
    <div className={classes.BannerSection}>
        <div className={classes.textWrapper}>
          <h1>
            CAST YOUR VOTE,
            <br />
            PICK THE NOUN,
            <br />
            RELIEVE FOMO.
          </h1>
        </div>
        <div className={classes.imgWrapper}>
          <img src={lightningNoun} alt="Lightning Noun" className={classes.img} />
        </div>
    </div>
  );
};

export default Banner;
