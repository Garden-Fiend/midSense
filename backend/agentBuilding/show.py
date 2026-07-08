from scapy.all import *

print("Packet Structure: ")

def observe(pkt):
    
    print("------------------")
    
    print(f"Device: {pkt['Ether'].src}")
    if "IP" in pkt:
        print(f"Source IP: {pkt['IP'].src}")
        print(f"Destination IP: {pkt['IP'].dst}")
    
    print("------------------")

sniff(count=20,iface="Microsoft Wi-Fi Direct Virtual Adapter #2",prn= observe)
