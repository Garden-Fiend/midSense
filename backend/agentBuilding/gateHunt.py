
from scapy.all import * 

officeNic = "Local Area Connection* 2"

def huntGateway(targetIface):
    for interface in conf.ifaces.values():
        if(interface.name == targetIface):
            return [interface.ip,interface.mac]

gateway = huntGateway(officeNic)

print(gateway[1])