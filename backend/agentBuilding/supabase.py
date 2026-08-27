import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")
connection = psycopg2.connect(DB_URL)



scribe = connection.cursor()



header = "routerA"

sampleJSON = {
    "4a:e7:da:58:e0:33": {
        "IpAddress": "192.168.137.1",
        "Uploads": 793,
        "Downloads": 256
    },
    "54:25:ea:7f:e6:a3": {
        "IpAddress": "192.168.137.159",
        "Uploads": 7663,
        "Downloads": 5870
    }
}

def throwCapture(capturedRouter,capturedDevices):
    
    print("QUERY FOR ROUTER: ")
    
    scribe.execute(""" INSERT INTO routers() VALUES(%s) """,(capturedRouter))
    
    print("Header: ",capturedRouter)

    print("-----------")

    for device in capturedDevices:
        
        
        
        print("INSERT QUERY FOR DEVICE: ")
        
        scribe.execute("""                        
                       INSERT INTO devices (router_id,mac,ip) VALUES (%s,%s,%s) 
                       """, device,capturedRouter[device]["IpAddress"])
        
        print("mac: ", device)
        print("ip: ",capturedDevices[device]["IpAddress"])
        
        
        print("-----------")                
        
        print("INSERT QUERY FOR RECORDS: ")                
        print("mac: ", device)
        print("ip: ",capturedDevices[device]["IpAddress"])
        print("uploads: ",capturedDevices [device]["Uploads"])
        print("downloads: ",capturedDevices [device]["Downloads"])
    
        print("-----------")

throwCapture(header,sampleJSON)






