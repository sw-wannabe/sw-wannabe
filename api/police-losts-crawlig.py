import sys
import requests
import bs4
import sqlite3


def get_detail(id):
    url = 'https://www.lost112.go.kr/find/findDetail.do'
    res = requests.post(url, {
        # 'page': 1,
        'ATC_ID': id,
        'FD_SN': 1
    })
    text = res.text
    soup = bs4.BeautifulSoup(text, 'html.parser')
    table = soup.find('div', {'class': 'find_info'})
    name = table.find('p', {'class': 'find_info_name'}
                      ).text.replace('습득물명 : ', '')
    print(name)
    attrs = table.findAll('li')
    # print(table, attrs)

    def _map(x):
        return x.find('p', {'class': 'find02'}).text.strip()

    attr_json = {
        'place': _map(attrs[2]),
        'category': _map(attrs[3]),
        'take_place': _map(attrs[4]),
        'keep_place': _map(attrs[5]),
        'status': _map(attrs[6]),
        'contact': _map(attrs[7]),
    }

    return attr_json


con = sqlite3.connect('./database.sqlite3')
cur = con.cursor()


def get_all(page):
    img_base_url = 'https://www.lost112.go.kr'
    url = 'https://www.lost112.go.kr/find/findList.do'
    res = requests.post(url, {
        'PRDT_CL_NM': '',
        'PRDT_CL_CD01': '',
        'PRDT_CL_CD02': '',
        'START_YMD': 20000315,
        'END_YMD': 20220514,
        'PRDT_NM': '',
        'DEP_PLACE': '',
        'SITE': '',
        'PLACE_SE_CD': '',
        'FD_LCT_CD': '',
        'IN_NM': '',
        'ATC_ID': '',
        'F_ATC_ID': '',
        'MDCD': '',
        'SRNO': '',
        'IMEI_NO': '',
        'MENU_NO': '',
        'pageIndex': page,
    })
    text = res.text
    soup = bs4.BeautifulSoup(text, 'html.parser')
    losts = soup.find('div', {'class': 'find_listBox'}
                      ).find('tbody').findAll('tr')

    def _map(x):
        return x.text.strip()

    for lost in losts:
        attr = lost.findAll('td')
        id = _map(attr[0])
        name = _map(attr[1])
        owner_name = _map(attr[2])
        date = _map(attr[5])
        info = {
            'id': id,
            'name': name,
            'owner_name': owner_name,
            'date': date
        }

        cur.execute('SELECT * FROM losts_police where id=?', [id])
        exists = cur.fetchone()
        if exists:
            print("It looks like we crawled all the data; exit crawling.")
            return False

        detail = get_detail(id)
        info.update(detail)

        columns = info.keys()
        query = f'INSERT OR IGNORE INTO losts_police ({ ",".join(columns) }) VALUES ({",".join(["?"]*len(columns))})'
        values = []
        for key in columns:
            values.append(info[key])
        cur.execute(query, values)
    return True


s = 0
e = 100
if len(sys.argv) == 3:
    s = int(sys.argv[1])
    e = int(sys.argv[2])

for i in range(s, e):
    print(f'Start crawling {i}')
    has_next = get_all(i)
    print(f'Finished crawling {i}')
    con.commit()
    if s == 0 and not has_next:
        break

losts = cur.execute('SELECT count(*) FROM losts_police').fetchall()
for row in losts:
    print(row)
