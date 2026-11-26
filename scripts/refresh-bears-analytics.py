"""Refresh one NFL season, validating before accepting the new snapshot."""
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

def read(path):
    return json.loads(path.read_text(encoding="utf-8"))

def validate(data, year, old):
    if data.get("season") != year or data.get("source") != "nflverse":
        raise ValueError("Unexpected season or source")
    for key in ("roster", "players", "games", "matchupTeams"):
        if not isinstance(data.get(key), list) or not data[key]:
            raise ValueError("Missing or empty " + key)
    for key in ("teamIdentity", "defense", "redzone"):
        if not isinstance(data.get(key), dict):
            raise ValueError("Missing " + key)
    games = {g["id"]: g for g in data["games"]}
    if len(games) != len(data["games"]):
        raise ValueError("Duplicate games")
    if old:
        for game in old.get("games", []):
            if game["id"] not in games:
                raise ValueError("Previously recorded game missing")
            if game.get("final") and not games[game["id"]].get("final"):
                raise ValueError("Previously final game no longer final")
        if old.get("depthChart") and not data.get("depthChart"):
            raise ValueError("Previously available depth chart missing")

def meaningful(data):
    return {k: v for k, v in data.items() if k not in ("retrievedAt", "sourceModified")}

def main():
    now = datetime.now(timezone.utc)
    year = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1] else now.year - (now.month < 9)
    path = Path("public/data/bears-intelligence") / f"{year}.json"
    original = path.read_bytes() if path.exists() else None
    old = read(path) if original is not None else None
    try:
        subprocess.run([sys.executable, "scripts/build-bears-analytics.py", str(year)], check=True)
        new = read(path)
        validate(new, year, old)
        if old is not None and meaningful(old) == meaningful(new):
            path.write_bytes(original)
            print("No meaningful change")
        else:
            print("Validated changed dataset:", path)
    except BaseException:
        if original is not None:
            path.write_bytes(original)
        elif path.exists():
            path.unlink()
        raise

if __name__ == "__main__":
    main()
