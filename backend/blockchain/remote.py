import os
import json
import base64
import requests
from bin.config import GITHUB_TOKEN, GITHUB_USERNAME, REPO_NAME, BRANCH, RECORD_FILE_PATH


headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}


def push_to_github():
    with open(RECORD_FILE_PATH, "r") as f:
        content = f.read()
    encoded_content = base64.b64encode(content.encode("utf-8")).decode("utf-8")
    # Step 1: Get existing file SHA
    url = f"https://api.github.com/repos/{GITHUB_USERNAME}/{REPO_NAME}/contents/records.json"

    response = requests.get(url, headers=headers)

    sha = None
    if response.status_code == 200:
        sha = response.json()["sha"]

    # Step 2: Update file
    payload = {
        "message": "Audit blockchain updated",
        "content": encoded_content,
        "branch": BRANCH
    }

    if sha:
        payload["sha"] = sha

    update_response = requests.put(
        url,
        headers=headers,
        json=payload
    )

    print(update_response.json())

def get_commit_diff(commit_sha, file_name="records.json"):

    url = f"https://api.github.com/repos/{GITHUB_USERNAME}/{REPO_NAME}/commits/{commit_sha}"

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        data = response.json()

        for file in data.get("files", []):
            if file["filename"] == file_name:
                patch = file.get("patch", "No patch data available")
                return patch
        return None

    except requests.exceptions.RequestException as e:
        print("GitHub API Error:", str(e))
        return None

