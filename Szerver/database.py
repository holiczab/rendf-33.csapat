import re
import sqlite3
import os
from xml.etree.ElementTree import tostring
"""
-------- Feladatok: --------
B:
- Updatek 

ZS:
- Feladat törlés
- Feladat lekérdezés
- Feladat módosítás
- Feladat beszúrás --> Log táblába is adott értékek beszúrása
- Időszakos karbantartás automatán-> Ha a feladat kész, akkor beszúrja újra más időpontokkal

----------------------------
"""
class DataBase:
    def __init__(self,message):
        self.message=message
        self.ret_msg=""
        self.open_conn()
        self.close_conn()

    def operation(self,message):
        type = message.split(";")[0]
        if type == "pwd": #pwd;név;jelszó
            username=message.split(";")[1]
            password=message.split(";")[2]
            self.ret_msg=self.password_check(username,password)
        elif type == "advc":
            #ID=message.split(";")[1]   <---Auto increment miatt nem kell a klienstol fogadni ID-t (SZERK: Bence)
            name=message.split(";")[1]
            category=message.split(";")[2]
            description=message.split(";")[3]
            location=message.split(";")[4]
            self.ret_msg=self.add_device(name,category,description,location)
        elif type == "sdvc":
            self.ret_msg=self.select_devices()
        elif type == "ddvc":
            ID=username=message.split(";")[1]
            self.ret_msg=self.delete_device(ID)
        elif type == "scat":
            self.ret_msg=self.select_categories()
        elif type == "acat":
            name =message.split(";")[1]
            parent =message.split(";")[2]
            interval =message.split(";")[3]
            spec =message.split(";")[4]
            standard =message.split(";")[5]
            req =message.split(";")[6]
            self.ret_msg=self.add_category(name,parent,interval,spec,standard,req)
        elif type == "dcat":
            ID=username=message.split(";")[1]
            self.ret_msg=self.delete_category(ID)
        elif type == "sloc":
            self.ret_msg=self.select_location()
        elif type=="sdname":
            self.ret_msg=self.select_devices_name()
        elif type == "serqqual":
            self.ret_msg=self.select_requiredQualifications()
        elif type == "sparent":
            self.ret_msg=self.select_parent_category_data()

    def return_message(self):
        return self.ret_msg

    def open_conn(self):
        THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
        db_file = os.path.join(THIS_FOLDER, 'karbantartas.db')
        self.conn = sqlite3.connect(db_file)
        print("Opened karbantartas.db successfully")
        self.operation(self.message)

    def close_conn(self):
        self.conn.close()
        print("Closed karbantartas.db successfully")

    def password_check(self,username,password):
        #print(username," ",password)
        cursor = self.conn.execute("SELECT * FROM Specialist WHERE Username='"+username+"' AND Password='"+password+"'")
        result = cursor.fetchall()
        for row in result:
            name=row[4]
            position=row[5]
        print("Password check completed!")
        if len(result)==1:
            return f"Username-Password correct;{position};{name}"
        else:
            return "Username-Password incorrect"

    def add_device(self,name,category,description,location):
        ### Auto increment miatt nem kell a klienstol fogadni ID-t (SZERK: Bence)
        
        #self.conn.execute("INSERT INTO Device(ID,Name,Category,Description,Location) VALUES ('"+ID+"','"+name+"','"+category+"','"+description+"','"+location+"')");
        self.conn.execute("INSERT INTO Device(Name,Category,Description,Location) VALUES ('"+name+"','"+category+"','"+description+"','"+location+"')");
        self.conn.commit()
        print ("Device Record created successfully")
        self.conn.close()
        
    def delete_device(self,ID):
        self.conn.execute("DELETE from Device where ID = '"+ID+"'")
        self.conn.commit()
        print("Data deleted from Device!")
        self.conn.close()

    def select_devices(self):
        cursor = self.conn.execute("SELECT * FROM Device")
        result = cursor.fetchall()
        'print(result)'
        msg=""
        for row in result:
            msg+=str(row[0])+";"+str(row[1])+";"+str(row[2])+";"+str(row[3])+";"+str(row[4])+"END_OF_ROW"
        print("Select_devices completed!")
        return msg
        
    def select_categories(self):
        cursor = self.conn.execute("SELECT * FROM Category")
        result = cursor.fetchall()
        'print(result)'
        msg=""
        for row in result:
            msg+=str(row[0])+";"+str(row[1])+";"+str(row[2])+";"+str(row[3])+";"+str(row[4])+";"+str(row[5])+";"+str(row[6])+"END_OF_ROW"
        print("Select_categories completed!")
        return msg   

    def select_if_cat_empty(self,ID,em):
        cursor = self.conn.execute("SELECT "+em+" FROM Category WHERE ID = '"+ID+"'")
        result = cursor.fetchall()
        return str(result[0][0])

    def add_category(self,name,parent,interval,spec,standard,req):
        try:
            if interval=="Null": interval=self.select_if_cat_empty(parent,"Interval")
            if spec=="Null": spec=self.select_if_cat_empty(parent,"Specification")
            if standard=="Null": standard=self.select_if_cat_empty(parent,"StandardTime")
            if req=="Null": req=self.select_if_cat_empty(parent,"RequiredQualification")
            print("INSERT INTO Category(Name,ParentID,Interval,Specification,StandardTime,RequiredQualification) VALUES ('"+name+"','"+parent+"','"+interval+"','"+spec+"','"+standard+"','"+req+"')")
            self.conn.execute("INSERT INTO Category(Name,ParentID,Interval,Specification,StandardTime,RequiredQualification) VALUES ('"+name+"','"+parent+"','"+interval+"','"+spec+"','"+standard+"','"+req+"')")
            self.conn.commit()  
        except Exception:
            print(tostring(Exception)) 
        print ("Category Record created successfully")
        self.conn.close()

    def delete_category(self,IDs):
        print("DELETE from Category where ID IN ("+IDs+")")
        self.conn.execute("DELETE from Category where ID IN ("+IDs+")")
        self.conn.commit()
        print("Data deleted from Category!")
        self.conn.close()

    def select_location(self):
        cursor = self.conn.execute("SELECT DISTINCT Location FROM Device ORDER BY Location")
        result = cursor.fetchall()
        msg=""
        for row in result:
            msg+=str(row[1])+"END_OF_ROW"
        print("Select_location completed!")
        return msg

    def select_requiredQualifications(self):
        cursor = self.conn.execute("SELECT DISTINCT RequiredQualification FROM Category ORDER BY RequiredQualification")
        result = cursor.fetchall()
        msg=""
        for row in result:
            msg+=str(row[0])+"END_OF_ROW"
        print("Select_requiredQualifications completed!")
        return msg

    def select_devices_name(self):
        cursor = self.conn.execute("SELECT Name FROM Device ORDER BY Name")
        result = cursor.fetchall()
        msg=""
        for row in result:
            msg+=str(row[0])+"END_OF_ROW"
        print("Select_location completed!")
        return msg

    def select_parent_category_data(self):
        cursor = self.conn.execute("SELECT ID,Name,StandardTime FROM Category ORDER BY Name")
        result = cursor.fetchall()
        msg=""
        for row in result:
            msg+=str(row[0])+";"+str(row[1])+";"+str(row[2])+"END_OF_ROW"
        print("Select_parent_category_data completed!")
        return msg







""" ---------- INSERT --------- 
conn.execute("INSERT INTO COMPANY (ID,NAME,AGE,ADDRESS,SALARY) \
      VALUES (4, 'Mark', 25, 'Rich-Mond ', 65000.00 )");
conn.commit()
print "Records created successfully";
conn.close()

    ---------- SELECT --------- 
cursor = conn.execute("SELECT id, name, address, salary from COMPANY")
for row in cursor:
   print "ID = ", row[0]
   print "NAME = ", row[1]
   print "ADDRESS = ", row[2]
   print "SALARY = ", row[3], "\n"
print "Operation done successfully";
conn.close()

    ---------- SELECT --------- 
conn.execute("UPDATE COMPANY set SALARY = 25000.00 where ID = 1")
conn.commit()
print "Total number of rows updated :", conn.total_changes
conn.close()

    ---------- DELETE ---------
conn.execute("DELETE from COMPANY where ID = 2;")
conn.commit()
print "Total number of rows deleted :", conn.total_changes
conn.close()
"""
