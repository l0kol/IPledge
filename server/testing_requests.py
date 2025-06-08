import requests
import json

# Configuration
API_URL = "http://localhost:8000/enhance-idea"  # Update if hosted elsewhere
IDEA_TEXT = """
I'm creating a 5-part mini-documentary series called "Forgotten Frontlines", which tells powerful, 
lesser-known stories from 20th-century conflicts—stories that never made it into mainstream history books. 
These are personal, human-centered narratives: a nurse on the Eastern Front, a resistance printer in WWII Yugoslavia, a North Korean defector's secret journal.
Each episode will be 12–15 minutes, shot cinematically with voiceovers, historical footage, and original scoring.
"""


def test_enhance_idea():
    payload = {
        "text": IDEA_TEXT,
        "enhance_with_search": True,  # Set to False to skip web search
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()

        print("API Response:")
        print(json.dumps(response.json(), indent=2))

    except requests.exceptions.RequestException as e:
        print(f"Error calling API: {e}")
        if hasattr(e, "response") and e.response:
            print(f"Status code: {e.response.status_code}")
            print(f"Response: {e.response.text}")


if __name__ == "__main__":
    test_enhance_idea()
