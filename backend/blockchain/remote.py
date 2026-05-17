# blockchain/remote.py

import json
import base64
import requests
from bin.config import GITHUB_TOKEN, GITHUB_USERNAME, REPO_NAME, BRANCH, RECORD_FILE_PATH


headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}


def push():
    with open(RECORD_FILE_PATH, "r") as f:
        content = f.read()

    encoded_content = base64.b64encode(content.encode("utf-8")).decode("utf-8")

    url = f"https://api.github.com/repos/{GITHUB_USERNAME}/{REPO_NAME}/contents/records.json"

    response = requests.get(url, headers=headers)

    sha = None
    if response.status_code == 200:
        sha = response.json()["sha"]

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

    if update_response.status_code in [200, 201]:
        return update_response.json()["commit"]["sha"]

    return None


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


def get_records_by_commit(commit_sha):
    url = f"https://api.github.com/repos/{GITHUB_USERNAME}/{REPO_NAME}/contents/records.json?ref={commit_sha}"

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        encoded_content = response.json()["content"]
        decoded_content = base64.b64decode(encoded_content).decode("utf-8")
        return json.loads(decoded_content)

    return None