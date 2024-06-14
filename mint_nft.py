import xrpl
import os
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.transaction import submit_and_wait
from xrpl.models.transactions import NFTokenMint
from xrpl.utils import str_to_hex


# Define the function to mint the NFT
def mint_token(cid):
    """Mint an NFT on the XRPL"""
    client = JsonRpcClient("https://s.altnet.rippletest.net:51234/")  
    minter_wallet = Wallet.from_seed(os.getenv('nft_issuer'))    
    nft_uri = "https://ipfs.io/ipfs/" + cid 
 

    mint_tx = NFTokenMint(        
        account=minter_wallet.address,
        uri=str_to_hex(nft_uri),
        flags=int(8),
        transfer_fee=int(0),
        nftoken_taxon=int(0)
    )
    try:
        response = submit_and_wait(mint_tx, client, minter_wallet)    
        # nftoken_id = response.result["meta"]["nftoken_id"]  
        print(response.result)      
        return response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        return f"Submit failed: {e}"


