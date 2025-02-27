import requests
from bs4 import BeautifulSoup

def fetch_html(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.text

def extract_odds():
    url = "https://eurovisionworld.com/odds/eurovision"
    html = fetch_html(url)
    soup = BeautifulSoup(html, "html.parser")
    print(soup.prettify())
    results = []

    country_elements = soup.find_all("a", title=True, href=True)

    for country_element in country_elements:
        title = country_element["title"]
        if title.startswith("Eurovision 2025 "):
            country_name = title.replace("Eurovision 2025 ", "")
            odd_element = country_element.next_element.next_element
            #print (country_name, odd_element)

            if odd_element:
                odd = odd_element.get_text(strip=True)
                results.append({"country": country_name, "odd": odd})

    return results if results else [{"error": "Nenhuma odd encontrada"}]

extract_odds()