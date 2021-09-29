# importing csv module
import csv
import re
  
# csv file name
filename = "Our_Dataset.csv"
  
# initializing the titles and rows list
fields = []
rows = []
  
# reading csv file
with open(filename, 'r') as csvfile:
    # creating a csv reader object
    csvreader = csv.reader(csvfile)
      
    # extracting field names through first row
    fields = next(csvreader)
  
    # extracting each data row one by one
    for row in csvreader:
        rows.append(row)

file = open("domainIntents.yml","w", encoding="utf-8") 
intents_dataset= []
for row in rows[1:800]:
    
    queryType = row[0].strip()
    queryType =  re.sub(' +', ' ', queryType)

    queryText = row[1].strip()
    queryText =  re.sub(' +', ' ', queryText)
    intent = "  - " +  queryType.replace(" ", "_") + "_" + queryText.replace(" ", "_") + "\n"
    #print(intent,end="")
    if intent not in intents_dataset:
        intents_dataset.append(intent)
        file.write(intent)
