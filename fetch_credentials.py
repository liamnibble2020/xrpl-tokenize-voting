import xrpl
from flask import json
import requests
import os

def fetch_credentials(credentials):
    
    try:
        # Define the parameters
        url = "https://api.pinata.cloud/data/pinList"
        
        name = credentials["name"]
        Pin = "Pin"
        pin_value = credentials["pin"]
        op = "eq"
        Birthday = "Birthday"
        birthday_value = credentials["birthday"]

        # Create the query parameters
        params = {
            "metadata[name]": name,
            "metadata[keyvalues]": json.dumps({
                Pin: {
                    "value": pin_value,
                    "op": op
                },
                Birthday: {
                    "value": birthday_value,
                    "op": op
                }
                
            })
        }

        headers = {"Authorization": f"Bearer {os.getenv('JWT')}"}

        response = requests.request("GET", url, headers=headers, params=params)
        
        response_data = json.loads(response.text)
        
        print(response_data)
        
        if response_data["count"] > 0:
            seed = response_data["rows"][0]["metadata"]["keyvalues"]["Seed"]
            print(seed)
            return seed
        else:
            print("No wallet address found.")
            return None
        
    except xrpl.transport.XRPLReliableSubmissionException as e:
        print(e)    


