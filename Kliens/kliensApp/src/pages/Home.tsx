import React, { useContext, useState } from "react";
import LoggedInContext from "../utils/context";

function Home() {
  const { isLoggedIn, setLoggedIn } = useContext(LoggedInContext);

  return (
    <main style={{ paddingLeft: 280 }}>
      <h2>Kezdőoldal</h2>
    </main>
  );
}

export default Home;
