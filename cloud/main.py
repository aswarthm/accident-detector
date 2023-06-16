from firebase_admin import credentials, db
import firebase_admin
from geopy.geocoders import Nominatim
from bardapi import Bard
import os
from datetime import datetime

os.environ['_BARD_API_KEY']="WghSdLI1kZXOXo3knVOqgGZaeFa1dWXi4gdSFVvdAHv5wwoU6mi9C_oAy9qYdtAJODZxTw."


cred = credentials.Certificate(r"./fb.json")
firebase_admin.initialize_app(cred, {
     'databaseURL': 'https://idkwhatweredoing-default-rtdb.firebaseio.com'
})


def hello_rtdb(event, context):
	"""Triggered by a change to a Firebase RTDB reference.
	Args:
			event (dict): Event payload.
			context (google.cloud.functions.Context): Metadata for the event.
	"""
	ID = context.resource.split("/")[-1]
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
	input += "Time: " + datetime.utcfromtimestamp(int(ID)).strftime('%Y-%m-%d %H:%M') +"\n"
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

	else:
		if(sensorData[3]==1):
			input+="car crash"
		if(sensorData[4]==1):
			input+="smoke"
	print(input)
	input += "Put the message in quotes. Include the time"
	response = Bard().get_answer(input)['content']
	
	print(response, "\n\n")
	message = response.split('"')[1]
	print("**\n",message,"\n**")

	message += f"\nDirections to the accident site: https://www.google.com/maps/dir/?api=1&destination={lat}+{lng}&travelmode=driving"

	ref = db.reference('prompt/'+ str(ID))
	ref.set(message)
	account_sid = "ACe841d660c1c08fc74ce47ab65091c37b"
	auth_token = "27e369d55bbc328091fe36af239bd09a"
	client = Client(account_sid, auth_token)
	message = client.messages.create(
	body=message,
	from_="+13158608599",
	to="+916366257419"
	)


"""
if keywords someshit string
else if sensors someshit string
get time from id
get location
get prompt
write prompt to firebase
make location link
send twilio
"""

