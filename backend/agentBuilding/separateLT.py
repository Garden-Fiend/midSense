
from scapy.all import *

homePc = "Microsoft Wi-Fi Direct Virtual Adapter #4"
officePc = "Microsoft Wi-Fi Direct Virtual Adapter #2"


print("Observation Starting")

deviceTable = {}
lookUpTable = {}


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
            "IpAddress" : "",
            "Uploads":0,
            "Downloads":0
        }
        
        lookUpTable[ipSrc] = macSrc

    deviceTable[macSrc]["IpAddress"] = ipSrc
    
    
    if(ipSrc in lookUpTable):
        print(lookUpTable[ipSrc])
        deviceTable[lookUpTable[ipSrc]]["Uploads"] += len(pkt)
    
    if(ipDst in lookUpTable):
        print(lookUpTable[ipDst])
        deviceTable[lookUpTable[ipDst]]["Uploads"] += len(pkt)
        

    

sniff(iface=homePc,timeout=20,prn=observe)

for device in deviceTable:
    print("-------------------------")
    print(device)
    print(deviceTable[device]["IpAddress"])
    print(deviceTable[device]["Uploads"])
    print(deviceTable[device]["Downloads"])
    

    
    

    