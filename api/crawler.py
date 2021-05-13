from urllib.parse import urlencode, quote_plus
import requests
import sqlite3
import xml.etree.ElementTree as ET
from datetime import datetime

con = sqlite3.connect('./database.sqlite3')
cur = con.cursor()


def query_police():
    base_url = 'http://apis.data.go.kr/1320000/LostGoodsInfoInqireService/getLostGoodsInfoAccToClAreaPd'
    service_key = 'hv2glkU2vkBs1Jez+lwGany2ShL5HiV/kzGHMKc3MwaYjFCfSPfNWsjMhJGJaPV4wKL8sPPa0qe0U/+c6Fc7bg=='
    query_params = '?' + urlencode({
        quote_plus('ServiceKey'): service_key,
        quote_plus('START_YMD'): '20170801',
        quote_plus('END_YMD'): '20171130',
        quote_plus('PRDT_CL_CD_01'): 'PRA000',
        quote_plus('PRDT_CL_CD_02'): 'PRA300',
        quote_plus('LST_LCT_CD'): 'LCA000',
        quote_plus('pageNo'): '1',
        quote_plus('numOfRows'): '10'
    })

    map_police = {
        'id': 'atcId',
        'place': 'lstPlace',
        'name': 'lstPrdtNm',
        'date': 'lstYmd',
        'category': 'prdtClNm',
        'insert_time': 'insert_time'
    }

    columns = map_police.keys()
    query = f'INSERT OR IGNORE INTO losts_police ({ ",".join(columns) }) VALUES ({",".join(["?"]*len(columns))})'

    url = base_url+query_params
    print(url)
    r = requests.get(url)
    text = r.text
    root = ET.fromstring(text)
    items = root[1][0]
    for item in items:
        attributes = {
            'insert_time': datetime.today().strftime('%Y-%m-%d-%H:%M:%S')
        }
        for attribute in item:
            attributes[attribute.tag] = attribute.text
        values = []
        for column in columns:
            values.append(attributes[map_police[column]])
        cur.execute(query, values)
    con.commit()


def query_seoul(start, end):
    service_key = '6867506c50756e6b37356b646f7652'
    url = f'http://openapi.seoul.go.kr:8088/{service_key}/json/lostArticleInfo/{start}/{end}/'
    print(url)
    r = requests.get(url)
    json = r.json()

    map_seoul = {
        'id': 'ID',
        'status': 'STATUS',
        'reg_date': 'REG_DATE',
        'date': 'GET_DATE',
        'description': 'GET_THING',
        'place': 'GET_AREA',
        'name': 'GET_NAME',
        'category': 'CATE',
        'take_place': 'TAKE_PLACE',
        'company': 'GET_POSITION',
        'position': 'GET_GOOD',
        'insert_time': 'insert_time'
    }

    columns = map_seoul.keys()
    query = f'INSERT OR IGNORE INTO losts_seoul ({ ",".join(columns) }) VALUES ({",".join(["?"]*len(columns))})'

    data = json["lostArticleInfo"]["row"]
    for row in data:
        row['insert_time'] = datetime.today().strftime('%Y-%m-%d-%H:%M:%S')
        values = []
        for column in columns:
            values.append(row[map_seoul[column]])
        cur.execute(query, values)
    con.commit()


# 데이터 몇 개 샘플로 가져옴
query_police()
query_seoul(0, 10)

SHOW_TEST = True
if SHOW_TEST:
    for row in cur.execute('SELECT * FROM losts_police').fetchall():
        print(row)

    for row in cur.execute('SELECT * FROM losts_seoul').fetchall():
        print(row)
