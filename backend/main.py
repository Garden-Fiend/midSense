
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
@app.get("/pong")

def root():
    return {"message":"Why is this in key value pairs? "}

def pong():
    return {"response": "pong"}
