import json
from pathlib import Path

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


BASE_DIR = Path(__file__).resolve().parents[1]
WAIT_TIMEOUT = 10


def build_local_url(page_name: str) -> str:
    """Return the file:// URL for a given page."""
    return (BASE_DIR / page_name).resolve().as_uri()


@pytest.fixture
def driver():
    """Provide a headless Chrome WebDriver instance."""
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1280,900")
    drv = webdriver.Chrome(options=options)
    yield drv
    drv.quit()


def wait_for(driver, locator):
    """Utility to wait for an element to be visible."""
    return WebDriverWait(driver, WAIT_TIMEOUT).until(
        EC.visibility_of_element_located(locator)
    )


def test_signup_flow_redirects_to_profile(driver):
    driver.get(build_local_url("signup.html"))

    wait_for(driver, (By.ID, "signupForm"))

    driver.find_element(By.ID, "signup-name").send_keys("Tester QA")
    driver.find_element(By.ID, "signup-email").send_keys("tester@example.com")
    driver.find_element(By.ID, "signup-phone").send_keys("0987654321")
    driver.find_element(By.ID, "signup-address").send_keys("123 Test Street")
    driver.find_element(By.ID, "signup-password").send_keys("Secret123!")

    driver.find_element(By.CSS_SELECTOR, "#signupForm .auth-submit").click()

    WebDriverWait(driver, WAIT_TIMEOUT).until(
        EC.url_contains("profile.html")
    )
    wait_for(driver, (By.CSS_SELECTOR, "[data-profile-name]"))

    assert driver.find_element(By.CSS_SELECTOR, "[data-profile-name]").text == "Tester QA"
    assert driver.find_element(By.CSS_SELECTOR, "[data-profile-email]").text == "tester@example.com"


def test_signin_respects_existing_profile(driver):
    driver.get(build_local_url("signin.html"))

    session_user = {
        "name": "Seller Pro",
        "email": "seller@shop.test",
        "phone": "0123456789",
        "address": "Hanoi",
        "memberSince": 2020,
    }
    driver.execute_script(
        "window.sessionStorage.setItem('shopeeUser', arguments[0]);",
        json.dumps(session_user),
    )

    wait_for(driver, (By.ID, "signinForm"))
    driver.find_element(By.ID, "signin-email").send_keys("seller@shop.test")
    driver.find_element(By.ID, "signin-password").send_keys("Secret123!")
    driver.find_element(By.CSS_SELECTOR, "#signinForm .auth-submit").click()

    WebDriverWait(driver, WAIT_TIMEOUT).until(
        EC.url_contains("profile.html")
    )
    wait_for(driver, (By.CSS_SELECTOR, "[data-profile-name]"))

    assert driver.find_element(By.CSS_SELECTOR, "[data-profile-name]").text == "Seller Pro"
    assert driver.find_element(By.CSS_SELECTOR, "[data-profile-email]").text == "seller@shop.test"


def test_cart_page_shows_summary(driver):
    driver.get(build_local_url("cart.html"))

    wait_for(driver, (By.CLASS_NAME, "cart-item"))
    total = wait_for(driver, (By.ID, "cartTotal"))
    checkout_btn = wait_for(driver, (By.ID, "checkoutBtn"))

    assert total.text.strip() == "7.300.000đ"
    assert checkout_btn.is_enabled()
    assert len(driver.find_elements(By.CLASS_NAME, "cart-item")) > 0

