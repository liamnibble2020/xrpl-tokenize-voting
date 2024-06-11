import xrpl
import os
from xrpl.wallet import Wallet

testnet_url = "https://s.altnet.rippletest.net:51234"
client = xrpl.clients.JsonRpcClient(testnet_url)

def trust_send_currency(seed):
    
    try:  
        print(f"seed {seed}")
        receiving_wallet = Wallet.from_seed(seed)
        sending_wallet=Wallet.from_seed(os.getenv('issuer_wallet'))
        
        trustline_tx=xrpl.models.transactions.TrustSet(
            account=receiving_wallet.address,
            limit_amount=xrpl.models.amounts.IssuedCurrencyAmount(
                currency="DON",
                issuer=sending_wallet.address,
                value=int("1")
            )
        )
        response =  xrpl.transaction.submit_and_wait(trustline_tx,client, receiving_wallet)
        print("trustline: " , response) 
        
        send_currency_tx=xrpl.models.transactions.Payment(
            account=sending_wallet.address,
            amount=xrpl.models.amounts.IssuedCurrencyAmount(
                currency="DON",
                value=int("1"),
                issuer=sending_wallet.address
            ),
            destination=receiving_wallet.address)
        
        response = xrpl.transaction.submit_and_wait(send_currency_tx, client, sending_wallet)
        print("payments: " , response)  
        
        #########################Second Candidate####################################### 
        
        trustline_tx=xrpl.models.transactions.TrustSet(
            account=receiving_wallet.address,
            limit_amount=xrpl.models.amounts.IssuedCurrencyAmount(
                currency="TAZ",
                issuer=sending_wallet.address,
                value=int("1")
            )
        )
        response =  xrpl.transaction.submit_and_wait(trustline_tx,client, receiving_wallet)
        print("trustline: " , response) 
        
        send_currency_tx=xrpl.models.transactions.Payment(
            account=sending_wallet.address,
            amount=xrpl.models.amounts.IssuedCurrencyAmount(
                currency="TAZ",
                value=int("1"),
                issuer=sending_wallet.address
            ),
            destination=receiving_wallet.address)
        
        response = xrpl.transaction.submit_and_wait(send_currency_tx, client, sending_wallet)
        print("payments: " , response)  
        
        return "trustline_tx and sending candidate token is complete"  
        
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        print(e)    
        

        
        

     
       
  
     













