
def byteCon(bytes):
    if bytes < 1000:
        return
    elif bytes < 1000000:
        return {"count" : bytes/1000,"unit" : "kb"}
    elif bytes < 1000000000:
        return {"count" : bytes/1000000,"unit" : "mb"}
    elif bytes < 1000000000000:
        return {"count" :  bytes/1000000000,"unit" : "gb"}
    



print(byteCon(199990998780))
    
