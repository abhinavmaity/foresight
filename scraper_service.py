from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class ScrapeRequest(BaseModel):
    url: HttpUrl

class LeadInfo(BaseModel):
    company_name: Optional[str]
    title: Optional[str]
    description: Optional[str]
    emails: List[str] = []
    phones: List[str] = []
    logo_url: Optional[str]
    raw_html_snippet: Optional[str]

# Updated email regex
EMAIL_REGEX = re.compile(r"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co\.in|org|net|gov|edu|info))")

# Updated phone number regex to handle more formats
# It will match numbers like:
# +1 123 456 7890, (123) 456-7890, 123-456-7890, 1234567890, etc.
PHONE_REGEX = re.compile(r"(\+?\d{1,3}[.\-\s]?)?(\(?\d{2,4}\)?[.\-\s]?)?(\d{1,4}[.\-\s]?)?(\d{3}[.\-\s]?)?(\d{3,4})")

# Function to fetch page content using Selenium
def fetch_page_content(url: str) -> str:
    try:
        options = Options()
        options.add_argument("--headless")  # Run headless
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-gpu")

        # Start the Selenium WebDriver
        logger.info(f"Starting WebDriver to fetch page: {url}")
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        
        # Fetch the page
        driver.get(url)
        logger.info(f"Page loaded, waiting for it to be ready: {url}")
        driver.implicitly_wait(10)  # Wait for the page to load
        html = driver.page_source
        logger.info(f"Successfully fetched the page content for {url}")
        
        # Close the driver
        driver.quit()
        
        return html
    except Exception as e:
        logger.error(f"Error occurred while fetching the page: {e}")
        raise HTTPException(status_code=502, detail=f"Error fetching page: {e}")

@app.post("/scrape", response_model=LeadInfo)
async def scrape_lead(request: ScrapeRequest):
    url = str(request.url)  # Convert the HttpUrl to a string here
    logger.info(f"Received request to scrape URL: {url}")
    
    try:
        html = fetch_page_content(url)  # Pass the URL as a string
    except HTTPException as e:
        logger.error(f"HTTP error: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
    # Parsing HTML with BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")
    company_name = soup.title.string.strip() if soup.title else None
    title_tag = soup.find("h1") or soup.title
    title = title_tag.get_text(strip=True) if title_tag else None
    description = soup.find("meta", attrs={"name": "description"})["content"] if soup.find("meta", attrs={"name": "description"}) else None
    logo_url = soup.find("meta", property="og:image")["content"] if soup.find("meta", property="og:image") else None
    
    # Debugging: Print HTML snippet for inspection
    raw_html_snippet = html[:500] + '...' if html else None
    logger.info(f"Raw HTML Snippet: {raw_html_snippet}")

    # Extract emails and phones
    emails = [email[0] for email in EMAIL_REGEX.findall(html)]  # Extract only the email part
    phones = list(set(parse_phone_numbers(html)))  # Parse phone numbers properly

    # Debugging: Print emails and phones to verify extraction
    logger.info(f"Extracted Emails: {emails}")
    logger.info(f"Extracted Phones: {phones}")

    return LeadInfo(
        company_name=company_name,
        title=title,
        description=description,
        emails=emails,
        phones=phones,
        logo_url=logo_url,
        raw_html_snippet=raw_html_snippet
    )



def parse_phone_numbers(html: str):
    phone_numbers = []
    # Find all phone number matches using the regex
    for match in PHONE_REGEX.findall(html):
        # Join the parts of the tuple into a single string
        phone_number = ''.join(match).strip()
        # Debugging: Check the raw phone number
        logger.info(f"Found phone number part: {phone_number}")
        # Ensure the number has at least 10 digits (ignoring non-numeric characters)
        if len(re.sub(r"\D", "", phone_number)) >= 10:  # Only 10 digits or more
            phone_numbers.append(phone_number)
    return phone_numbers