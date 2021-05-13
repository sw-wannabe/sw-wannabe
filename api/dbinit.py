import sqlite3
import os
from sqlite3.dbapi2 import Error

DB_FILE_NAME = './database.sqlite3'

# Create new database
con = sqlite3.connect(DB_FILE_NAME)
cur = con.cursor()

INIT_POLICE = True
INIT_SEOUL = False

# Create table for police losts data
if INIT_POLICE:
    print("Initialize losts_police table")
    try:
        cur.execute('DROP TABLE losts_police')
    except Error:
        pass
    cur.execute('''
        CREATE TABLE losts_police (
            id TEXT PRIMARY KEY,
            name TEXT,
            owner_name TEXT,
            date DATE,
            place TEXT,
            category TEXT,
            take_place TEXT,
            keep_place TEXT,
            img TEXT,
            status TEXT,
            contact TEXT
        );
    ''')
con.commit()

# Create table for seoul open api
if INIT_SEOUL:
    print("Initialize losts_seoul table")
    cur.execute('DROP TABLE losts_seoul')
    cur.execute('''
        CREATE TABLE losts_seoul (
            id TEXT PRIMARY KEY,
            name TEXT,
            category TEXT,
            place TEXT,
            date DATE,
            insert_time DATE,

            description TEXT,
            status TEXT,
            reg_date DATE,
            take_place TEXT,
            company TEXT,
            position TEXT
        );
    ''')
con.commit()
