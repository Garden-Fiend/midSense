import "./index.css";
import { act, useState } from "react";
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
              <table className="my-4">
                <thead className="border-2">
                  <th>
                    MAC Address
                  </th>
                  <th>
                    Ip Address
                  </th>
                  <th>
                    Uploads
                  </th>
                  <th>
                    Downloads
                  </th>
                </thead>
                <tbody>
                  {Object.entries(packet).map(([key, value]) => (
                    <tr key={key}>
                      <td className="p-2 border-2">{key}</td>
                      {Object.entries(value).map(([atkey, atval]) => (
                        <td className="p-2 border-2" key={atkey.toString()}>{atval}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
