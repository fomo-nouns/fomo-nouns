import React, { useEffect, useRef, useState } from "react";
import classes from './AuctionTimer.module.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useAppSelector } from "../../hooks";

dayjs.extend(duration);

const AuctionTimer: React.FC<{}> = props => {
    const activeAuction = useAppSelector(state => state.auction.activeAuction);
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

    let widthStyle = '';
    if (hours) {
        widthStyle = classes.hoursWidth;
    } else if (minutes) {
        widthStyle = classes.minutesWidth;
    } else {
        widthStyle = classes.secondsWidth;
    }

    const activeAuctionTimer = () => {
        return (
            <div className={widthStyle}>
                {hours}h {minutes}m {seconds}s
            </div>
        );
    }
    return (
        <div className={classes.Wrapper}>
            {activeAuction && activeAuctionTimer()}
        </div>
    )
};

export default AuctionTimer;