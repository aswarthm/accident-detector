#private key, api and credentials dont work, generate new before using
from firebase_admin import credentials, db
import firebase_admin
from geopy.geocoders import Nominatim
# from bardapi import Bard
import os
from datetime import datetime, timedelta
from twilio.rest import Client
import vertexai
from vertexai.language_models import TextGenerationModel
import os
from web3 import Web3
from web3.middleware import geth_poa_middleware
import json
# os.environ['_BARD_API_KEY']="Xwiui67Af_Tj1CLzYbgQiQiYncces0DC7ZmTaKHBC8V5g."

cred = credentials.Certificate(r"./fb.json")
firebase_admin.initialize_app(cred, {
	'databaseURL': 'https://idkwhatweredoing-default-rtdb.firebaseio.com'
})

def hello_rtdb(event, context):
	os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './creds.json'
	vertexai.init(project="idkwhatweredoing", location="us-central1")
	parameters = {
		"candidate_count": 1,
		"max_output_tokens": 1024,
		"temperature": 0.2,
		"top_p": 0.8,
		"top_k": 40
	}
	model = TextGenerationModel.from_pretrained("text-bison")
		


	"""Triggered by a change to a Firebase RTDB reference.
	Args:
			event (dict): Event payload.
			context (google.cloud.functions.Context): Metadata for the event.
	"""
	print(context.resource)
	ID = context.resource.split("/")[-1]
	time = datetime.utcfromtimestamp(int(ID)//1000) + timedelta(seconds=19800)
	data = event["delta"]
	print(type(data))
	print(data)
	
	sensorData = data["sensors"].split(" ")
	lat = sensorData[1]
	lng = sensorData[2]
	geolocator = Nominatim(user_agent="accident-detector")
	location = geolocator.reverse(f"{float(lat)}, {float(lng)}")
	sensorData = [float(data) for data in sensorData]
	input = "write a distress message using the following keywords:\n" + " Only give a description.\n"
	input += "Location: " + str(location) + "(simplify the location).\n"
	input += "Time: " + time.strftime('%Y-%m-%d %H:%M') +"\n"
	input += "Type of emergency: "

	if(sensorData[0] == 0):
		if(sensorData[3] > 100):
			input+="smoke, "
		if(sensorData[4] == 1):
			input+="locked"
		if(sensorData[5]==1):
			input+="fire, "
		if(sensorData[6]==1):
			input+="bright"

	elif(sensorData[0] == 1):
		if(sensorData[3]==1):
			input+="car crash"
		if(sensorData[4]==1):
			input+="smoke"
	else:
		if(sensorData[3]==1):
			input+="fire, "
		if(sensorData[4]==1):
			input+="smoke"
		if(sensorData[5]==1):
			input+="car crash"
	print(input)
	input += "Put the message in quotes. Include the time"
	# response = Bard().get_answer(input)['content']
	response = model.predict(
        input,
        **parameters
		)
	print(f"Response from Model: {response.text}")
	print(response.text, "\n\n")
	message = response.text
	print("**\n",message,"\n**")


	ref = db.reference('prompt/'+ str(ID))
	ref.set(message)

	message += f"\nDirections to the accident site: https://www.google.com/maps/dir/?api=1&destination={lat}+{lng}&travelmode=driving"

	account_sid = "ACfdd47303feb1c14"
	auth_token = "18fc98fdbf5ae494"
	client = Client(account_sid, auth_token)
	message = client.messages.create(
	body=message,
	from_="+191744",
	to="+919894"
	)
	webb3(data["sensors"])


def webb3(msg):
	alchemy_url = "https://sepolia.infura.io/v3/6f2f95ec16214f24af35c3bf3f070967"
	# alchemy_url = "https://evm.ngd.network:32332/"
	w3 = Web3(Web3.HTTPProvider(alchemy_url))

	private_key = '94d91c5c4155d0c3'
	w3.eth.account.from_key(private_key)
	w3.middleware_onion.inject(geth_poa_middleware, layer=0)

	# w3.eth.default_account = acct.address

	contract_address = '0xaD253Ef03F8dD72eDF09F393B15b689e4F590990'

	with open('./abi.json') as f:
		abi = json.load(f)
	# print(abi)

	wallet_address = '0xfB12Ad056716430BE0477802faD0933040fbA76C'

	print(f'Making a call to contract at address: { contract_address }')
	Incrementer = w3.eth.contract(address=contract_address, abi=abi)

	nonce = w3.eth.get_transaction_count(wallet_address)
	increment_tx = Incrementer.functions.pullsensordata(str(msg)).build_transaction({
		"from": wallet_address,
		"gas": 1000000,
		"gasPrice": w3.to_wei("100", "gwei"),
		"nonce": nonce
	})
	signed = w3.eth.account.sign_transaction(increment_tx, private_key=private_key)
	tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
	receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
	print(tx_hash, receipt)
