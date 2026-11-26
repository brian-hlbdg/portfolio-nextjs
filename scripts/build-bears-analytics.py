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
from redzone import RedZone
from defense import Defense
from team_identity import TeamIdentity
from game_drives import GameDrives
from depth_chart import normalize_depth

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
    passer_totals=defaultdict(lambda:[0,0,0,0,0])
    passer_teams=defaultdict(set)
    team_games=defaultdict(set)
    rushing=defaultdict(lambda:defaultdict(lambda:[0,0,0,0,0,0.0,0,0]))
    rush_weeks=defaultdict(lambda:defaultdict(lambda:[0,0]))
    rush_league=defaultdict(lambda:[0,0])
    rush_names={}
    rush_columns={"rush_attempt","rusher_player_id","rushing_yards","rush_touchdown","run_location","run_gap","qb_kneel"}
    if not rush_columns.issubset(rows[0]):raise ValueError("Missing rushing columns")
    receiving=defaultdict(lambda:[0,0,0,0,0,0,0,0,0,0])
    rec_weeks=defaultdict(lambda:defaultdict(lambda:[0,0,0]))
    rec_zones=defaultdict(lambda:defaultdict(lambda:[0,0,0,0,0]))
    rec_league=defaultdict(lambda:[0,0])
    connections=defaultdict(lambda:defaultdict(lambda:[0,0,0,0]))
    rec_names={}
    if not {"receiver_player_id","receiving_yards","yards_after_catch","first_down_pass"}.issubset(rows[0]):raise ValueError("Missing receiving columns")
    redzone=RedZone()
    defense=Defense(rows[0])
    identity=TeamIdentity()
    games=GameDrives()
    if not {'defteam','yards_gained','qb_spike','fumble_lost','sack'}.issubset(rows[0]):raise ValueError('Missing team identity columns')
    if not {"yardline_100","game_id","drive"}.issubset(rows[0]):raise ValueError("Missing red-zone columns")
    for r in rows:
        if r["season_type"]=="REG":games.observe(r,num)
        if r["season_type"]!="REG" or r["play_type"]=="no_play" or num(r,"two_point_attempt")==1: continue
        redzone.observe(r,num)
        defense.observe(r,num)
        identity.observe(r,num)
        chi=r["posteam"]=="CHI"
        if r.get("game_id") and r["posteam"] not in ("","NA"):
            team_games[r["posteam"]].add(r["game_id"])
        y=num(r,"ydstogo")
        conv=num(r,"third_down_converted")==1
        fail=num(r,"third_down_failed")==1
        if num(r,"down")==3 and y is not None and y>0 and (conv or fail):
            k=bucket(y)
            league[k][0]+=int(conv);league[k][1]+=1
            if chi: team[k][0]+=int(conv);team[k][1]+=1
        if num(r,"rush_attempt")==1 and num(r,"qb_kneel")!=1:
            rid=r.get("rusher_player_id")
            gain=num(r,"rushing_yards")
            if rid and rid!="NA" and gain is not None:
                loc=r.get("run_location")
                gap=r.get("run_gap")
                lane="middle" if loc=="middle" else f"{loc}_{gap}" if loc in ("left","right") and gap in ("end","tackle","guard") else "unknown"
                rush_league[lane][0]+=1
                rush_league[lane][1]+=gain
                if chi:
                    rush_names[rid]=r.get("rusher_player_name","")
                    v=rushing[rid][lane]
                    v[0]+=1;v[1]+=gain;v[2]+=int(num(r,"rush_touchdown")==1)
                    v[3]+=int(gain>=10);v[4]+=int(gain>=20)
                    e=num(r,"epa")
                    if e is not None:v[5]+=e;v[6]+=1;v[7]+=int(e>0)
                    w=num(r,"week")
                    if w is not None:
                        rush_weeks[rid][int(w)][0]+=1
                        rush_weeks[rid][int(w)][1]+=gain
        if num(r,"pass_attempt")!=1 or num(r,"sack")==1: continue
        pid=r["passer_player_id"]
        if not pid or pid=="NA": continue
        c=int(num(r,"complete_pass")==1); yards=num(r,"passing_yards") or 0
        t=int(num(r,"pass_touchdown")==1); i=int(num(r,"interception")==1)
        receiver=r.get("receiver_player_id")
        if receiver and receiver!="NA":
            air_rec=num(r,"air_yards"); loc_rec=r["pass_location"]
            classified=air_rec is not None and loc_rec in ("left","middle","right")
            if classified:
                rk=(depth(air_rec),loc_rec)
                rec_league[rk][0]+=c;rec_league[rk][1]+=1
            if chi:
                rec_names[receiver]=r.get("receiver_player_name","")
                rv=receiving[receiver]
                gain=(num(r,"receiving_yards") or 0) if c else 0
                rv[0]+=1;rv[1]+=c;rv[2]+=gain;rv[3]+=t
                rv[4]+=int(c and num(r,"first_down_pass")==1)
                yac=num(r,"yards_after_catch")
                if c and yac is not None:rv[5]+=yac;rv[6]+=1
                if air_rec is not None:rv[7]+=air_rec;rv[8]+=1
                rv[9]+=int(c and gain>=20)
                w=num(r,"week")
                if w is not None:
                    v=rec_weeks[receiver][int(w)];v[0]+=1;v[1]+=c;v[2]+=gain
                if classified:
                    v=rec_zones[receiver][rk];v[0]+=1;v[1]+=c;v[2]+=gain
                    e=num(r,"epa")
                    if e is not None:v[3]+=e;v[4]+=1
                pair=connections[receiver][pid]
                pair[0]+=1;pair[1]+=c;pair[2]+=gain;pair[3]+=t
        values=[1,c,yards,t,i]
        for j,v in enumerate(values):
            all_pass[j]+=v
            passer_totals[pid][j]+=v
        passer_teams[pid].add(r["posteam"])
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
    def metrics(v):
        a,c,y,t,i=v
        return [rating(*v), c/a*100, y/a, t/a*100, i/a*100]
    qualified={pid:metrics(v) for pid,v in passer_totals.items() if v[0]>=14*max((len(team_games[t]) for t in passer_teams[pid]),default=1)}
    result["qualifiedPassers"]=len(qualified)
    for pid,weeks in player_week.items():
        totals=[sum(w[j] for w in weeks.values()) for j in range(5)]
        a,c,y,t,i=totals
        p={"gsisId":pid,"name":names[pid],"stats":[["PASS YDS",f"{int(y):,}"],["TD / INT",f"{t} / {i}"],["COMP %",f"{c/a*100:.1f}%"],["RATING",str(rating(*totals))]],"weeklyRatings":[{"week":w,"rating":rating(*v)} for w,v in sorted(weeks.items())],"passing":[]}
        for d,label in enumerate(["20+","10–19","0–9","Behind LOS"]):
            for j,direction in enumerate(["left","middle","right"]):
                c,a,e,ec=player_z[pid][(d,direction)];lc,la=league_z[(d,direction)]
                p["passing"].append({"id":f"{d}-{j}","depth":label,"direction":direction.title(),"attempts":a,"completions":c,"epa":e/ec if ec else None,"benchmark":lc/la if la else None})
        if pid in qualified and len(passer_teams[pid])==1:
            values=qualified[pid]
            labels=["Passer rating","Completion","Yards / attempt","TD rate","INT rate"]
            p["ranks"]=[{"label":label,"value":f"{values[j]:.1f}"+("%" if j in (1,3,4) else ""),"rank":1+sum((v[j]<values[j] if j==4 else v[j]>values[j]) for v in qualified.values())} for j,label in enumerate(labels)]
        result["players"].append(p)
    # Map GSIS IDs to ESPN IDs without guessing by name.
    roster,_=load("rosters",f"roster_{year}.csv")
    if not roster or not {"gsis_id","espn_id"}.issubset(roster[0]): raise ValueError("Roster ID mapping schema missing")
    ids={r["gsis_id"]:r["espn_id"].split(".")[0] for r in roster if r.get("gsis_id") and r.get("espn_id") not in ("",None,"NA")}
    for p in result["players"]:p["espnId"]=ids.get(p["gsisId"])
    result["rushing"]=[]
    lanes=["left_end","left_tackle","left_guard","middle","right_guard","right_tackle","right_end","unknown"]
    for rid,by_lane in rushing.items():
        total=[sum(v[j] for v in by_lane.values()) for j in range(8)]
        a,y,td,ten,twenty,epa,ec,success=total
        result["rushing"].append({"gsisId":rid,"espnId":ids.get(rid),"name":rush_names[rid],
            "attempts":a,"yards":y,"touchdowns":td,"explosive10":ten,"explosive20":twenty,
            "successRate":success/ec if ec else None,"epa":epa/ec if ec else None,
            "weeks":[{"week":w,"attempts":v[0],"yards":v[1]} for w,v in sorted(rush_weeks[rid].items())],
            "lanes":[{"id":lane,"attempts":by_lane[lane][0],"yards":by_lane[lane][1],
                "touchdowns":by_lane[lane][2],"explosive10":by_lane[lane][3],
                "epa":by_lane[lane][5]/by_lane[lane][6] if by_lane[lane][6] else None,
                "leagueYpc":rush_league[lane][1]/rush_league[lane][0] if rush_league[lane][0] else None}
                for lane in lanes]})

    result["receiving"]=[]
    for rid,v in receiving.items():
        a,c,y,td,fd,yac,yac_count,air,air_count,explosive=v
        p={"gsisId":rid,"espnId":ids.get(rid),"name":rec_names[rid],
           "targets":a,"receptions":c,"yards":y,"touchdowns":td,"firstDowns":fd,
           "yac":yac if yac_count else None,"yacReceptions":yac_count,
           "adot":air/air_count if air_count else None,"explosive20":explosive,
           "weeks":[{"week":w,"targets":x[0],"receptions":x[1],"yards":x[2]} for w,x in sorted(rec_weeks[rid].items())],
           "zones":[],"connections":[{"id":pid,"name":names.get(pid,pid),"targets":x[0],"receptions":x[1],"yards":x[2],"touchdowns":x[3]} for pid,x in sorted(connections[rid].items(),key=lambda item:-item[1][0])]}
        for d,label in enumerate(["20+","10–19","0–9","Behind LOS"]):
            for j,direction in enumerate(["left","middle","right"]):
                a,c,y,e,ec=rec_zones[rid][(d,direction)];lc,la=rec_league[(d,direction)]
                p["zones"].append({"id":f"{d}-{j}","depth":label,"direction":direction.title(),"attempts":a,"completions":c,"yards":y,"epa":e/ec if ec else None,"benchmark":lc/la if la else None})
        result["receiving"].append(p)
    result["redzone"]=redzone.export(ids)
    result["defense"]=defense.export(ids)
    result["teamIdentity"]=identity.export()
    result["matchupTeams"]=identity.matchup_export()
    result["games"]=games.export()
    depth_ranks={}
    try:
        depth_rows,_=load("depth_charts",f"depth_charts_{year}.csv.gz")
        dates=[g["date"] for g in result["games"] if g.get("date") and g["date"]!="NA"]
        cutoff=max(dates) if year<datetime.now().year and dates else None
        result["depthChart"],depth_ranks=normalize_depth(depth_rows,year,cutoff)
    except (OSError,ValueError,KeyError) as exc:
        print(f"Depth chart unavailable: {exc}",file=sys.stderr)
        result["depthChart"]=None
    result["roster"]=[]
    seen=set()
    for r in roster:
        pid=r.get("gsis_id")
        if r.get("team")!="CHI" or not pid or pid=="NA" or pid in seen:continue
        name=r.get("full_name") or r.get("player_name")
        if not name or name=="NA":continue
        seen.add(pid)
        jersey=num(r,"jersey_number")
        result["roster"].append({"gsisId":pid,"espnId":ids.get(pid),"name":name,"number":int(jersey) if jersey is not None else None,"position":r.get("position") or "POS","depth":depth_ranks.get("gsis:"+pid) or depth_ranks.get("espn:"+str(ids.get(pid)))})
    if not result["roster"]:raise ValueError("No Chicago roster entries; verify roster schema")
    dest=Path("public/data/bears-intelligence")/f"{year}.json"
    dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(json.dumps(result,ensure_ascii=False,allow_nan=False),encoding="utf-8")
    print(f"Wrote {dest}: {len(result['players'])} passers")
if __name__=="__main__":
    year=int(sys.argv[1])
    if not 1999<=year<=datetime.now().year:raise ValueError("Invalid season")
    run(year)
