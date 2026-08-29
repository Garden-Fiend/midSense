import os
import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")


def throwCapture(capturedRouterMac, capturedRouterHostname, capturedDevices):

    print("CAPTURED ROUTER HOSTNAME: ", capturedRouterHostname)
    print("CAPTURED ROUTER MAC: ", capturedRouterMac)
    print("CAPTURED DEVICES:", capturedDevices)

    connection = psycopg2.connect(DB_URL)
    scribe = connection.cursor()

    print("QUERY FOR ROUTER: ")

    scribe.execute(
        " INSERT INTO routers(name,routermac) VALUES(%s,%s) ON CONFLICT (routermac) DO UPDATE SET name = EXCLUDED.name RETURNING id", (capturedRouterHostname, capturedRouterMac))

    router_id = scribe.fetchone()[0]

    for device in capturedDevices:

        print("INSERT QUERY FOR DEVICE: ")
        scribe.execute("INSERT INTO devices (router_id,mac,ip) VALUES (%s,%s,%s) ON CONFLICT (router_id,mac) DO UPDATE SET ip = EXCLUDED.ip RETURNING id",
                       (router_id, device, capturedDevices[device]["IpAddress"]))

        device_id = scribe.fetchone()[0]

        print("INSERT QUERY FOR RECORDS: ")

        scribe.execute("INSERT INTO records (router,device_id,mac,ip,uploads,downloads) VALUES(%s,%s,%s,%s,%s,%s)", (router_id, device_id, device, capturedDevices[device]["IpAddress"], capturedDevices[device]["Uploads"], capturedDevices[device]["Downloads"])
                       )

    connection.commit()
    scribe.close()
    connection.close()


def getCapture():

    connection = psycopg2.connect(DB_URL)
    scribe = connection.cursor(cursor_factory=RealDictCursor)

    print("GETTING RECORDS")

    scribe.execute(" SELECT * FROM records")
    records = scribe.fetchall()

    return records
