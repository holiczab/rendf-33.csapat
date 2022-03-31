import React, { useState, useEffect, createContext } from 'react';

interface ILoggedInContext {
    isLoggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    username?: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
}
  

const defaultState = {
    isLoggedIn: false
};

const LoggedInContext = createContext<ILoggedInContext>(undefined!);

export default LoggedInContext;