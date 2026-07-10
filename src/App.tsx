import "./index.css";
import { useState } from "react";
function App() {
  interface Packet {
    Downloads: Number;
    Uploads: Number;
    IpAddress: String;
  }

  interface deviceStats {
    [Mac: string]: Packet;
  }

  const [packet, setPackets] = useState<deviceStats>({});

  async function getStat() {
    const request = await fetch("http://127.0.0.1:8000/getPackets");
    const response = await request.json();
    console.log(response[0]);
    setPackets(response[0]);
  }

  return (
    <>
      <div className="bg-black text-white h-screen font-mono flex justify-center items-center">
        <div>
          <button
            onClick={() => getStat()}
            className="border-2 rounded-lg p-1 hover:scale-105"
          >
            show stats
          </button>
        </div>
        {packet && (
          <div>
            <table className="border-2">
              <thead>
                <tr>
                  {Object.keys(packet).map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
