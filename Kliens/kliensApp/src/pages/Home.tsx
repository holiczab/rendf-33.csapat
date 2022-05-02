import React, { useContext, useState } from "react";
import LoggedInContext from "../utils/context";

function Home() {
  const { isLoggedIn, setLoggedIn } = useContext(LoggedInContext);

  return (
    <main style={{ paddingLeft: 280 }}>
      <h2>Home Page</h2>
      <h3>Rendszerfejlesztés 33.csapat kliens alkalmazása</h3>
    </main>
  );
}

export default Home;
