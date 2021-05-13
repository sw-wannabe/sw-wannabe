import sqlite3
import os

DB_FILE_NAME = './database.sqlite3'

# Remove existing database
try:
    os.unlink(DB_FILE_NAME)
except Exception:
    pass

# Create new database
con = sqlite3.connect(DB_FILE_NAME)
cur = con.cursor()

# Create table for police losts data
cur.execute('''
    CREATE TABLE losts_police (
        id TEXT PRIMARY KEY,
        name TEXT,
        category TEXT,
        place TEXT,
        date DATE,
        insert_time DATE,
        color TEXT
        img TEXT,
        num INTEGER
    );
''')

# Create table for seoul open api
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
