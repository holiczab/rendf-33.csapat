import React, { useState, useEffect, createContext } from 'react';

interface ILoggedInContext {
    isLoggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    position: string;
    setPosition: React.Dispatch<React.SetStateAction<string>>;
}
  
const defaultState = {
    isLoggedIn: false,
    username: "",
    position: "",
    setLoggedIn() { },
    setUsername() { },
    setPosition() { }
};

const LoggedInContext = createContext<ILoggedInContext>(defaultState);

export default LoggedInContext;