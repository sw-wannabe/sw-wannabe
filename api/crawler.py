from urllib.parse import urlencode, quote_plus
import requests
import sqlite3
import xml.etree.ElementTree as ET

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
        'atcId': 'id',
        'lstPlace': 'place',
        'lstPrdtNm': 'name',
        'lstSbjt': 'title',
        'lstYmd': 'date',
        'prdtClNm': 'category',
        'rnum': 'number'
    }

    keys = map_police.keys()
    columns = []
    for key in keys:
        columns.append(map_police[key])
    query = f'REPLACE INTO losts_police ({ ",".join(columns) }) VALUES ({",".join(["?"]*len(keys))})'

    url = base_url+query_params
    print(url)
    r = requests.get(url)
    text = r.text
    root = ET.fromstring(text)
    items = root[1][0]
    for item in items:
        values = []
        for attribute in item:
            values.append(attribute.text)
        cur.execute(query, values)
    con.commit()


def query_seoul(start, end):
    service_key = '6867506c50756e6b37356b646f7652'
    url = f'http://openapi.seoul.go.kr:8088/{service_key}/json/lostArticleInfo/{start}/{end}/'
    print(url)
    r = requests.get(url)
    json = r.json()

    map_seoul = {
        'ID': 'id',
        'STATUS': 'status',
        'REG_DATE': 'date',
        'GET_DATE': 'get',
        'GET_THING': 'description',
        'TAKE_PLACE': 'place',
        'TAKE_ID': 'take_id',
        'GET_NAME': 'name',
        'CATE': 'category',
        'GET_AREA': 'area',
        'GET_POSITION': 'position',
        'GET_GOOD': 'good'
    }

    keys = map_seoul.keys()
    columns = []
    for key in keys:
        columns.append(map_seoul[key])

    query = f'REPLACE INTO losts_seoul ({ ",".join(columns) }) VALUES ({",".join(["?"]*len(keys))})'

    data = json["lostArticleInfo"]["row"]
    for row in data:
        values = []
        for key in keys:
            values.append(row[key])
        cur.execute(query, values)
    con.commit()


query_police()
query_seoul(0, 10)

# for row in cur.execute('SELECT * FROM losts_police').fetchall():
#     print(row)

# for row in cur.execute('SELECT * FROM losts_seoul').fetchall():
#     print(row)
