import React, { useEffect, useRef, useState } from "react";
import classes from './AuctionTimer.module.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAppSelector } from "../../hooks";
import star from '../../assets/star.png';

dayjs.extend(duration);

const AuctionTimer: React.FC<{}> = props => {
    const activeAuction = useAppSelector(state => state.auction.activeAuction);
    const closeToAuctionEnd = useAppSelector(state => state.auction.closeToEnd);
    const auctionEnd = useAppSelector(state => state.auction.auctionEnd);
    const [auctionTimer, setAuctionTimer] = useState<number>(0);
    const auctionTimerRef = useRef(auctionEnd);
    auctionTimerRef.current = auctionTimer;
    useEffect(() => {
        const timeLeft = auctionEnd - dayjs().unix();
        setAuctionTimer(timeLeft);
        if (timeLeft <= 0) {
            setAuctionTimer(0);
        } else {
            const timer = setTimeout(() => {
                setAuctionTimer(auctionTimerRef.current - 1);
            }, 1000);
            return () => {
                clearTimeout(timer);
            }
        }
    }, [auctionEnd, auctionTimer]);
    const timerDuration = dayjs.duration(auctionTimerRef.current, 's');
    const hours = Math.floor(timerDuration.hours());
    const minutes = Math.floor(timerDuration.minutes());
    const seconds = Math.floor(timerDuration.seconds());

    const levelImages: Array<React.ReactNode> = [];

    if (closeToAuctionEnd) {
        for (let i = 5; i > minutes; i--) {
            levelImages.push(<img key={i} className={classes.levelImage} src={star} alt="Readiness Level Marker" />)
        }
    }

    const activeAuctionTimer = () => {
        return (
            <>
                <div className={classes.level}>
                    {levelImages}
                </div>
                <div>
                    {hours > 0 && <>{hours}h </>}
                    {minutes > 0 && <>{minutes}m </>}
                    {seconds > 0 && <>{seconds}s </>}
                </div>
                <div className={classes.level}>
                    {levelImages}
                </div>
            </>
        )
    }

    return (
        <div className={classes.wrapper}>
            {activeAuction && activeAuctionTimer()}
        </div>
    )
};

export default AuctionTimer;