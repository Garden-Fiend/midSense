
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*",]

)

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
    return{"status":"recieved"}