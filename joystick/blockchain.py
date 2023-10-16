# Setup
import time
from web3 import Web3
from web3.middleware import geth_poa_middleware
import json

alchemy_url = "https://sepolia.infura.io/v3/6f2f95ec16214f24af35c3bf3f070967"
# alchemy_url = "https://evm.ngd.network:32332/"
w3 = Web3(Web3.HTTPProvider(alchemy_url))

private_key = 'put private key'
w3.eth.account.from_key(private_key)
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

# w3.eth.default_account = acct.address

contract_address = '0x67705142B91B7242a21f1622f62599DF248434D4'

with open('./abi.json') as f:
    abi = json.load(f)
# print(abi)

wallet_address = '0xfB12Ad056716430BE0477802faD0933040fbA76C'

print(f'Making a call to contract at address: { contract_address }')
Incrementer = w3.eth.contract(address=contract_address, abi=abi)

nonce = w3.eth.get_transaction_count(wallet_address)
increment_tx = Incrementer.functions.pullsensordata("me andha hu").build_transaction({
    "from": wallet_address,
    "gas": 1000000,
    "gasPrice": w3.to_wei("100", "gwei"),
    "nonce": nonce
})
signed = w3.eth.account.sign_transaction(increment_tx, private_key=private_key)
tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print(tx_hash, receipt)