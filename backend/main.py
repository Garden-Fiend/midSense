
from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from agentBuilding.supabase import throwCapture, getCapture


import json

packetCaptured = {}
packetSnapshots = []

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*",]

)

# identified a problem, because I'm storing the formatted up and downs they cannot be stacked with an int value since they are strings now, considering moving the formmating fully to the frontend but more research needed.


def cumulatePackets(data, router):

    # check if router exists in the current dict
    if router not in packetCaptured:
        packetCaptured[router] = {
            "routerId": router,
            "devices": data.copy()
        }
        return

    else:
        # get all the devices that exist within the identified router
        devices = packetCaptured[router]["devices"]

        # we iterate over the values of the devices
        for mac, device in data.items():
            if mac not in devices:
                devices[mac] = device.copy()

            else:
                devices[mac]["Uploads"] += device["Uploads"]
                devices[mac]["Downloads"] += device["Downloads"]


@app.post("/incomingPackets")
def incomingPacket(data: dict,hostname:str = Header(...), mac: str = Header(...)):
    print("Packets recived: ")

    formattedData = json.dumps(data, indent=4)
    print(hostname)
    print(mac)
    print(formattedData)
    
    throwCapture(mac,hostname,data)
    
    return {"status": "recieved"}


@app.get("/getPackets")
def getPacket():
    if len(packetCaptured) < 1:
        return "No data captured yet"
    else:
        return packetCaptured


@app.get("/getRecords")
def throwRecords():
    if (packetSnapshots):
        return packetSnapshots
    else:
        return "No records yet"

@app.get("/fetchRecords")
def callSupabaseQuery():    
    print("CALLING THE RECORD CALL")
    return getCapture()