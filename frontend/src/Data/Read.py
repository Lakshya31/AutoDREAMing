import xlrd
import json

Data = []
path = "C:\\Users\\Lakshya Sharma\\Desktop\\Projects\\DREAM\\frontend\\src\\Data\\"
newData = {}

def Read():

    print("\nReading Data from Excel Sheet\n")

    workbook = xlrd.open_workbook(path+"data.xlsx")
    sheet = workbook.sheet_by_index(0)
    nrow = sheet.nrows
    ncol = sheet.ncols
    global Data

    for i in range(0, nrow):
        temp = []
        for j in range(0, ncol):
            cell = sheet.cell_value(i, j)
            temp.append(str(cell))
        Data.append(temp)

    print("\nData has been read from the Excel Sheet\n")


def Convert_to_format():
    
    global Data

    global newData
    temp = []
    temp1 = ""
    # print(Data[1])
    for i in range(len(Data)):
        if Data[i][0] != "":
            if i != 0:
                newData[temp1] = temp
            temp1 = Data[i][0]
            temp = []
            if Data[i][1] != "":
                temp.append(Data[i][1])
        if Data[i][0] == "":
            if Data[i][1] == "":
                newData[temp1] = temp
                return
            temp.append(Data[i][1])
            
def to_JSON():

    global newData
    global path
    f = open(path+"data.json","w")
    json.dump(newData,f)
    f.close()

Read()
Convert_to_format()
to_JSON()
# print(newData["Under the influence of substances (E4)"])