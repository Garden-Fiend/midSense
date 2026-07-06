import DashBoard from "./pages/dashboard";
import "./App.css";

function App() {

  async function pongReq(){

    const response = await fetch("http://localhost:8000/pong")
    const holder = await response.json();

    console.log(holder)

    console.log("write the endpoint dumbass");
  }

  return (
    <>
      <DashBoard></DashBoard>
      
      <button onClick={()=> pongReq()}>Ping</button>

    </>
  );
}

export default App;
