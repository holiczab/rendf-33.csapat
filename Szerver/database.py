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
        elif type == "dvc":
            self.ret_msg=self.add_device()
        elif type == "ddvc":
            self.ret_msg=self.delete_device()
        elif type == "cat":
            self.ret_msg=self.add_category()
        elif type == "dcat":
            self.ret_msg=self.delete_category()   

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
            position=row[4]
        print("Password check completed!")
        if len(result)==1:
            return f"Username-Password correct;{position}"
        else:
            return "Username-Password incorrect"

    def add_device(self):
        return ""

    def delete_device(self):
        return ""

    def add_category(self):
        return ""

    def delete_category(self):
        return ""








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
