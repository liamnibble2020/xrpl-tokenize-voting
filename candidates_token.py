import xrpl
from xrpl.wallet import Wallet
from xrpl.wallet import generate_faucet_wallet
from dotenv import load_dotenv, set_key
from pathlib import Path
import os

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)
def tokenize_candidates(voters_number):
    try:
        
        testnet_url = "https://s.altnet.rippletest.net:51234"
        client = xrpl.clients.JsonRpcClient(testnet_url)
    
        issuer_wallet = Wallet.from_seed(os.getenv('issuer_wallet'))        
        candidate1 = generate_faucet_wallet(client, debug=True)
        candidate2 = generate_faucet_wallet(client, debug=True)  
        set_key(str(env_path),'candidate_1', candidate1.seed)
        set_key(str(env_path),'candidate_2', candidate2.seed)     
        metadata = {   
            "candidate1_address": candidate1.address,
            "candidate1_key": candidate1.private_key,
            "candidate1_secret": candidate1.seed,
            "candidate2_address": candidate2.address,
            "candidate2_key": candidate2.private_key,
            "candidate2_secret": candidate2.seed,        
        }
        print(metadata)

        # Configure issuer (cold address) 
        cold_settings_tx = xrpl.models.transactions.AccountSet(
            account=issuer_wallet.address,
            transfer_rate=0,
            tick_size=5,
            domain=bytes.hex("static".encode("ASCII")),
            set_flag=xrpl.models.transactions.AccountSetAsfFlag.ASF_DEFAULT_RIPPLE,
        )
        
        xrpl.transaction.submit_and_wait(cold_settings_tx, client, issuer_wallet)
        
        # Configure candidate1 address settings
        hot_settings_tx = xrpl.models.transactions.AccountSet(
            account=candidate1.address,
            set_flag=xrpl.models.transactions.AccountSetAsfFlag.ASF_REQUIRE_AUTH,
        )

        xrpl.transaction.submit_and_wait(hot_settings_tx, client, candidate1)
        

        # Create trust line from hot to cold address 
        currency_code = os.getenv('donald_token_name')
        trust_set_tx = xrpl.models.transactions.TrustSet(
            account=candidate1.address,
            limit_amount=xrpl.models.amounts.issued_currency_amount.IssuedCurrencyAmount(
                currency=currency_code,
                issuer=issuer_wallet.address,
                value=voters_number,
            )
        )
        
        xrpl.transaction.submit_and_wait(trust_set_tx, client, candidate1)
        
        # Configure candidate2 address settings 
        hot_settings_tx = xrpl.models.transactions.AccountSet(
            account=candidate2.address,
            set_flag=xrpl.models.transactions.AccountSetAsfFlag.ASF_REQUIRE_AUTH,
        )
        
        xrpl.transaction.submit_and_wait(hot_settings_tx, client, candidate2)
        
        # Create trust line from hot to cold address
        currency_code = os.getenv('taz_token_name')
        trust_set_tx = xrpl.models.transactions.TrustSet(
            account=candidate2.address,
            limit_amount=xrpl.models.amounts.issued_currency_amount.IssuedCurrencyAmount(
                currency=currency_code,
                issuer=issuer_wallet.address,
                value=voters_number, 
            )
        )
        
        xrpl.transaction.submit_and_wait(trust_set_tx, client, candidate2)       

        
        return metadata
        
    except xrpl.transaction.XRPLReliableSubmissionException as e:
        print(e)    
        
 



