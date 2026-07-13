
from scapy.all import *
import requests

homePc = "Microsoft Wi-Fi Direct Virtual Adapter #4"
officePc = "Local Area Connection* 2"
temporary = "Ethernet"

selectedNic = officePc

def byteCon(bytes):
    if bytes < 1000:
        return
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
        

    


sniff(iface=selectedNic,timeout=60,prn=observe)

for device in deviceTable:
    print("-------------------------")
    print(f"MAC Address: {device}")
    print(f"IP Address: {deviceTable[device]['IpAddress']}")
    print(f"Uploads: {byteCon(deviceTable[device]['Uploads'])}")
    print(f"Downloads: {byteCon(deviceTable[device]['Downloads'])}")

r = requests.post("http://127.0.0.1:8000/incomingPackets",json=deviceTable)




    

    
    

    