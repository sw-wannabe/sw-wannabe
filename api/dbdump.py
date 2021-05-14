import sqlite3

DB_FILE_NAME = './database.sqlite3'

# Create new database
con = sqlite3.connect(DB_FILE_NAME)
cur = con.cursor()

query_police = '''
select json_object('name',name,'category',category,'place',place,'date',date,'insert_time',insert_time,'owner_name',owner_name,'take_place',take_place,'keep_place',keep_place,'status',status,'contact',contact) from losts_police;
'''


query_seoul = '''
sqlite3 database.sqlite3 "select json_object('id',id,'name',name,'category',category,'place',place,'date',substr( date, 0, 11 ),'insert_time',insert_time,'description',description,'status',status,'reg_date',reg_date,'take_place',take_place,'company',company,'position',position) from losts_seoul limit 40000 offset 0;" > dump.txt
'''

# cur.execute(query)

with open('dump.txt', 'r', encoding='utf-8') as i:
    with open('bulk.json', 'w', encoding='utf-8') as o:
        for line in i:
            o.write('{"index":{}}\n')
            o.write(f"{line}")
