# importing csv module
import csv
import re
  
# csv file name
filename = "Kerala_2019.csv"
  
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
for row in rows[1:5]:
    
    queryType = row[0].strip()
    queryType =  re.sub(' +', ' ', queryType)

    kccAnswer=row[2].strip()
    kccAnswer=   re.sub(' +', ' ', kccAnswer)

    # Writing responses into domain.yml

    utters="\n\n  utter_"+queryType.replace(" ","_")+":\n"+"  - text: "+'"'+kccAnswer+'"'
    print(utters)
