import "./index.css";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Legend,
  XAxis,
  YAxis,
} from "recharts";

function App() {
  const noPackets = [
    {
      IpAddress: "None",
      Uploads: 50,
      Downloads: 20,
      mac: "Device A",
    },
    {
      IpAddress: "None",
      Uploads: 34,
      Downloads: 100,
      mac: "Device B",
    },
    {
      IpAddress: "None",
      Uploads: 84,
      Downloads: 90,
      mac: "Device C",
    },
  ];

  interface Packet {
    Downloads: string;
    Uploads: string;
    IpAddress: string;
  }

  interface deviceStats {
    [Mac: string]: Packet;
  }

  interface routerStats {
    routerId: string;
    devices: deviceStats;
  }

  interface routers {
    [router: string]: routerStats;
  }

  type Device = {
    Ip: string;
    Upload: number;
    Download: number;
  };

  type Record = {
    [Id: number]: {
      [Mac: string]: Device;
    };
  };

  type chartFuckingData = {
    IpAddress: string;
    Uploads: number;
    Downloads: number;
    mac: string;
  };

  type Charting = {
    [Router: string]: chartFuckingData[];
  };

  const [packet, setPackets] = useState<routers>({});
  const [record, setRecords] = useState<Record>({});
  const [chartData, setChartData] = useState<Charting>({});

  async function getStat() {
    const request = await fetch("http://127.0.0.1:8000/getPackets");
    const response = await request.json();

    const length = Object.keys(response).length;
    console.log(length);
    console.log(response);
    setPackets(response);

    if (Object.entries(response).length > 0) {
      const chartDataHolder = Object.fromEntries(
        Object.entries(response).map(([Headers, Data]) => [
          [Headers],
          Object.entries(Data.devices).map(([datakey, dataVal]) => ({
            mac: datakey,
            ...dataVal,
          })),
        ]),
      );
      console.log(chartDataHolder);
      setChartData(chartDataHolder);
    }
  }

  async function getRecords() {
    const request = await fetch("http://127.0.0.1:8000/getRecords");
    const response = await request.json();

    setRecords(response);
  }

  function bytecon(bytes: number) {
    if (bytes < 1000) {
      return bytes;
    } else if (bytes < 1000000) {
      return `${(bytes / 1000).toFixed(2)} kb`;
    } else if (bytes < 1000000000) {
      return `${(bytes / 100000).toFixed(2)} mb`;
    } else if (bytes < 1000000000000) {
      return `${(bytes / 1000000000).toFixed(2)} gb`;
    }
  }

  const [listening, setListening] = useState(false);
  const [openRecord, setOpenRecord] = useState(false);

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
      <div className="bg-[#161618] text-white text-sm font-mono min-h-screen md:flex md:justify-center md:items-start">
        <div className="flex flex-col items-center gap-6 md:gap-10 w-full md:w-[50%] p-4 md:p-5 md:pt-20 md:mt-12 pt-5">
          {listening == true ? (
            <img src="/src/assets/duck.gif" className="w-40 sm:w-52 md:w-xs" />
          ) : (
            <img src="/src/assets/duck.jpg" className="w-40 sm:w-52 md:w-xs" />
          )}

          <div className="text-center w-full p-2 space-y-1">
            <p className="text-2xl sm:text-2xl font-bold">"Midsense"</p>

            <p className="font-sans text-xs sm:text-sm">
              Makeshift monitoring through packet capture
            </p>
          </div>

          <div className="flex  sm:flex-row flex-wrap justify-center gap-3 px-2 w-full">
            {openRecord === true ? (
              <button
                onClick={() => {
                  setOpenRecord(false);
                }}
                className="border-2 rounded-lg p-2 hover:scale-105 bg-white text-black"
              >
                Close Records
              </button>
            ) : (
              <button
                onClick={() => {
                  (setOpenRecord(true), getRecords());
                }}
                className="border-2 rounded-lg p-2 hover:scale-105 bg-white text-black"
              >
                View Records
              </button>
            )}

            {listening == false ? (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setListening(true)}
                  className="border-2 rounded-lg p-2 hover:scale-105 bg-white text-black"
                >
                  Start Listening
                </button>

                <div className="w-5 h-5 bg-gray-600 rounded-full shrink-0"></div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setListening(false)}
                  className="border-2 rounded-lg p-2 hover:scale-105 bg-white text-black"
                >
                  Stop Listening
                </button>

                <div className="w-5 h-5 bg-green-700 rounded-full animate-pulse shrink-0"></div>
              </div>
            )}
          </div>

          {Object.keys(packet).length > 0 && listening == true && (
            <div className="w-full overflow-x-auto">
              {Object.entries(packet).map(([header, data]) => (
                <div className="w-full" key={header}>
                  <p>{header}</p>
                  <table className="my-4 w-full min-w-125 md:scale-100">
                    <thead className="border-2">
                      <tr>
                        <th>MAC Address</th>
                        <th>Ip Address</th>
                        <th>Uploads</th>
                        <th>Downloads</th>
                      </tr>
                    </thead>

                    <tbody>
                      {Object.entries(data.devices).map(([key, value]) => (
                        <tr key={key}>
                          <td className="p-2 border-2 break-all">{key}</td>

                          {Object.entries(value).map(([atkey, atval]) =>
                            typeof atval == "number" ? (
                              <td
                                className="p-2 border-2 whitespace-nowrap"
                                key={atkey.toString()}
                              >
                                {bytecon(atval)}
                              </td>
                            ) : (
                              <td
                                className="p-2 border-2 whitespace-nowrap"
                                key={atkey.toString()}
                              >
                                {atval}
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>

        {Object.keys(chartData).length > 0 ?
          Object.entries(chartData).map(([router, data]) => (
            <div className="md:w-1/2 m-0 md:m-10 p-4 md:p-0 overflow-hidden" key={router}>
              <p>{router}</p>
              <div className="w-full overflow-x-auto mt-8">
                <BarChart
                  style={{
                    width: "100%",
                    maxHeight: "70vh",
                    aspectRatio: 1.618,
                  }}
                  responsive
                  data={data.length > 1 ? data : noPackets}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mac" />
                  <YAxis width="auto" />

                  <Legend />
                  <Bar
                    dataKey="Downloads"
                    radius={[10, 10, 0, 0]}
                    fill="#ff6600"
                  />
                  <Bar
                    dataKey="Uploads"
                    radius={[10, 10, 0, 0]}
                    fill="#ffffff"
                  />
                </BarChart>
              </div>

              <div className="w-full overflow-x-auto mt-8">
                <LineChart
                  style={{ width: "100%", aspectRatio: 1.618 }}
                  responsive
                  data={data.length > 1 ? data : noPackets}
                >
                  <CartesianGrid />
                  <Line
                    dataKey="Downloads"
                    stroke="#ff6600"
                    strokeWidth={"4"}
                  />
                  <Line dataKey="Uploads" stroke="#ffffff" strokeWidth={"4"} />
                  <XAxis dataKey="mac" />
                  <YAxis />
                  <Legend />
                </LineChart>
              </div>

              <div className="w-full overflow-x-auto mt-10">
                <BarChart
                  data={data.length > 1 ? data : noPackets}
                  layout="vertical"
                  style={{
                    width: "100%",
                    maxHeight: "70vh",
                    aspectRatio: 1.618,
                  }}
                  responsive
                  barCategoryGap={8}
                  margin={{
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <YAxis
                    type="category"
                    dataKey="mac"
                    width="auto"
                    tick={{ fontSize: 11 }}
                  />

                  <XAxis type="number" width="auto" tick={{ fontSize: 11 }} />

                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                  <Legend />

                  <Bar
                    name="Downloads"
                    dataKey="Downloads"
                    fill="#ff6600"
                    radius={[0, 5, 5, 0]}
                  />

                  <Bar
                    name="Uploads"
                    dataKey="Uploads"
                    fill="#ffffff"
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </div>
            </div>
          )) :  <div className="md:w-1/2 m-0 md:m-10 p-4 md:p-0 overflow-hidden">
            
              <div className="w-full overflow-x-auto mt-8">
                <BarChart
                  style={{
                    width: "100%",
                    maxHeight: "70vh",
                    aspectRatio: 1.618,
                  }}
                  responsive
                  data={noPackets}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mac" />
                  <YAxis width="auto" />

                  <Legend />
                  <Bar
                    dataKey="Downloads"
                    radius={[10, 10, 0, 0]}
                    fill="#ff6600"
                  />
                  <Bar
                    dataKey="Uploads"
                    radius={[10, 10, 0, 0]}
                    fill="#ffffff"
                  />
                </BarChart>
              </div>

              <div className="w-full overflow-x-auto mt-8">
                <LineChart
                  style={{ width: "100%", aspectRatio: 1.618 }}
                  responsive
                  data={noPackets}
                >
                  <CartesianGrid />
                  <Line
                    dataKey="Downloads"
                    stroke="#ff6600"
                    strokeWidth={"4"}
                  />
                  <Line dataKey="Uploads" stroke="#ffffff" strokeWidth={"4"} />
                  <XAxis dataKey="mac" />
                  <YAxis />
                  <Legend />
                </LineChart>
              </div>

              <div className="w-full overflow-x-auto mt-10">
                <BarChart
                  data={noPackets}
                  layout="vertical"
                  style={{
                    width: "100%",
                    maxHeight: "70vh",
                    aspectRatio: 1.618,
                  }}
                  responsive
                  barCategoryGap={8}
                  margin={{
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <YAxis
                    type="category"
                    dataKey="mac"
                    width="auto"
                    tick={{ fontSize: 11 }}
                  />

                  <XAxis type="number" width="auto" tick={{ fontSize: 11 }} />

                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                  <Legend />

                  <Bar
                    name="Downloads"
                    dataKey="Downloads"
                    fill="#ff6600"
                    radius={[0, 5, 5, 0]}
                  />

                  <Bar
                    name="Uploads"
                    dataKey="Uploads"
                    fill="#ffffff"
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </div>
            </div> }
      </div> 
      {record && openRecord == true && (
        <div className="bg-[#161618] p-2 font-mono">
          <div className="bg-white p-4 sm:p-5 rounded-md m-2 sm:m-5">
            <p className="text-sm sm:text-base">Historical Records</p>
          </div>

          <div className="p-2 sm:p-5 bg-white rounded-lg m-2 sm:m-5 flex justify-center overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="border-2">
                <tr>
                  <th>MAC Address</th>
                  <th>Ip Address</th>
                  <th>Uploads</th>
                  <th>Downloads</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(record).map(([recordKey, recordVal]) =>
                  Object.entries(recordVal).map(([rkeys, rvals]) => (
                    <tr key={`${recordKey}-${rkeys}`}>
                      <td className="p-3 sm:p-5 border-2 break-all">{rkeys}</td>

                      {Object.entries(rvals).map(([rvalKey, rvalVal]) =>
                        typeof rvalVal == "number" ? (
                          <td
                            className="p-3 sm:p-5 border-2 whitespace-nowrap"
                            key={rvalKey}
                          >
                            {bytecon(rvalVal)}
                          </td>
                        ) : (
                          <td
                            className="p-3 sm:p-5 border-2 whitespace-nowrap"
                            key={rvalKey}
                          >
                            {rvalVal.toString()}
                          </td>
                        ),
                      )}
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

{
  /**    <div className="bg-white p-5 m-5 rounded-lg">
          {Object.entries(record).map(([key, value]) => (
            <div key={key.toString()}>
              {Object.entries(value).map(([valKey, valVal]) => (
                <div key={valKey.toString()}>
                  {Object.entries(valVal).map(([netKey, netVal]) => (
                    <div>
                      <div className="flex">
                        <p>{valKey}</p>
                        <p>{netKey}</p>
                        <p>{netVal}</p>
                      </div>

                      <div>------</div>
                    </div>
                  ))} 
                </div>
              ))}
            </div>
          ))}
        </div> */
}
