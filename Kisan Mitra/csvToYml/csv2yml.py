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
file = open("nlu.yml","w", encoding="utf-8")  
for row in rows[1:]:
    
    queryType = row[0].strip()
    queryType =  re.sub(' +', ' ', queryType)

    queryText = row[1].strip()
    queryText =  re.sub(' +', ' ', queryText)

    intent = "- intent: " +  queryType.replace(" ", "_") + "_" + queryText.replace(" ", "_") + "\n"
    examples = "  examples: |\n" + "    - " + queryText.replace("_", " ") + "\n"
    if(queryText.startswith("Tell me")):
        queryTextTwo = queryText.replace("Tell me", "What is the")
    else: 
        tellText = "Tell me "
        queryTextTwo = tellText + queryText
    
    examplestwo = "    - " + queryTextTwo + "\n\n"
    # "\n\n"
    
    finalIntent = intent + examples + examplestwo
    file.write(finalIntent)
