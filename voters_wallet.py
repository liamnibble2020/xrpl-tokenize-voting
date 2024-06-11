import xrpl
from xrpl.wallet import Wallet
from dotenv import load_dotenv
from functools import lru_cache
import os

testnet_url = "https://s.altnet.rippletest.net:51234"
client = xrpl.clients.JsonRpcClient(testnet_url)
load_dotenv()

@lru_cache(maxsize=None)
def vote_don(voters_seed):
    try:
        
        print(f"Voting for Donald {voters_seed}")
        receiving_wallet = Wallet.from_seed(os.getenv('candidate_1'))
        sending_wallet = Wallet.from_seed(voters_seed)
        issuer_wallet = Wallet.from_seed(os.getenv('issuer_wallet'))

        issue_quantity = "1"
        send_token_tx = xrpl.models.transactions.Payment(
            account=sending_wallet.address,
            destination=receiving_wallet.address,
            amount=xrpl.models.amounts.issued_currency_amount.IssuedCurrencyAmount(
                currency="DON",
                issuer=issuer_wallet.address,
                value=issue_quantity
            )
        )
        
        response = xrpl.transaction.submit_and_wait(send_token_tx, client, sending_wallet)
        print(response.result)  
        return "Voting Donald is successful"  
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        print(e)
        return "Something went wrong voting Donald"
       
@lru_cache(maxsize=None)        
def vote_taz(voters_seed):
    try:
        print(f"Voting for Tazzz {voters_seed}")
        receiving_wallet = Wallet.from_seed(os.getenv('candidate_2'))
        sending_wallet = Wallet.from_seed(voters_seed)
        issuer_wallet = Wallet.from_seed(os.getenv('issuer_wallet'))

        issue_quantity = "1"
        send_token_tx = xrpl.models.transactions.Payment(
            account=sending_wallet.address,
            destination=receiving_wallet.address,
            amount=xrpl.models.amounts.issued_currency_amount.IssuedCurrencyAmount(
                currency="TAZ",
                issuer=issuer_wallet.address,
                value=issue_quantity
            )
        )
        
        response = xrpl.transaction.submit_and_wait(send_token_tx, client, sending_wallet)
        print(response.result)  
        return "Voting Taz is successful"
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        print(e)
        return "Something went wrong voting Taz"













