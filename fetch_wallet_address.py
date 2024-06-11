from flask import json
import requests
import os

def get_wallet_address(cid):

    url = "https://api.pinata.cloud/data/pinList"

    querystring = {"includeCount":"true","cid":cid}

    headers = {"Authorization": f"Bearer {os.getenv('JWT')}"}

    response = requests.request("GET", url, headers=headers, params=querystring)
    
    response_data = json.loads(response.text)
    if response_data["count"] > 0:
        seed = response_data["rows"][0]["metadata"]["keyvalues"]["Seed"]        
        return seed
    else:
        print("No wallet address found.")
        return None

    


