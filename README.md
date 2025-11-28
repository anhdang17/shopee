# shopee

Shopee front-end with fully functionality

![image](https://github.com/lucthienphong1120/shopee/assets/90561566/a8ec276c-6d54-483a-84f5-dd5e841827dd)

## UI automation tests

The project ships with Selenium end-to-end tests that exercise the signup, signin, and cart flows directly against the static HTML files.

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements-test.txt
pytest tests/test_ui_flows.py
```

> **Note:** The tests expect a recent Chrome/Chromium plus the matching ChromeDriver in your `PATH`. They open the local `file://` pages and rely on `WebDriverWait` for all interactions, avoiding any brittle `time.sleep` calls.
