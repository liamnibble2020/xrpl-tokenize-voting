import xrpl
from xrpl.clients import JsonRpcClient
from xrpl.wallet import Wallet
from xrpl.transaction import submit_and_wait
from xrpl.models.transactions import NFTokenBurn

# Define the function to burn an NFT
def burn_token(seed, nftoken_id, testnet_url="https://s.altnet.rippletest.net:51234/"):
    """Burn an NFT on the XRPL"""
    owner_wallet = Wallet.from_seed(seed)
    client = JsonRpcClient(testnet_url)

    # Create the burn transaction object
    burn_tx = NFTokenBurn(
        account=owner_wallet.classic_address,
        nftoken_id=nftoken_id
    )

    reply = ""
    try:
        # Submit the transaction and wait for the result
        response = submit_and_wait(burn_tx, client, owner_wallet)
        reply = response.result
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        reply = f"Submit failed: {e}"
    
    return reply

# Usage example
seed = "sEdTHYZhuZDCsabktbhfS56kaXBZumq"  # Replace with your XRPL wallet seed
nftoken_id = "000800005E9D2F64925DBA6F8FD8909326BD11A56109684867F109A2000F4907"  # Replace with the actual NFT ID

result = burn_token(seed, nftoken_id)
print(result)
