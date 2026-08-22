
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from agentBuilding.networkObserver import startObservation
import json

packetCaptured = []
packetSnapshots = []

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*",]

)

#identified a problem, because I'm storing the formatted up and downs they cannot be stacked with an int value since they are strings now, considering moving the formmating fully to the frontend but more research needed. 

def cumulatePackets(data):
    print("current entries in packetCaptured: ",packetCaptured)
    print("Cumulating the Cumulatives or something")
    macAddresses = data.keys()
    print(macAddresses)
    
    for mac in macAddresses:   
        
        if mac not in packetCaptured:
            packetCaptured[0][mac] = data[mac]
            
        else:
            packetCaptured[0][mac]["Uploads"] += data[mac]["Uploads"]
            packetCaptured[0][mac]["Downloads"] += data[mac]["Downloads"]       
            
    return packetCaptured


                
    
    
@app.get("/")
@app.get("/pong")

def root():
    return {"message":"Why is this in key value pairs? "}

def pong():
    return {"response": "pong"}

@app.post("/incomingPackets")
def incomingPacket(data:dict):
    print("Packets recived: ")
    print(json.dumps(data,indent=4))
    
    #insert cumulation process here
    
    if(len(packetCaptured) < 1):
        packetCaptured.append(data)
    
    packetSnapshots.append(data)
    cumulatePackets(data)
    return{"status":"recieved"}

@app.get("/getPackets")
def getPacket():
    if len(packetCaptured) < 1:
        return "No data captured yet"
    else:        
        return packetCaptured

@app.get("/getRecords")
def throwRecords():
    if(packetSnapshots):
        return packetSnapshots
    else:
        return "No records yet"
    