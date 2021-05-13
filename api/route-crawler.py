import requests
import bs4
import urllib.parse

with open('routes.txt', 'w', encoding='utf-8') as f:
    def find(url):
        res = requests.get(url)
        text = res.text

        soup = bs4.BeautifulSoup(text, "html.parser")
        iframe_url = soup.find('iframe')['src']

        full_url = urllib.parse.urljoin(url, iframe_url)

        res = requests.get(full_url)
        text = res.text
        soup = bs4.BeautifulSoup(text, "html.parser")

        table_rows = soup.findAll('tr', {'class': 'se-tr'})

        for row in table_rows:
            values = []
            for item in row:
                values.append(item.text.strip())
            if len(values) < 4:
                continue
            try:
                int(values[0])
            except Exception:
                continue
            row = values[1:]
            text = row[0]+'|'+','.join(row[1:])
            f.write(text+'\n')

    urls = ['https://blog.naver.com/sobrightlf/222036457697']
    for url in urls:
        find(url)