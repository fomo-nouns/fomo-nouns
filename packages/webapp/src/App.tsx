import { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { useAppDispatch, useAppSelector } from './hooks';
import { setActiveAccount } from './state/slices/account';
import classes from './App.module.css';
import NavBar from './components/NavBar';
import Noun  from './components/Noun';
import Title from './components/Title/Title';


function App() {
  
  const { account } = useEthers();
  const dispatch = useAppDispatch();
  const useGreyBg = useAppSelector(state => state.background.useGreyBg);
  useEffect(() => {
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  return (
    <div className={`${classes.App} ${useGreyBg ? classes.bgGrey : classes.bgBeige}`}>
      <Title content={"Noun, Noun Crystal Ball"}/>
      <Title content={"Who's the Nounish of them all?"}/>
      <Noun alt={"Crystal Ball Noun"}/>
    </div>
  );
}

export default App;
