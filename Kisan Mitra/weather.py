import requests

def Weather(city): 
    api_address='http://api.openweathermap.org/data/2.5/weather?appid=610b1ae159d319668044d5a4b092e647&q='

    url = api_address +  city
    json_data = requests.get(url).json() 
    format_add = json_data['main'] 
    print(format_add) 
    return format_add
