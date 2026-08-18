import "./index.css";
import { useEffect, useState } from "react";
function App() {
  interface Packet {
    Downloads: String;
    Uploads: String;
    IpAddress: String;
  }

  interface deviceStats {
    [Mac: string]: Packet;
  }

  const [packet, setPackets] = useState<deviceStats>({});
  const [record, setRecords] = useState<deviceStats>({});

  async function getStat() {
    const request = await fetch("http://127.0.0.1:8000/getPackets");
    const response = await request.json();

    const length = Object.keys(response).length;
    console.log(length);
    console.log(response[length - 1]);
    setPackets(response[length - 1]);
  }

  async function getRecords() {
    const request = await fetch("http://127.0.0.1:8000/getRecords");
    const response = await request.json();

    setRecords(response);
  }

  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      return;
    }

    const interval = setInterval(getStat, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [listening]);

  return (
    <>
      <div className="bg-[#161618] text-white h-screen font-mono flex justify-center items-center">
        <div className="flex flex-col items-center gap-10 w-[90%] p-5">
          {listening && <img src="/src/assets/duck.gif" className="w-xs"></img>}
          <div className="text-center w-full p-2 space-y-1">
            <p className="text-3xl font-bold">"Midsense"</p>
            <p className="font-sans">
              Makeshift monitoring through packet capture
            </p>
          </div>

          <div className="flex space-x-4 px-2">
            <button
              onClick={() => getRecords()}
              className="border-2 rounded-lg p-2 hover:scale-105 bg-white text-black"
            >
              View Records
            </button>
            {listening == false ? (
              <div className="flex items-center justify-end gap-5">
                <button
                  onClick={() => setListening(true)}
                  className="border-2 rounded-lg p-2 hover:scale-105 bg-white text-black"
                >
                  Start Listening
                </button>

                <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-5 px-2">
                <button
                  onClick={() => setListening(false)}
                  className="border-2 rounded-lg p-2 hover:scale-105 bg-white text-black"
                >
                  Stop Listening
                </button>

                <div className="w-5 h-5 bg-green-700 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          {packet && listening == true && (
            <div>
              <table className="my-4">
                <thead className="border-2">
                  <th>MAC Address</th>
                  <th>Ip Address</th>
                  <th>Uploads</th>
                  <th>Downloads</th>
                </thead>
                <tbody>
                  {Object.entries(packet).map(([key, value]) => (
                    <tr key={key}>
                      <td className="p-2 border-2">{key}</td>
                      {Object.entries(value).map(([atkey, atval]) => (
                        <td className="p-2 border-2" key={atkey.toString()}>
                          {atval}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#161618] p-2 font-mono bg-">
        <div className="bg-white p-5 rounded-md m-5">
          <p>Historical Records</p>
        </div>
        {record && <div>{}</div>}
      </div>
    </>
  );
}

export default App;
