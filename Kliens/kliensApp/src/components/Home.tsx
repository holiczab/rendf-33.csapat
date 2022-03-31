import React, { useContext, useState } from "react";
import LoggedInContext from "../contexts/context";

function Home() {

  const { isLoggedIn, setLoggedIn } = useContext(LoggedInContext);

  return (
    <main style={{ paddingLeft: 280 }}>
      <h2>Kezdőoldal</h2>
      <p>belepve: { String(isLoggedIn) }</p>
    </main>
  );
}

export default Home;
