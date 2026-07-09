
#this had better be my commit now


from scapy.all import *

homePc = "Microsoft Wi-Fi Direct Virtual Adapter #4"
officePc = "Microsoft Wi-Fi Direct Virtual Adapter #2"


print("Observation Starting")

deviceTable = {}


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

    deviceTable[macSrc]["IpAddress"] = ipSrc

    if (ipSrc == deviceTable[macSrc]["IpAddress"]):
        deviceTable[macSrc]["Uploads"] += len(pkt)
    
    elif(ipDst == officePc[macSrc]["IpAddress"]):
        deviceTable[macSrc]["Downloads"] += len(pkt)

sniff(iface=homePc,timeout=60,prn=observe)

print(deviceTable)

    

    