
from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
import os
import psycopg2
from dotenv import load_dotenv

import json

packetCaptured = {}
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

def cumulatePackets(data,router):
    
    #check if router exists in the current dict
    if router not in packetCaptured:
        packetCaptured[router] ={
            "routerId": router,
            "devices": data.copy()
        }
        return
    
    else:
        # get all the devices that exist within the identified router 
        devices = packetCaptured[router]["devices"]
        
        # we iterate over the values of the devices
        for mac,device in data.items():
            if mac not in devices:
                devices[mac] = device.copy()
                
            else: 
                devices[mac]["Uploads"] += device["Uploads"]
                devices[mac]["Downloads"] += device["Downloads"]                
            
            
        


@app.post("/incomingPackets")
def incomingPacket(data:dict,request:Request):
    print("Packets recived: ")
    print(json.dumps(data,indent=4))
    
    routerId = request.headers.get("router_id")
    
    #insert cumulation process here
    cumulatePackets(data,routerId)    
            
    
        
    
    
                      
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
    