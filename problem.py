import requests
from bs4 import BeautifulSoup

url = "https://codeforces.com/contest/2123/problem/B"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

problem_div = soup.find("div", class_="problem-statement")
if problem_div:
    # Extract the clean text with minimal noise
    clean_text = problem_div.get_text(separator="\n", strip=True)
    print(clean_text)
else:
    print("Problem statement not found.")