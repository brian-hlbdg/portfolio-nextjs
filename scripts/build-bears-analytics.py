"""Build compact regular-season Bears analytics from nflverse, using stdlib only.
Usage: python3 scripts/build-bears-analytics.py 2025
No deployment or external service credentials required.
"""
import csv
import gzip
import io
import json
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen

BASE = "https://github.com/nflverse/nflverse-data/releases/download"
def load(tag, name):
    with urlopen(f"{BASE}/{tag}/{name}", timeout=90) as response:
        raw = response.read()
        modified = response.headers.get("Last-Modified")
    if name.endswith(".gz"):
        raw = gzip.decompress(raw)
    reader = csv.DictReader(io.StringIO(raw.decode("utf-8-sig")))
    return list(reader), modified

def num(row, key):
    try:
        value = float(row.get(key, ""))
        return value if __import__("math").isfinite(value) else None
    except (ValueError, TypeError):
        return None

def rating(a,c,y,t,i):
    if not a: return None
    clamp=lambda v:max(0,min(2.375,v))
    return round((clamp((c/a-.3)*5)+clamp((y/a-3)*.25)+clamp(t/a*20)+clamp(2.375-i/a*25))/6*100,1)

def depth(y):
    return 0 if y>=20 else 1 if y>=10 else 2 if y>=0 else 3

def bucket(y):
    return 0 if y<=1 else 1 if y<=3 else 2 if y<=6 else 3 if y<=10 else 4

def run(year):
    rows, modified = load("pbp", f"play_by_play_{year}.csv.gz")
    required={"season_type","posteam","week","passer_player_id","pass_attempt","complete_pass","interception","pass_touchdown","passing_yards","air_yards","pass_location","epa","third_down_converted","third_down_failed","down","ydstogo","two_point_attempt","play_type"}
    if not rows or not required.issubset(rows[0]):
        raise ValueError("Missing required play-by-play columns")
    league=defaultdict(lambda:[0,0])
    team=defaultdict(lambda:[0,0])
    league_z=defaultdict(lambda:[0,0])
    player_z=defaultdict(lambda:defaultdict(lambda:[0,0,0.0,0]))
    player_week=defaultdict(lambda:defaultdict(lambda:[0,0,0,0,0]))
    all_pass=[0,0,0,0,0]
    names={}
    for r in rows:
        if r["season_type"]!="REG" or r["play_type"]=="no_play" or num(r,"two_point_attempt")==1: continue
        chi=r["posteam"]=="CHI"
        y=num(r,"ydstogo")
        conv=num(r,"third_down_converted")==1
        fail=num(r,"third_down_failed")==1
        if num(r,"down")==3 and y is not None and y>0 and (conv or fail):
            k=bucket(y)
            league[k][0]+=int(conv);league[k][1]+=1
            if chi: team[k][0]+=int(conv);team[k][1]+=1
        if num(r,"pass_attempt")!=1 or num(r,"sack")==1: continue
        pid=r["passer_player_id"]
        if not pid or pid=="NA": continue
        c=int(num(r,"complete_pass")==1); yards=num(r,"passing_yards") or 0
        t=int(num(r,"pass_touchdown")==1); i=int(num(r,"interception")==1)
        values=[1,c,yards,t,i]
        for j,v in enumerate(values): all_pass[j]+=v
        week=num(r,"week")
        if chi and week is not None:
            names[pid]=r.get("passer_player_name","")
            for j,v in enumerate(values): player_week[pid][int(week)][j]+=v
        air=num(r,"air_yards"); direction=r["pass_location"]
        if air is None or direction not in ("left","middle","right"): continue
        k=(depth(air),direction)
        league_z[k][0]+=c;league_z[k][1]+=1
        if chi:
            z=player_z[pid][k];z[0]+=c;z[1]+=1
            e=num(r,"epa")
            if e is not None:z[2]+=e;z[3]+=1
    result={"season":year,"source":"nflverse","retrievedAt":datetime.now(timezone.utc).isoformat(),"sourceModified":modified,"leagueRating":rating(*all_pass),"players":[],"thirdDown":[]}
    for k,label in enumerate(["1","2–3","4–6","7–10","11+"]):
        c,a=team[k];lc,la=league[k]
        if a and la:result["thirdDown"].append({"distance":label,"made":c,"total":a,"league":lc/la})
    for pid,weeks in player_week.items():
        totals=[sum(w[j] for w in weeks.values()) for j in range(5)]
        a,c,y,t,i=totals
        p={"gsisId":pid,"name":names[pid],"stats":[["PASS YDS",f"{int(y):,}"],["TD / INT",f"{t} / {i}"],["COMP %",f"{c/a*100:.1f}%"],["RATING",str(rating(*totals))]],"weeklyRatings":[{"week":w,"rating":rating(*v)} for w,v in sorted(weeks.items())],"passing":[]}
        for d,label in enumerate(["20+","10–19","0–9","Behind LOS"]):
            for j,direction in enumerate(["left","middle","right"]):
                c,a,e,ec=player_z[pid][(d,direction)];lc,la=league_z[(d,direction)]
                p["passing"].append({"id":f"{d}-{j}","depth":label,"direction":direction.title(),"attempts":a,"completions":c,"epa":e/ec if ec else None,"benchmark":lc/la if la else None})
        result["players"].append(p)
    # Map GSIS IDs to ESPN IDs without guessing by name.
    roster,_=load("rosters",f"roster_{year}.csv")
    if not roster or not {"gsis_id","espn_id"}.issubset(roster[0]): raise ValueError("Roster ID mapping schema missing")
    ids={r["gsis_id"]:r["espn_id"].split(".")[0] for r in roster if r.get("gsis_id") and r.get("espn_id") not in ("",None,"NA")}
    for p in result["players"]:p["espnId"]=ids.get(p["gsisId"])
    dest=Path("public/data/bears-intelligence")/f"{year}.json"
    dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(json.dumps(result,ensure_ascii=False,allow_nan=False),encoding="utf-8")
    print(f"Wrote {dest}: {len(result['players'])} passers")
if __name__=="__main__":
    year=int(sys.argv[1])
    if not 1999<=year<=datetime.now().year:raise ValueError("Invalid season")
    run(year)
