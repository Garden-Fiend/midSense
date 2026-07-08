
from scapy.all import *

print("Observation Starting")

deviceTable = {}


def observe(pkt):

    pkt.show()

    
    if("Ether" not in pkt):
        return
    
    if("IP" not in pkt):
        return
    
    macSrc = pkt["Ether"].src
    ipSrc = pkt["IP"].dst
    ipDst = pkt["IP"].dst

    if(macSrc not in deviceTable):
        deviceTable[macSrc]={
            "IpAddress" : "",
            "Uploads":0,
            "Downloads":0
        }

    deviceTable[macSrc].IpAddress = ipSrc

    if (ipSrc == deviceTable[macSrc].IpAddress):
        deviceTable[macSrc].Uploads += len(pkt)
    
    if(ipDst == deviceTable[macSrc].IpAddress):
        deviceTable[macSrc].Downloads += len(pkt)

sniff(iface="Microsoft Wi-Fi Direct Virtual Adapter #2",count=30,prn=observe)

print(deviceTable)

    

    