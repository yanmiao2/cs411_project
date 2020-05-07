import requests
import csv
import time
import json

data = []
description_count = 0
disney_count = 0
romantic = ["R&B","Pop","Country","Theatre","Musical","Arts & Theatre","Comedy","Adult Contemporary"]
friends = ["Music","Comedy","Sports"]
family = ["Sports","Religious","Children's Theatre"]

for page_num in range(0, 50):
    print "page number: " + str(page_num)
    url = "https://app.ticketmaster.com/discovery/v2/events?apikey=PyFddxZGpcyGVUEcTIedebAUhq35OetV&locale=*&countryCode=US&dmaId=249&page=" + str(page_num) + "&"
    response = requests.get(url)
    page = response.json()

    page_list = page["_embedded"]["events"]

    for i in range(len(page_list)):
        print i
        event = {}
        event["Name"] = (page_list[i]["name"])
        
        if "localDate" in page_list[i]["dates"]["start"].keys():
            event["Date"] = str(page_list[i]["dates"]["start"]["localDate"])
        else:
            event["Date"] = "N/A"
        
        if "localTime" in page_list[i]["dates"]["start"].keys():
            event["Start Time"] = str(page_list[i]["dates"]["start"]["localTime"])
        else:
            event["Start Time"] = "-1:00:00"
            
        if("priceRanges" in page_list[i].keys()):
            event["Min Ticket Price"] = page_list[i]["priceRanges"][0]["min"]
            event["Max Ticket Price"] = page_list[i]["priceRanges"][0]["max"]
        else:
             event["Min Ticket Price"] = -1
             event["Max Ticket Price"] = -1
             
        event["Location"] = page_list[i]["_embedded"]["venues"][0]["address"]["line1"] + ", Chicago, IL, " + page_list[i]["_embedded"]["venues"][0]["postalCode"]
        event["URL"] =  page_list[i]["url"]

        if "info" in page_list[i].keys():
            event["Description"] = page_list[i]["info"]
            description_count+=1
        else:
            event["Description"] = "N/A"
        
        event_type = ""
        event_type += page_list[i]["classifications"][0]["segment"]["name"] + " "
        if("subType" in page_list[i]["classifications"][0].keys()):
            event_type += page_list[i]["classifications"][0]["subType"]["name"] + " "
        if("genre" in page_list[i]["classifications"][0].keys()):
            event_type += page_list[i]["classifications"][0]["genre"]["name"] + " "
        if("subGenre" in page_list[i]["classifications"][0].keys()):
            event_type += page_list[i]["classifications"][0]["subGenre"]["name"] + " "
        if("type" in page_list[i]["classifications"][0].keys()):
            event_type += page_list[i]["classifications"][0]["type"]["name"] + " "
        for j in romantic:
            if j in event_type:
               event_type += "Romantic "
               break
        for k in friends:
            if k in event_type:
               event_type += "Friends "
               break
        if "Disney" in event["Name"]:
            event_type += "Family "
            while "Romantic" in event_type:
                remove = event_type.replace("Romantic","")
                event_type = remove
            disney_count+=1
        elif page_list[i]["classifications"][0]["family"]==True:
           event_type += "Family "
        else:
            for l in family:
                if l in event_type:
                    event_type += "Family "
        event["Type"] = event_type
        data.append(event)
        time.sleep(0.01)

with open('data.json', 'w') as f1:
  json.dump(data,f1)
