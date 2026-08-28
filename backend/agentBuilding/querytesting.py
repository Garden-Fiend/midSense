
from supabase import throwCapture





# Test 1
# routerA + MAC A → initialize
header = "routerA"
mac = "macA"

deviceJSON = {
    "4a:e7:00:58:e0:33": {
        "IpAddress": "192.168.137.1",
        "Uploads": 793,
        "Downloads": 256
    }
}

throwCapture(header,mac,deviceJSON)


# Test 2
# routerA + MAC A → should stack onto existing device
header = "routerA"
mac = "macA"

deviceJSON = {
    "4a:e7:00:58:e0:33": {
        "IpAddress": "192.168.137.1",
        "Uploads": 120,
        "Downloads": 340
    }
}


throwCapture(header,mac,deviceJSON)


# Test 3
# routerB + MAC A → same MAC, DIFFERENT router → new device
header = "routerB"
mac = "macB"

deviceJSON = {
    "4a:e7:00:58:e0:33": {
        "IpAddress": "192.168.138.1",
        "Uploads": 500,
        "Downloads": 700
    }
}


throwCapture(header,mac,deviceJSON)


# Test 4
# routerA + MAC B → different MAC, same router → new device
header = "routerA"
mac = "macA"

deviceJSON = {
    "54:25:ea:7f:e6:a3": {
        "IpAddress": "192.168.137.159",
        "Uploads": 1000,
        "Downloads": 2000
    }
}


throwCapture(header,mac,deviceJSON)


# Test 5
# routerB + MAC B → different MAC + different router → new device
header = "routerB"
mac = "macB"

deviceJSON = {
    "54:25:ea:7f:e6:a3": {
        "IpAddress": "192.168.138.159",
        "Uploads": 3000,
        "Downloads": 4000
    }
}


throwCapture(header,mac,deviceJSON)
