import xrpl
from xrpl.wallet import Wallet
from flask import Flask, json, request, jsonify
from flask_cors import CORS 
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountNFTs
from xrpl.utils import hex_to_str
import mint_nft as mint
import fetch_wallet_address as fetch_wallet_address
import candidates_token as candidates_token
import send_candidate_token_to_voters as trust_send_currency
import fetch_credentials as fetch_credentials
import voters_wallet as voters_wallet
import get_winner as get_winner
import requests
import os

from requests_toolbelt.multipart.encoder import MultipartEncoder
from xrpl.wallet import generate_faucet_wallet


app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload():
    try:
        # create a wallet        
        testnet_url = "https://s.altnet.rippletest.net:51234"
        client = xrpl.clients.JsonRpcClient(testnet_url)       
        wallet = generate_faucet_wallet(client, debug=True)

        # Get form data
        firstname = request.form['firstname']
        middlename = request.form['middlename']
        lastname = request.form['lastname']
        birthday = request.form['birthday']
        email = request.form['email']
        gender = request.form['gender']
        address = request.form['address']
        image = request.files['image']
        pincode = request.form['pincode']

        # Save the uploaded file
        image_path = os.path.join('uploads', image.filename)
        image.save(image_path)

        # Prepare metadata
        metadata = {
            "name": firstname + " " + middlename + " " + lastname,            
            "keyvalues": {
                "Birthday": birthday,
                "Address": address,
                "Gender": gender,
                "Email": email,
                "Pin": pincode,
                "Wallet address": wallet.address, 
                "Public Key":  wallet.public_key,
                "Private Key": wallet.private_key,
                "Seed": wallet.seed
            }
        }
                
        # Prepare multipart encoder
        with open(image_path, 'rb') as file:
            m = MultipartEncoder(
                fields={
                    'file': (image.filename, file, 'image/png'),
                    'pinataMetadata': (json.dumps(metadata)),
                    'pinataOptions': '{"cidVersion": 0}'
                }
            )

            headers = {
                'Content-Type': m.content_type,
                'Authorization': f'Bearer {os.getenv("JWT")}'
            }

            response = requests.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                data=m,
                headers=headers
            )
            response_json = response.json()   
            ipfs_hash = response_json.get("IpfsHash")
            minting = mint.mint_token(ipfs_hash)  
            return minting
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_nft', methods=['GET'])
def get_nft():
    """Get NFTs for a given account on the XRPL"""
    nft_issuer = Wallet.from_seed(os.getenv('nft_issuer'))
    client = JsonRpcClient("https://s.altnet.rippletest.net:51234/")
    
    # Create the request object
    acct_nfts = AccountNFTs(
        account=nft_issuer.address
    )
    
    # Send the request to the XRPL
    response = client.request(acct_nfts)
    # print(response.result)
    
    nft = {"numbers_of_nfts": len(response.result["account_nfts"]) , "uri":[hex_to_str(obj["URI"]) for obj in response.result["account_nfts"]]}
    if len(response.result["account_nfts"]) == 0 :
        return "No voters NFTS found"
    return nft

    
@app.route('/tokenize', methods=['GET'])
def tokenize(): 
     
    try:
        # Get NFT cid and create trustline then send candidate token 
        response = get_nft()         
        print(response)
        if response != "No voters NFTS found":
            # Number of candidate tokens equal to the number of voters nft tokens
            tokenize_tx = candidates_token.tokenize_candidates(response['numbers_of_nfts'])        
            # Send candidate token to the voters        
            uri = [cid.split('/')[-1] for cid in response['uri']]        
            for cid in uri:   
                seed = fetch_wallet_address.get_wallet_address(cid)
                print(seed)
                trust_and_token_tx = trust_send_currency.trust_send_currency(seed)
                print(trust_and_token_tx)
        
            return tokenize_tx
        else:
            return "No voters NFTS found"  
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        print(e)

@app.route('/voting', methods=['POST'])
def voting():
    try:
        data = request.json  
        firstname = data.get('firstname')
        middlename = data.get('middlename')
        lastname = data.get('lastname')
        birthday = data.get('birthday')
        vote_pin = data.get('pin')
        candidate = data.get('candidate')
        print(f"Firstname: {firstname}, Middlename: {middlename}, Lastname: {lastname}, Birthday: {birthday}, Pin: {vote_pin}, Candidate: {candidate}")
    
        credentials = {
            "name": firstname + " " + middlename + " " + lastname,    
            "pin": vote_pin,        
            "birthday": birthday,        
        }
           
        # if credentials is good this will return voters seed    
        voters_seed = fetch_credentials.fetch_credentials(credentials)
        print(voters_seed)
        if voters_seed == "No wallet address found.":
            return "Bad credentials"
        else:
        # casting the votes
            if candidate == os.getenv('donald_token_name'):
                voters_wallet.vote_don.cache_clear()
                res = voters_wallet.vote_don(voters_seed)
                return res
            elif candidate == os.getenv('taz_token_name'):
                voters_wallet.vote_taz.cache_clear()
                res = voters_wallet.vote_taz(voters_seed)        
                return res
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        return f"something is wrong with credentials {e}"    

@app.route('/winner', methods=['GET'])  
def winner():  
    res = get_winner.get_winner()
    return res

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)  

