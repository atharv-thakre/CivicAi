import subprocess
from datetime import datetime


def Push():
    commit_message = f"Audit update - {datetime.utcnow()}"

    subprocess.run(["git", "add", "blockchain/records.json"])

    subprocess.run([
        "git",
        "commit",
        "-m",
        commit_message
    ])

    subprocess.run([
        "git",
        "push",
        "origin",
        "main"
    ])