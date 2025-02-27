import re
import requests

def extract_odds():
    url = "https://eurovisionworld.com/odds/eurovision"
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    html = response.text
    
    pattern = re.compile(r'title="Eurovision 2025 (\w+).*?data-prb="([\d.]+)"')
    results = []

    matches = pattern.findall(html)
    
    for country, odd in matches:
        results.append({"country": country, "odd": odd})

    print(results)

    return results if results else [{"error": "Nenhuma odd encontrada"}]

