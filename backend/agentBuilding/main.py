
from scapy.all import sniff

print("this is for testing the agent script")
deviceStats = {}

def showStats(pkt):
    print(pkt.summary())
    
    src = pkt["Ether"].src
    dst = pkt["Ether"].dst



    if("Ether" in pkt):
        if  src not in deviceStats:
            deviceStats[src] = {
            "Destination" : dst,
            "Packet_Length" : 0
        }        
            
        deviceStats[src]["Packet_Length"] += len(pkt)


packet = sniff(iface="Microsoft Wi-Fi Direct Virtual Adapter #4", timeout=60, prn = showStats)

print("Observation finished")

for captured in deviceStats:
    print(f"{captured} : {deviceStats[captured]}")