const Packets = {
  "4a:e7:da:58:e0:33": {
    IpAddress: "192.168.137.1",
    Uploads: 2930,
    Downloads: 2997,
  },
  "ea:c6:ff:70:1f:56": {
    IpAddress: "192.168.137.233",
    Uploads: 40663,
    Downloads: 67622,
  },
};

console.log("HEADERS:")
console.log(Object.keys(Packets).map((header)=> header))




console.log("CONTENTS:")
console.log(Object.values(Packets).map((packet)=> packet))
console.log("Entries")
Object.entries(Packets).map(([key,value])=> {console.log(key), Object.entries(value).map(([atkey,atval]) => {console.log(atkey,atval)})})

console.log("HEADERS")

Object.values(Packets).map((headers)=> {console.log(Object.keys(headers))})