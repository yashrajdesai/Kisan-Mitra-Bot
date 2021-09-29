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
  
    # get total number of rows
    print("Total no. of rows: %d"%(csvreader.line_num))
  
# printing the field names
print('Field names are:' + ', '.join(field for field in fields))
  
#  printing first 5 rows
print('\nFirst 5 rows are:\n')
file = open("domainResponses.yml","w", encoding="utf-8")  
#rows = list(set(rows))
utter_dataset=[]
for row in rows[1:800]:

    queryType = row[0].strip()
    queryType =  re.sub(' +', ' ', queryType)

    queryText = row[1].strip()
    queryText =  re.sub(' +', ' ', queryText)

    kccAnswer=row[2].strip()
    kccAnswer=   re.sub(' +', ' ', kccAnswer)

    # Writing responses into domain.yml
    utters="  utter_"+queryType.replace(" ","_")+"_"+queryText.replace(" ","_")
    kccAns = ":\n"+"  - text: "+'"'+kccAnswer+'"'+"\n\n"
    if utters not in utter_dataset:
        # print(utters)
        file.write(utters+kccAns)
        utter_dataset.append(utters)