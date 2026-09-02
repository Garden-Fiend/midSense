
from scapy.all import *
import requests

homePc = "Local Area Connection* 12"
officePc = "Local Area Connection* 2"
temporary = "Ethernet"

selectedNic = officePc


        
SERVER_URL = "http://127.0.0.1:8000/incomingPackets"
ROUTER_HEADER = selectedNic

def byteCon(bytes):
    if bytes < 1000:
        return bytes
    elif bytes < 1000000:
        return f"{bytes/1000} kb"
    elif bytes < 1000000000:
        return f"{bytes/1000000} mb"
    elif bytes < 1000000000000:
        return f"{bytes/1000000000} gb" 
    



print("Observation Started")

deviceTable = {}
lookUpTable = {}


print("Configuring Gateway details")

def huntGateway(targetIface):
    for interface in conf.ifaces.values():
        if(interface.name == targetIface):
            return interface 

gateway = huntGateway(selectedNic)

ROUTER_MAC = gateway.mac
print("Gateway details obtained")



lookUpTable[gateway.ip] = gateway.mac
deviceTable[gateway.mac] = {
    "IpAddress" : gateway.ip,
    "Uploads" : 0,
    "Downloads" : 0
}

print(lookUpTable)
print(deviceTable)
print("Gateway added to lookup table")


def observe(pkt):

    print(f"{pkt.summary()} length: {len(pkt)}")

    
    if("Ether" not in pkt):
        return
    
    if("IP" not in pkt):
        return
    
    macSrc = pkt["Ether"].src
    ipSrc = pkt["IP"].src
    ipDst = pkt["IP"].dst

    if(macSrc not in deviceTable):
        
        if(ipSrc != "0.0.0.0"):
                
            deviceTable[macSrc]={
                "IpAddress" : ipSrc,
                "Uploads":0,
                "Downloads":0
            }
        
        lookUpTable[ipSrc] = macSrc
    
    
    if(ipSrc in lookUpTable):
        deviceTable[lookUpTable[ipSrc]]["Uploads"] += len(pkt)
    
    if(ipDst in lookUpTable):
        deviceTable[lookUpTable[ipDst]]["Downloads"] += len(pkt)
        

    
while True:
    
    sniff(iface=selectedNic,timeout=300,prn=observe)

    for device in deviceTable:
        print("-------------------------")
        print(f"MAC Address: {device}")
        print(f"IP Address: {deviceTable[device]['IpAddress']}")
        print(f"Uploads: {byteCon(deviceTable[device]['Uploads'])}")
        print(f"Downloads: {byteCon(deviceTable[device]['Downloads'])}")
        
        r = requests.post(SERVER_URL,headers={"hostname":ROUTER_HEADER,"mac": ROUTER_MAC}, json=deviceTable)





    

    
    

    