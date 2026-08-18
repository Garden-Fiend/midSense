
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


def byteCon(bytes):
    if bytes < 1000:
        return
    elif bytes < 1000000:
        return f"{bytes/1000} kb"
    elif bytes < 1000000000:
        return f"{bytes/1000000} mb"
    elif bytes < 1000000000000:
        return f"{bytes/1000000000} gb" 

#identified a problem, because I'm storing the formatted up and downs they cannot be stacked with an int value since they are strings now, considering moving the formmating fully to the frontend but more research needed. 

def cumulatePackets(data):
    print("Cumulating the Cumulatives or something")
    macAddresses = data.keys()
    
    for mac in macAddresses:   
        packetCaptured[0][mac]["Uploads"] += data[mac]["Uploads"]
        packetCaptured[0][mac]["Downloads"] += data[mac]["Downloads"]
        
        packetCaptured[0][mac]["Uploads"] = byteCon(packetCaptured[0][mac]["Uploads"])
        packetCaptured[0][mac]["Downloads"] = byteCon(packetCaptured[0][mac]["Downloads"])
    
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
    