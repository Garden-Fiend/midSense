import "./index.css";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

function App() {
  type device_stats = {
    timestamp: string;
    id: string;
    ip: string;
    downloads: number;
    uploads: number;
    mac: string;
    router: number;
  };

  type router_stats = {
    [router: number]: device_stats[];
  };

  const [fetchedRecord, setFetchRecord] = useState<router_stats>({});

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

  function cumulate(data: any) {
    const cumulatedData = data.reduce(
      (fetchedRouter: any, fetchedDevice: any) => {
        const router_id = fetchedDevice.router;

        if (!fetchedRouter[router_id]) {
          fetchedRouter[router_id] = [];
        }

        const device = fetchedRouter[router_id].find(
          (device: any) => device.device_id === fetchedDevice.device_id,
        );

        if (device) {
          device.uploads += fetchedDevice.uploads;
          device.downloads += fetchedDevice.downloads;
        } else {
          fetchedRouter[router_id].push(fetchedDevice);
        }

        return fetchedRouter;
      },
      {},
    );

    return cumulatedData;
  }

  async function getDBRecords() {
    const request = await fetch("http://127.0.0.1:8000/fetchRecords");
    const response = await request.json();

    if (response) {
      const formatted = cumulate(response);
      setFetchRecord(formatted);
      console.log(formatted);
    }
  }

  const [listening, setListening] = useState(false);
  const [openRecord, setOpenRecord] = useState(false);
  const [filter, setFilter] = useState("InsertGateway");

  useEffect(() => {
    if (!listening) {
      return;
    }

    const interval = setInterval(getDBRecords, 50000);

    return () => {
      clearInterval(interval);
    };
  }, [listening]);

  return (
    <>
      <div className="bg-[#161618] text-[#FFF6E9] text-sm font-mono min-h-screen  md:justify-center md:items-start">
        <div className="flex items-start justify-center gap-20 p-10">
          <div className="w-1/4">
            <div className="flex flex-col items-center gap-6 md:gap-10 w-full">
              {listening == true ? (
                <img
                  src="/src/assets/duck.gif"
                  className="w-40 sm:w-52 md:w-xs"
                />
              ) : (
                <img
                  src="/src/assets/duck.jpg"
                  className="w-40 sm:w-52 md:w-xs"
                />
              )}

              <div className="text-center w-full p-2 space-y-1">
                <p className="text-2xl sm:text-2xl font-bold">"Midsense"</p>

                <p className="font-sans text-xs sm:text-sm">
                  Makeshift monitoring through packet capture
                </p>
              </div>

              <div className="flex sm:flex-row flex-wrap justify-center gap-2 px-2 w-full">
                {openRecord === true ? (
                  <button
                    onClick={() => {
                      setOpenRecord(false);
                    }}
                    className="border-2 rounded-lg p-2 hover:scale-105 bg-[#FFF6E9] text-[#0A171D]"
                  >
                    Close Records
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      getDBRecords();
                    }}
                    className="border-2 rounded-lg p-2 hover:scale-105 bg-[#FFF6E9] text-[#0A171D]"
                  >
                    View Records
                  </button>
                )}

                {listening == false ? (
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setListening(true)}
                      className="border-2 rounded-lg p-2 hover:scale-105 bg-[#FFF6E9] text-[#0A171D]"
                    >
                      Start Listening
                    </button>

                    <div className="w-5 h-5 bg-gray-600 rounded-full shrink-0"></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setListening(false)}
                      className="border-2 rounded-lg p-2 hover:scale-105 bg-[#FFF6E9] text-[#0A171D]"
                    >
                      Stop Listening
                    </button>

                    <div className="w-5 h-5 bg-green-700 rounded-full animate-pulse shrink-0"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-3/4 pt-5">
            <div className="flex gap-5 w-full">
              <div className="flex items-center gap-2">
                <label className="border-2 p-2 rounded-xl">Gateway</label>

                <select
                  className="border-b-2 p-2"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {Object.keys(fetchedRecord).map((gateway) => (
                    <option value={gateway} key={gateway}>
                      {gateway}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Find a Gateway"
                value={filter}
                className="w-full border-2 p-3 rounded-xl"
                onChange={(e) => setFilter(e.target.value)}
              ></input>

              <button className="p-3 bg-[#FFF6E9] text-[#0A171D] rounded-xl">
                Search
              </button>
            </div>
            {Object.entries(fetchedRecord).length > 0 ? (
              <div>
                {Object.entries(fetchedRecord)
                  .filter(([router]) => router == filter)
                  .map(([router, devices]) => (
                    <div className="border-2 mt-2" key={router}>
                      <p className="place-self-center p-4 bg-[#003f47] w-full text-center">
                        {router}
                      </p>

                      <table className="w-full">
                        <thead>
                          <tr>
                            <td className="border-2 p-2">Mac</td>
                            <td className="border-2 p-2">Ip Address</td>
                            <td className="border-2 p-2">Uploads</td>
                            <td className="border-2 p-2">Downloads</td>
                          </tr>
                        </thead>

                        <tbody>
                          {Object.entries(devices).map(
                            ([devices, deviceStats]) => (
                              <tr key={devices}>
                                <td className="border-2 p-2">
                                  {deviceStats.mac}{" "}
                                </td>
                                <td className="border-2 p-2">
                                  {deviceStats.ip}{" "}
                                </td>
                                <td className="border-2 p-2">
                                  {bytecon(deviceStats.uploads)}{" "}
                                </td>
                                <td className="border-2 p-2">
                                  {bytecon(deviceStats.downloads)}{" "}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-40 mt-10 flex justify-center rounded-xl border-3 border-[#FFF6E9]">
                <p>No Gateway Selected Yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#FFF6E9] h-auto">
          {Object.keys(fetchedRecord).length > 0 &&
            Object.entries(fetchedRecord)
              .filter(([router]) => router === filter)
              .map(([router, data]) => (
                <div
                  className="md:w-1/2 m-0 md:m-10 p-4 md:p-0 overflow-hidden"
                  key={router}
                >
                  <p>{router}</p>
                  <div className="w-full overflow-x-auto mt-8">
                    <BarChart
                      style={{
                        width: "100%",
                        maxHeight: "70vh",
                        aspectRatio: 1.618,
                      }}
                      responsive
                      data={data}
                      margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#000",
                        }}
                      />
                      <XAxis dataKey="mac" />
                      <YAxis width="auto" />

                      <Legend />
                      <Bar
                        dataKey="downloads"
                        radius={[10, 10, 0, 0]}
                        fill="#FFBD76"
                      />
                      <Bar
                        dataKey="uploads"
                        radius={[10, 10, 0, 0]}
                        fill="#003F47"
                      />
                    </BarChart>
                  </div>

                  <div className="w-full overflow-x-auto mt-10">
                    <BarChart
                      data={data}
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

                      <XAxis
                        type="number"
                        width="auto"
                        tick={{ fontSize: 11 }}
                      />

                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                      <Legend />

                      <Bar
                        name="Downloads"
                        dataKey="downloads"
                        fill="#FFBD76"
                        radius={[0, 5, 5, 0]}
                      />

                      <Bar
                        name="Uploads"
                        dataKey="uploads"
                        fill="#003F47"
                        radius={[0, 5, 5, 0]}
                      />
                    </BarChart>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}

export default App;

{
  /**    <div className="bg-[#FFF6E9] p-5 m-5 rounded-lg">
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
                                className="p-2 border-2 [#FFF6E9]space-nowrap"
                                key={atkey.toString()}
                              >
                                {bytecon(atval)}
                              </td>
                            ) : (
                              <td
                                className="p-2 border-2 [#FFF6E9]space-nowrap"
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
            
          
          <button
          className="p-4 bg-green-800 text-[#FFF6E9] rounded-xl hover:scale-105"
          onClick={() => getDBRecords()}
        >
          DEBUGGING SUPABASE QUERY
        </button>
          
          

         {record && openRecord == true && (
        <div className="bg-[#161618] p-2 font-mono">
          <div className="bg-[#FFF6E9] p-4 sm:p-5 rounded-md m-2 sm:m-5">
            <p className="text-sm sm:text-base">Historical Records</p>
          </div>

          <div className="p-2 sm:p-5 bg-[#FFF6E9] rounded-lg m-2 sm:m-5 flex justify-center overflow-x-auto">
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
                            className="p-3 sm:p-5 border-2 [#FFF6E9]space-nowrap"
                            key={rvalKey}
                          >
                            {bytecon(rvalVal)}
                          </td>
                        ) : (
                          <td
                            className="p-3 sm:p-5 border-2 [#FFF6E9]space-nowrap"
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

      <button
        className="p-4 bg-green-800 text-[#FFF6E9] rounded-xl hover:scale-105"
        onClick={() => getDBRecords()}
      >
        DEBUGGING SUPABASE QUERY
      </button>
          



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
    const request = await fetch("http://127.0.0.1:8000/fetchRecords");
    const response = await request.json();

    setRecords(response);
  }
    


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

  const [packet, setPackets] = useState<routers>({});
  const [record, setRecords] = useState<Record>({});
  const [chartData, setChartData] = useState<Charting>({});



  
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

          
          */
}
