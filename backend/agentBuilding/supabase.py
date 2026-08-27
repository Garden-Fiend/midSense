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


def throwCapture(capturedRouter, capturedDevices):

    print("QUERY FOR ROUTER: ")

    scribe.execute(" INSERT INTO routers(name) VALUES(%s) RETURNING id", (capturedRouter,))

    router_id = scribe.fetchone()[0]

    for device in capturedDevices:

            print("INSERT QUERY FOR DEVICE: ")

            scribe.execute("INSERT INTO devices (router_id,mac,ip) VALUES (%s,%s,%s) RETURNING id",
                           (router_id, device, capturedDevices[device]["IpAddress"]))

            device_id = scribe.fetchone()[0]



            print("INSERT QUERY FOR RECORDS: ")

            scribe.execute("INSERT INTO records (router,device_id,mac,ip,uploads,downloads) VALUES(%s,%s,%s,%s,%s,%s)", (router_id, device_id, device, capturedDevices[device]["IpAddress"], capturedDevices[device]["Uploads"], capturedDevices[device]["Downloads"])
                               )
    
    connection.commit()
    scribe.close() 
    connection.close()        
            


throwCapture(header, sampleJSON)

