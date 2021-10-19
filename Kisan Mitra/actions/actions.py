# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List
# from weather import Weather
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests


class ActionHelloWorld(Action):

    def name(self) -> Text:
        return "action_weather_api"
        

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
            city=tracker.latest_message['text']
            api_address='http://api.openweathermap.org/data/2.5/weather?appid=610b1ae159d319668044d5a4b092e647&q='
            url = api_address +  city
            json_data = requests.get(url).json() 
            format_add = json_data['main']
            temp=int(format_add['temp']-273)
            dispatcher.utter_template("utter_temp",
                tracker,temp=temp)
 
            return []
