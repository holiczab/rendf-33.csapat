import re
import sqlite3
import os

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
            ID=message.split(";")[1]
            name=message.split(";")[2]
            category=message.split(";")[3]
            description=message.split(";")[4]
            location=message.split(";")[5]
            self.ret_msg=self.add_device(ID,name,category,description,location)
        elif type == "sdvc":
            self.ret_msg=self.select_devices()
        elif type == "ddvc":
            ID=username=message.split(";")[1]
            self.ret_msg=self.delete_device(ID)
        elif type == "scat":
            self.ret_msg=self.select_categories()
        elif type == "acat":
            ID =message.split(";")[1]
            name =message.split(";")[2]
            parent =message.split(";")[3]
            interval =message.split(";")[4]
            spec =message.split(";")[5]
            standard =message.split(";")[6]
            req =message.split(";")[7]
            self.ret_msg=self.add_category(ID,name,parent,interval,spec,standard,req)
        elif type == "dcat":
            ID=username=message.split(";")[1]
            self.ret_msg=self.delete_category(ID)   

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

    def add_device(self,ID,name,category,description,location):
        self.conn.execute("INSERT INTO Device(ID,Name,Category,Description,Location) VALUES ('"+ID+"','"+name+"','"+category+"','"+description+"','"+location+"')");
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
        print(result)
        msg=""
        for row in result:
            msg+=str(row[0])+";"+str(row[1])+";"+str(row[2])+";"+str(row[3])+";"+str(row[4])+"\n"
        print("Select_devices completed!")
        return msg
        
    def select_categories(self):
        cursor = self.conn.execute("SELECT * FROM Category")
        result = cursor.fetchall()
        print(result)
        msg=""
        for row in result:
            msg+=str(row[0])+";"+str(row[1])+";"+str(row[2])+";"+str(row[3])+";"+str(row[4])+";"+str(row[5])+";"+str(row[6])+"\n"
        print("Select_categories completed!")
        return msg   
        
    def add_category(self,ID,name,parent,interval,spec,standard,req):
        self.conn.execute("INSERT INTO Category(ID,Name,ParentID,Interval,Specification,StandardTime,RequiredQualification) VALUES ('"+ID+"','"+name+"','"+parent+"','"+interval+"','"+spec+"','"+standard+"','"+req+"')");
        self.conn.commit()
        print ("Category Record created successfully")
        self.conn.close()

    def delete_category(self,ID):
        self.conn.execute("DELETE from Category where ID = '"+ID+"'")
        self.conn.commit()
        print("Data deleted from Category!")
        self.conn.close()








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
