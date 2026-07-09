from scapy.all import *

for inter in conf.ifaces.values():
    print(f"NIC: {inter.name} \n Desc: {inter.description} \n MAC Address: {inter.mac} \n IP: {inter.ip}")



