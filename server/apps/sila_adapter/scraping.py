import csv
import time
from urllib.request import urlopen, Request
from bs4 import BeautifulSoup

SCRAP_RESULT_CSV_PATH = "scraping_result.csv"
urls = [
    'https://bank.codes/us-routing-number/bank/ameris-bank/',
    'https://bank.codes/us-routing-number/bank/banco-popular/',
    'https://bank.codes/us-routing-number/bank/bancorp-south/',
    'https://bank.codes/us-routing-number/bank/bancorpsouth/',
    'https://bank.codes/us-routing-number/bank/bancorpsouth-bank/',
    'https://bank.codes/us-routing-number/bank/bank-of-america/',
    'https://bank.codes/us-routing-number/bank/bank-of-commerce/',
    'https://bank.codes/us-routing-number/bank/bank-of-hope/',
    'https://bank.codes/us-routing-number/bank/bank-of-new-york-mellon/',
    'https://bank.codes/us-routing-number/bank/bank-of-north-carolina/',
    'https://bank.codes/us-routing-number/bank/bank-of-the-ozarks/',
    'https://bank.codes/us-routing-number/bank/bank-of-the-west/',
    'https://bank.codes/us-routing-number/bank/bankplus/',
    'https://bank.codes/us-routing-number/bank/banner-bank/',
    'https://bank.codes/us-routing-number/bank/bear-state-bank/',
    'https://bank.codes/us-routing-number/bank/berkshire-bank/',
    'https://bank.codes/us-routing-number/bank/bmo-harris-bank/',
    'https://bank.codes/us-routing-number/bank/branch-banking-trust-company/',
    'https://bank.codes/us-routing-number/bank/busey-bank/',
    'https://bank.codes/us-routing-number/bank/byline-bank/',
    'https://bank.codes/us-routing-number/bank/cadence-bank/',
    'https://bank.codes/us-routing-number/bank/camden-national-bank/',
    'https://bank.codes/us-routing-number/bank/capital-bank-corporation/',
    'https://bank.codes/us-routing-number/bank/capital-bank/',
    'https://bank.codes/us-routing-number/bank/capital-city-bank/',
    'https://bank.codes/us-routing-number/bank/capital-one/',
    'https://bank.codes/us-routing-number/bank/cathay-bank/',
    'https://bank.codes/us-routing-number/bank/centennial-bank/',
    'https://bank.codes/us-routing-number/bank/central-bank/',
    'https://bank.codes/us-routing-number/bank/chemical-bank/',
    'https://bank.codes/us-routing-number/bank/citibank/',
    'https://bank.codes/us-routing-number/bank/citibank-west/',
    'https://bank.codes/us-routing-number/bank/citizens-bank/',
    'https://bank.codes/us-routing-number/bank/citizens-business-bank/',
    'https://bank.codes/us-routing-number/bank/citizens-national-bank/',
    'https://bank.codes/us-routing-number/bank/citizens-state-bank/',
    'https://bank.codes/us-routing-number/bank/city-national-bank/',
    'https://bank.codes/us-routing-number/bank/columbia-state-bank/',
    'https://bank.codes/us-routing-number/bank/comerica-bank/',
    'https://bank.codes/us-routing-number/bank/commerce-bank/',
    'https://bank.codes/us-routing-number/bank/commercial-bank/',
    'https://bank.codes/us-routing-number/bank/community-bank/',
    'https://bank.codes/us-routing-number/bank/community-first-bank/',
    'https://bank.codes/us-routing-number/bank/community-national-bank/',
    'https://bank.codes/us-routing-number/bank/community-state-bank/',
    'https://bank.codes/us-routing-number/bank/compass-bank/',
    'https://bank.codes/us-routing-number/bank/cornerstone-bank/',
    'https://bank.codes/us-routing-number/bank/credit-union-of-southern-california/',
    'https://bank.codes/us-routing-number/bank/east-west-bank/',
    'https://bank.codes/us-routing-number/bank/eastern-bank/',
    'https://bank.codes/us-routing-number/bank/farmers-merchants-bank/',
    'https://bank.codes/us-routing-number/bank/farmers-bank/',
    'https://bank.codes/us-routing-number/bank/farmers-state-bank/',
    'https://bank.codes/us-routing-number/bank/federal-reserve-bank/',
    'https://bank.codes/us-routing-number/bank/fidelity-bank/',
    'https://bank.codes/us-routing-number/bank/fifth-third-bank/',
    'https://bank.codes/us-routing-number/bank/financial-partners-credit-union/',
    'https://bank.codes/us-routing-number/bank/first-bank/',
    'https://bank.codes/us-routing-number/bank/first-bank-trust/',
    'https://bank.codes/us-routing-number/bank/first-citizens-bank-trust-company/',
    'https://bank.codes/us-routing-number/bank/first-community-bank/',
    'https://bank.codes/us-routing-number/bank/first-fidelity-bank/',
    'https://bank.codes/us-routing-number/bank/first-financial-bank/',
    'https://bank.codes/us-routing-number/bank/first-merchants-bank/',
    'https://bank.codes/us-routing-number/bank/first-midwest-bank/',
    'https://bank.codes/us-routing-number/bank/first-national-bank/',
    'https://bank.codes/us-routing-number/bank/first-national-bank-of-omaha/',
    'https://bank.codes/us-routing-number/bank/first-national-bank-of-pennsylvania/',
    'https://bank.codes/us-routing-number/bank/first-savings-bank/',
    'https://bank.codes/us-routing-number/bank/first-security-bank/',
    'https://bank.codes/us-routing-number/bank/first-state-bank/',
    'https://bank.codes/us-routing-number/bank/first-tennessee-bank/',
    'https://bank.codes/us-routing-number/bank/firstbank/',
    'https://bank.codes/us-routing-number/bank/frandsen-bank-trust/',
    'https://bank.codes/us-routing-number/bank/german-american-bancorp/',
    'https://bank.codes/us-routing-number/bank/glacier-bank/',
    'https://bank.codes/us-routing-number/bank/grandpoint-bank/',
    'https://bank.codes/us-routing-number/bank/great-lakes-credit-union/',
    'https://bank.codes/us-routing-number/bank/great-southern-bank/',
    'https://bank.codes/us-routing-number/bank/great-western-bank/',
    'https://bank.codes/us-routing-number/bank/heritage-bank/',
    'https://bank.codes/us-routing-number/bank/horizon-credit-union/',
    'https://bank.codes/us-routing-number/bank/hsbc-bank/',
    'https://bank.codes/us-routing-number/bank/huntington-national-bank/',
    'https://bank.codes/us-routing-number/bank/iberiabank/',
    'https://bank.codes/us-routing-number/bank/independent-bank/',
    'https://bank.codes/us-routing-number/bank/interbank/',
    'https://bank.codes/us-routing-number/bank/international-bank-of-commerce/',
    'https://bank.codes/us-routing-number/bank/jpmorgan-chase/',
    'https://bank.codes/us-routing-number/bank/key-bank/',
    'https://bank.codes/us-routing-number/bank/keybank/',
    'https://bank.codes/us-routing-number/bank/liberty-bank/',
    'https://bank.codes/us-routing-number/bank/m-t-bank/',
    'https://bank.codes/us-routing-number/bank/m-b-financial-bank/',
    'https://bank.codes/us-routing-number/bank/mainsource-bank/',
    'https://bank.codes/us-routing-number/bank/mufg-union-bank/',
    'https://bank.codes/us-routing-number/bank/nbh-bank/',
    'https://bank.codes/us-routing-number/bank/new-york-community-bank/',
    'https://bank.codes/us-routing-number/bank/pacific-western-bank/',
    'https://bank.codes/us-routing-number/bank/park-national-bank/',
    'https://bank.codes/us-routing-number/bank/pentagon-federal-credit-union/',
    'https://bank.codes/us-routing-number/bank/peoples-bank/',
    'https://bank.codes/us-routing-number/bank/peoples-state-bank/',
    'https://bank.codes/us-routing-number/bank/pinnacle-bank/',
    'https://bank.codes/us-routing-number/bank/pioneer-bank-ssb/',
    'https://bank.codes/us-routing-number/bank/pnc-bank-inc-baltimore/',
    'https://bank.codes/us-routing-number/bank/pnc-bank/',
    'https://bank.codes/us-routing-number/bank/prosperity-bank/',
    'https://bank.codes/us-routing-number/bank/regions-bank/',
    'https://bank.codes/us-routing-number/bank/renasant-bank/',
    'https://bank.codes/us-routing-number/bank/s-t-bank/',
    'https://bank.codes/us-routing-number/bank/santander-bank/',
    'https://bank.codes/us-routing-number/bank/security-bank/',
    'https://bank.codes/us-routing-number/bank/security-state-bank/',
    'https://bank.codes/us-routing-number/bank/self-help-credit-union/',
    'https://bank.codes/us-routing-number/bank/simmons-first-national-bank/',
    'https://bank.codes/us-routing-number/bank/simmons-first-natl-bk/',
    'https://bank.codes/us-routing-number/bank/south-state-bank/',
    'https://bank.codes/us-routing-number/bank/state-bank-and-trust-company/',
    'https://bank.codes/us-routing-number/bank/sterling-national-bank/',
    'https://bank.codes/us-routing-number/bank/stonegate-bank/',
    'https://bank.codes/us-routing-number/bank/td-bank/',
    'https://bank.codes/us-routing-number/bank/the-huntington-national-bank/',
    'https://bank.codes/us-routing-number/bank/the-peoples-bank/',
    'https://bank.codes/us-routing-number/bank/trustmark-national-bank/',
    'https://bank.codes/us-routing-number/bank/umb/',
    'https://bank.codes/us-routing-number/bank/umpqua-bank/',
    'https://bank.codes/us-routing-number/bank/unify-financial-federal-credit-union/',
    'https://bank.codes/us-routing-number/bank/union-bank-trust/',
    'https://bank.codes/us-routing-number/bank/union-state-bank/',
    'https://bank.codes/us-routing-number/bank/united-bank/',
    'https://bank.codes/us-routing-number/bank/united-bank-capital-trust-company/',
    'https://bank.codes/us-routing-number/bank/united-community-bank/',
    'https://bank.codes/us-routing-number/bank/us-bank/',
    'https://bank.codes/us-routing-number/bank/usalliance-federal-credit-union/',
    'https://bank.codes/us-routing-number/bank/valley-national-bank/',
    'https://bank.codes/us-routing-number/bank/webster-bank/',
    'https://bank.codes/us-routing-number/bank/wells-fargo-bank/',
    'https://bank.codes/us-routing-number/bank/wesbanco-bank-inc/',
    'https://bank.codes/us-routing-number/bank/whitney-bank/',
    'https://bank.codes/us-routing-number/bank/xenith-bank/'
]


def scrap_routing_numbers(url: str) -> None:
    """Scrp routing numbers from https://bank.codes/us-routing-number"""
    headers = {
        'User-Agent': ("Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like "
                       "Gecko) Chrome/41.0.2228.0 Safari/537.3")
    }
    req = Request(url=url, headers=headers)
    html = urlopen(req).read()
    soup = BeautifulSoup(html)
    tbody = soup.find("table").find("tbody")
    rn_sections = tbody.find_all("a")
    routing_numbers = list(map(lambda x: x.text, rn_sections))
    bank_name = soup.find(None, {"class": "breadcrumb"}).find_all("a")[-1].text
    with open(SCRAP_RESULT_CSV_PATH, "a") as csvfile:
        csv_writer = csv.writer(csvfile)
        for routing_number in routing_numbers:
            csv_writer.writerow([bank_name, routing_number])


def scrap_all_routing_numbers():
    for url in urls:
        scrap_routing_numbers(url)
        time.sleep(0.5)
