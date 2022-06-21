from cgitb import reset
from datetime import datetime, timedelta
from dis import Instruction
import re
import sqlite3
import os
import time
from xml.etree.ElementTree import tostring

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
        elif type=="smaint":
            self.ret_msg=self.select
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
        elif type == "sDev_id_name_instr":
            self.ret_msg=self.select_Device_id_name_instruction()    
        elif type == "sdname":
            self.ret_msg=self.select_devices_name()
        elif type == "serqqual":
            self.ret_msg=self.select_requiredQualifications()
        elif type == "sparent":
            self.ret_msg=self.select_parent_category_data()
        elif type == "ucat":
            ID=message.split(";")[1]
            name =message.split(";")[2]
            parent =message.split(";")[3]
            interval =message.split(";")[4]
            spec =message.split(";")[5]
            standard =message.split(";")[6]
            req =message.split(";")[7]
            self.ret_msg=self.update_category(ID,name,parent,interval,spec,standard,req)
        elif type == "udvc":
            ID=message.split(";")[1]
            name=message.split(";")[2]
            category=message.split(";")[3]
            description=message.split(";")[4]
            location=message.split(";")[5]
            self.ret_msg=self.update_device(ID,name,category,description,location)
        elif type == "gcatid":
            name=message.split(";")[1]
            self.ret_msg=self.get_category_ID(name)
        elif type == "gdevid":
            name=message.split(";")[1] 
            self.ret_msg=self.get_device_ID(name)
        elif type=="smtt":
            self.ret_msg=self.select_maintenancetask()
        elif type=="dmtt":
            ID=username=message.split(";")[1]
            print(ID)
            self.ret_msg=self.delete_maintenancetask(ID)
        elif type=="amtt":
            name=message.split(";")[1]
            device=message.split(";")[2]
            status=message.split(";")[3]
            instruction=message.split(";")[4]
            type=message.split(";")[5]
            importance=message.split(";")[6]
            self.ret_msg=self.add_maintenancetask(name,device,status,instruction,type,importance)
        elif type=="check":
            self.ret_msg=self.auto_task_generate()
        elif type=="umtt":
            ID=message.split(";")[1]
            name=message.split(";")[2]
            device=message.split(";")[3]
            status=message.split(";")[4]
            instruction=message.split(";")[5]
            type=message.split(";")[6]
            importance=message.split(";")[7]
            self.ret_msg=self.update_maintenancetask(ID,name,device,status,instruction,type,importance)
        elif type=="sspectasks":
            name=message.split(";")[1]
            self.ret_msg=self.select_specialist_tasks(name)
        elif type=="sinst":
            name=message.split(";")[1]
            self.ret_msg=self.select_instruction(name)
        elif type=="ustatus":
            utype=message.split(";")[1]
            TaskID=message.split(";")[2]
            name=message.split(";")[3]
            self.ret_msg=self.update_approve(utype,TaskID,name)
        elif type=="sspecwithqual":
            name=message.split(";")[1]
            self.ret_msg=self.select_specialists_with_qual(name)


    def select_specialists_with_qual(self,name):
        cursor = self.conn.execute("SELECT ID,Name FROM Specialist WHERE Qualification=(SELECT Category.RequiredQualification FROM Device INNER JOIN Category ON Device.Category=Category.ID AND Device.ID='"+name+"') AND ID NOT IN (SELECT AssignedTo FROM Log INNER JOIN MaintenanceTasks ON MaintenanceTasks.ID=Log.Task WHERE Status='Started')")
        result = cursor.fetchall()
        msg=""
        for row in result:
            msg+=str(row[0])+";"+str(row[1])+"END_OF_ROW"
        print("Select_specialists (Q) completed!")
        return msg


    def update_approve(self,utype,ID,name):
        try:
            #self.conn.execute("UPDATE Log SET AssignedTo='"+str(row[1])+"',DeniedBy='"+str(row[2])+"',ApprovedBy='"+str(row[3])+"',Task='"+str(row[4])+"',Start='"+str(date)+"',End='"+str(end)+"' WHERE ID='"+str(row[0])+"'")
            if utype=="as":
                self.conn.execute("UPDATE Log SET AssignedTo='"+name+"' WHERE Task='"+ID+"'")
                print("UPDATE Log SET AssignedTo='"+name+"' WHERE Task='"+ID+"'")
                self.conn.commit()
            elif utype=='a':
                self.conn.execute("UPDATE Log SET ApprovedBy=(SELECT ID FROM Specialist WHERE Name='"+name+"') WHERE Task='"+ID+"'")
                self.conn.commit()
                self.conn.execute("UPDATE MaintenanceTasks SET Status='Accepted' WHERE ID='"+ID+"'")
                self.conn.commit()
            elif utype=='d':
                self.conn.execute("UPDATE Log SET DeniedBy=(SELECT ID FROM Specialist WHERE Name='"+name+"') WHERE Task='"+ID+"'")
                self.conn.commit()
                self.conn.execute("UPDATE MaintenanceTasks SET Status='Denied' WHERE ID='"+ID+"'")
                self.conn.commit()
            elif utype=='s':
                date = time.strftime("%m/%d/%Y", time.localtime())
                self.conn.execute("UPDATE Log SET Start='"+str(date)+"' WHERE Task='"+ID+"'")
                self.conn.commit()
                self.conn.execute("UPDATE MaintenanceTasks SET Status='Started' WHERE ID='"+ID+"'")
                self.conn.commit()
            elif utype=='e':
                date = time.strftime("%m/%d/%Y", time.localtime())
                self.conn.execute("UPDATE Log SET End='"+str(date)+"' WHERE Task='"+ID+"'")
                self.conn.commit()
                self.conn.execute("UPDATE MaintenanceTasks SET Status='Finished' WHERE ID='"+ID+"'")
                self.conn.commit()
               
        except Exception:
            print(tostring(Exception))
        print("Status and Log successfully updated!")
        self.conn.close()
    

    def time_to_int(self,dateobj):
        total = int(dateobj.strftime('%S'))
        total += int(dateobj.strftime('%M')) * 60
        total += int(dateobj.strftime('%H')) * 60 * 60
        total += (int(dateobj.strftime('%j')) - 1) * 60 * 60 * 24
        total += (int(dateobj.strftime('%Y')) - 1970) * 60 * 60 * 24 * 365
        return total

    def get_interval_sec(self,name):
        if name=="W": return 604800
        elif name=="M": return 2629743
        elif name=="Q": return 10518972
        elif name=="H": return 15778458
        elif name=="Y": return 31556926

    def int2date(argdate):
        year = int(argdate / 10000)
        month = int((argdate % 10000) / 100)
        day = int(argdate % 100)
        return month+"/"+day+"/"+year

    def auto_task_generate(self):
        localtime = time.localtime()
        date = time.strftime("%m/%d/%Y", localtime)
        #cursor = self.conn.execute("SELECT * FROM Log WHERE End IS NOT NULL OR Start IS NOT NULL")
        cursor = self.conn.execute("SELECT * FROM Log INNER JOIN MaintenanceTasks ON MaintenanceTasks.ID=Log.Task WHERE MaintenanceTasks.Type=0 AND MaintenanceTasks.Status LIKE 'Finished' GROUP BY Task")
        result = cursor.fetchall()
        #05/02/2022 formátum!!
        for row in result:
            print(row)
            if row[6] is not None:
                end=datetime(int(row[6].split("/")[2]),int(row[6].split("/")[0]),int(row[6].split("/")[1]))
                today=datetime(int(date.split("/")[2]),int(date.split("/")[0]),int(date.split("/")[1]))
                print(end,today)
                print(self.time_to_int(end),self.time_to_int(today))
                cursor = self.conn.execute("SELECT Interval FROM Category INNER JOIN Device ON Device.Category=Category.ID INNER JOIN MaintenanceTasks ON MaintenanceTasks.Device=Device.ID INNER JOIN Log ON Log.Task=MaintenanceTasks.ID WHERE MaintenanceTasks.ID= "+str(row[4])+" AND MaintenanceTasks.Type=0 AND MaintenanceTasks.Status='Finished'")
                #0 auto, 1 manual
                resultt = cursor.fetchall()
                print(resultt)
                print(self.time_to_int(today))
                print('----------')
                if resultt and self.time_to_int(end) <= self.time_to_int(today):
                    endArray=str(datetime.now() + timedelta(seconds=self.get_interval_sec(str(resultt[0][0]))+100000)).split(" ")[0].split("-")
                    end=endArray[1]+"/"+endArray[2]+"/"+endArray[0]
                    print(end)
                    print("Insert")
                    self.conn.execute("INSERT INTO Log(Task,Start,End) VALUES('"+str(row[4])+"','"+str(date)+"','"+str(end)+"')")
                    self.conn.commit()
                    print("Update")
                    self.conn.execute("UPDATE MaintenanceTasks SET Status='New' WHERE ID='"+str(row[4])+"'")
                    self.conn.commit()
                        
        print("MaintenanceTasks have been refreshed!")
        
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
        self.conn.execute("INSERT INTO Device(Name,Category,Description,Location) VALUES ('"+name+"','"+category+"','"+description+"','"+location+"')")
        self.conn.commit()
        print ("Device Record created successfully")
        self.conn.close()
        
    def delete_device(self,IDs):
        self.conn.execute("DELETE from Device where ID IN ("+IDs+")")
        self.conn.commit()
        print("Data deleted from Device!")
        self.conn.close()

    def select_instruction(self,name):
        cursor = self.conn.execute("SELECT Instruction FROM MaintenanceTasks WHERE Name='"+name+"'")
        result = cursor.fetchall()
        return str(result[0][0])

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

    def select_specialist_tasks(self,name):
        cursor=self.conn.execute("SELECT * FROM MaintenanceTasks INNER JOIN Log ON Log.Task=MaintenanceTasks.ID WHERE AssignedTo=(SELECT ID FROM Specialist WHERE Name='"+name+"') AND Status!='Finished' GROUP BY MaintenanceTasks.ID")
        result=cursor.fetchall()
        msg=""
        for row in result:
            msg+=str(row[0])+";"+str(row[1])+";"+str(row[2])+";"+str(row[3])+";"+str(row[4])+";"+str(row[5])+";"+str(row[6])+"END_OF_ROW"
        print("Select_Specialist_tasks completed!")
        return msg
    
    def delete_maintenancetask(self,taskid):
        print("DELETE from MaintenanceTasks where ID IN ("+taskid+")")
        self.conn.execute("DELETE from MaintenanceTasks where ID IN ("+taskid+")")
        self.conn.commit()
        print("Selected_MaintenanceTasks succesfully deleted !")
        self.conn.close()
    
    def select_maintenancetask(self):
        localtime = time.localtime()
        date = time.strftime("%m/%d/%Y", localtime)

        cursor=self.conn.execute("SELECT * FROM MaintenanceTasks INNER JOIN Log ON Log.Task=MaintenanceTasks.ID WHERE Status != 'Finished'")
        result=cursor.fetchall()
        msg=""
        for row in result:
            if row[13] is None:
                msg+=str(row[0])+";"+str(row[1])+";"+str(row[2])+";"+str(row[3])+";"+str(row[4])+";"+str(row[5])+";"+str(row[6])+";"+self.get_ID_SpecName(str(row[8]))+";"+self.get_ID_SpecName(str(row[10]))+";"+str(row[13])+"END_OF_ROW"
            else:
                end=datetime(int(row[13].split("/")[2]),int(row[13].split("/")[0]),int(row[13].split("/")[1]))
                today=datetime(int(date.split("/")[2]),int(date.split("/")[0]),int(date.split("/")[1]))
                if self.time_to_int(end) > self.time_to_int(today):
                    msg+=str(row[0])+";"+str(row[1])+";"+str(row[2])+";"+str(row[3])+";"+str(row[4])+";"+str(row[5])+";"+str(row[6])+";"+self.get_ID_SpecName(str(row[8]))+";"+self.get_ID_SpecName(str(row[10]))+";"+str(row[13])+"END_OF_ROW"
        print("Selected_MaintenanceTasks completed!")
        return msg

        """
        cursor=self.conn.execute("SELECT * FROM MaintenanceTasks WHERE Status!='Finished'")
        result=cursor.fetchall()
        'print(result)'
        msg=""
        for row in result:
            msg+=str(row[0])+";"+str(row[1])+";"+str(row[2])+";"+str(row[3])+";"+str(row[4])+";"+str(row[5])+";"+str(row[6])+"END_OF_ROW"
        print("Selected_MaintenanceTasks completed!")
        return msg
        """
    
    def update_maintenancetask(self,ID,name,device,status,instruction,type,importance):
        try:
            print("Update MaintenanceTasks SET Name='"+name+"',Device='"+device+"',Status='"+status+"',Instruction='"+instruction+"',Type='"+type+"',Importance='"+importance+"' WHERE ID='"+ID+"'")
            self.conn.execute("Update MaintenanceTasks SET Name='"+name+"',Device='"+device+"',Status='"+status+"',Instruction='"+instruction+"',Type='"+type+"',Importance='"+importance+"' WHERE ID='"+ID+"'")
            self.conn.commit()
        except Exception:
            print(tostring(Exception))
        print("Maintenance Task successfully updated!")
        self.conn.close()
    
    def add_maintenancetask(self,name,device,status,instruction,type,importance):
        try:
            print("INSERT INTO MaintenanceTasks(Name,Device,Status,Instruction,Type,Importance) VALUES('"+name+"','"+device+"','"+status+"','"+instruction+"','"+type+"','"+importance+"')")
            self.conn.execute("INSERT INTO MaintenanceTasks(Name,Device,Status,Instruction,Type,Importance) VALUES('"+name+"','"+device+"','"+status+"','"+instruction+"','"+type+"','"+importance+"')")
            self.conn.commit()
            cursor = self.conn.execute("SELECT ID FROM MaintenanceTasks WHERE Name='"+name+"'")
            result = cursor.fetchall()
            self.conn.execute("INSERT INTO Log (Task) VALUES ('"+str(result[0][0])+"')")
            self.conn.commit()
        except Exception:
            print(tostring(Exception))
        print("Maintenance Task successfully recorded")
        self.conn.close()
    
    def add_category(self,name,parent,interval,spec,standard,req):
        try:
            if interval=="": interval=self.select_if_cat_empty(parent,"Interval")
            if spec=="": spec=self.select_if_cat_empty(parent,"Specification")
            if standard=="": standard=self.select_if_cat_empty(parent,"StandardTime")
            if req=="": req=self.select_if_cat_empty(parent,"RequiredQualification")
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

    def update_category(self,ID,name,parent,interval,spec,standard,req):
        try:
            print("UPDATE Category SET Name='"+name+"',ParentID='"+parent+"',Interval='"+interval+"',Specification='"+spec+"',StandardTime='"+standard+"',RequiredQualification='"+req+"' WHERE ID='"+ID+"'")
            self.conn.execute("UPDATE Category SET Name='"+name+"',ParentID='"+parent+"',Interval='"+interval+"',Specification='"+spec+"',StandardTime='"+standard+"',RequiredQualification='"+req+"' WHERE ID='"+ID+"'")
            self.conn.commit()
        except Exception:
            print(tostring(Exception)) 
        print ("Category Record changed successfully")
        self.conn.close()
	
    def update_device(self,ID,name,category,description,location):
        try:
            print("UPDATE Device SET Name='"+name+"',Category='"+category+"',Description='"+description+"',Location='"+location+"' WHERE ID='"+ID+"'")
            self.conn.execute("UPDATE Device SET Name='"+name+"',Category='"+category+"',Description='"+description+"',Location='"+location+"' WHERE ID='"+ID+"'")
            self.conn.commit()
        except Exception:
            print(tostring(Exception)) 
        print ("Device Record changed successfully")
        self.conn.close()

    def get_ID_SpecName(self,ID):
        if ID=='None':
            return '-'
        else:
            cursor = self.conn.execute("SELECT Name FROM Specialist WHERE ID = "+ID+"")
            result = cursor.fetchall()
            print(str(result[0][0])) 
            return str(result[0][0])

    def get_category_ID(self,name):
        cursor = self.conn.execute("SELECT ID FROM Category WHERE Name = '"+name+"'")
        result = cursor.fetchall()
        return str(result[0][0])
    
    def get_device_ID(self,name):
        cursor = self.conn.execute("SELECT ID FROM Device WHERE Name = '"+name+"'")
        result = cursor.fetchall()
        return str(result[0][0])
    
    def select_location(self):
        cursor = self.conn.execute("SELECT DISTINCT Location FROM Device ORDER BY Location")
        result = cursor.fetchall()
        msg=""
        for row in result:
            msg+=str(row[0])+"END_OF_ROW"
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

    def select_Device_id_name_instruction(self):
        cursor = self.conn.execute("SELECT Device.ID, Device.Name, Category.Specification FROM Device INNER JOIN Category ON Device.Category=Category.ID")
        result = cursor.fetchall()
        msg=""
        for row in result:
            msg+=str(row[0])+";"+str(row[1])+";"+str(row[2])+"END_OF_ROW"
        print("select_Device_id_name_instruction completed!")
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
