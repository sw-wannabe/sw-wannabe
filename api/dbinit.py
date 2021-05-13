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
        place TEXT,
        name TEXT,
        title TEXT,
        date DATE,
        category TEXT,
        number INTEGER
    );
''')

# Create table for seoul open api
cur.execute('''
    CREATE TABLE losts_seoul (
        id TEXT PRIMARY KEY,
        status TEXT,
        date DATE,
        get DATE,
        description TEXT,
        take_id TEXT,
        place TEXT,
        name TEXT,
        category TEXT,
        area TEXT,
        position TEXT,
        good TEXT
    );
''')
