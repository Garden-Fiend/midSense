import DashBoard from "./pages/dashboard";
import "./App.css";
import { useState } from "react";
function App() {
  const [ping, showPing] = useState(null);

  async function pongReq() {
    const response = await fetch("http://localhost:8000/pong");
    const holder = await response.json();
    showPing(holder);

    setTimeout(() => {
      closePong();
    }, 1000);
  }

  function closePong() {
    showPing(null);
  }

  return (
    <>
      <DashBoard></DashBoard>

      <button onClick={() => pongReq()}>Ping</button>

      {ping && (
        <div>
          <h2>pong</h2>
        </div>
      )}
    </>
  );
}

export default App;
