import xrpl
import os
from xrpl.wallet import Wallet
from dotenv import load_dotenv
testnet_url = "https://s.altnet.rippletest.net:51234"
client = xrpl.clients.JsonRpcClient(testnet_url)

load_dotenv()

def get_winner():
    try:
        print("Getting candidate_1 address balances...")
        print(f'candidate 1 {os.getenv("candidate_1")}')
        candidate_1 = Wallet.from_seed(os.getenv("candidate_1"))

        don = client.request(xrpl.models.requests.AccountLines(
            account=candidate_1.address,
            ledger_index="validated",
        ))
        lines = don.result.get('lines', [])
        for line in lines:
            candidate1_balance = line.get('balance')
            candidate1_currency = line.get('currency')
            print(f"Balance: {candidate1_balance}, Currency: {candidate1_currency}")    
            
        print("Getting candidate_2 address balances...")
        candidate_2 = Wallet.from_seed(os.getenv("candidate_2"))
        print(f'candidate 2{os.getenv("candidate_2")}')
        taz = client.request(xrpl.models.requests.AccountLines(
            account=candidate_2.address,
            ledger_index="validated",
        ))
        lines = taz.result.get('lines', [])
        for line in lines:
            candidate2_balance = line.get('balance')
            candidate2_currency = line.get('currency')
            print(f"Balance: {candidate2_balance}, Currency: {candidate2_currency}")
            
            
        if candidate1_currency == "DON" and candidate2_currency == "TAZ":
            print("Vote returns is Valid")
            
            if candidate1_balance > candidate2_balance:
                winner = {"winners_name": candidate1_currency, "number_of_votes": candidate1_balance}
                print(f"The winner is {winner}")
                return winner
            elif candidate2_balance > candidate1_balance:
                winner = {"winners_name": candidate2_currency, "number_of_votes": candidate2_balance}
                print(f"The winner is {winner}")
                return winner
            elif candidate2_balance == candidate1_balance:                                
                return "It's a tie"   
                           
            else:
                return "Something is wrong"    
        else:
            print("Something went wrong")    
            
    except xrpl.transaction.XRPLReliableSubmissionException as exception:
        print(exception)          