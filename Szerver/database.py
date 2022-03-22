import sqlite3

class DataBase:
    def __init__(self):
        self.open_conn()
        self.close_conn()
    def operation(self,type):
        pass
    def open_conn(self):
        self.conn = sqlite3.connect('karbantartas.db')
        print("Opened karbantartas.db successfully")
    def close_conn(self):
        self.conn.close()
        print("Closed karbantartas.db successfully")










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
