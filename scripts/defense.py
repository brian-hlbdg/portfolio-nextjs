"""Recorded defensive events and opponent territory; not coverage assignments."""
from collections import defaultdict

FIELDS={
 "solo": [f"solo_tackle_{i}_player_id" for i in (1,2)],
 "assists": [f"assist_tackle_{i}_player_id" for i in range(1,5)],
 "tfl": [f"tackle_for_loss_{i}_player_id" for i in (1,2)],
 "hits": [f"qb_hit_{i}_player_id" for i in (1,2)],
 "passesDefended": [f"pass_defense_{i}_player_id" for i in (1,2)],
 "interceptions": ["interception_player_id"],
 "forcedFumbles": [f"forced_fumble_player_{i}_player_id" for i in (1,2)],
 "recoveries": [f"fumble_recovery_{i}_player_id" for i in (1,2)],
 "sacks": ["sack_player_id","half_sack_1_player_id","half_sack_2_player_id"]
}
def blank():return {k:0 for k in FIELDS}
def valid(pid):return pid not in ("",None,"NA")
class Defense:
 def __init__(self,columns):
    self.available=[k for k,fields in FIELDS.items() if all(f in columns for f in fields) and (k not in ("solo","assists","forcedFumbles","recoveries") or all(f.replace("_player_id","_team") in columns or f.replace("_player_id","_player_team") in columns for f in fields))]
    self.players=defaultdict(lambda:defaultdict(blank))
    self.team=defaultdict(lambda:[0,0,0,0,0])
    self.league=defaultdict(lambda:[0,0,0,0,0])
 def observe(self,r,num):
    if not valid(r.get("defteam")) or not valid(r.get("posteam")):return
    chicago=r["defteam"]=="CHI"
    passing=num(r,"pass_attempt")==1 and num(r,"sack")!=1
    rushing=num(r,"rush_attempt")==1 and num(r,"qb_kneel")!=1 and not passing
    lane=None
    if passing:
        air=num(r,"air_yards"); loc=r.get("pass_location")
        if air is not None and loc in ("left","middle","right"):
            lane=("pass",0 if air>=20 else 1 if air>=10 else 2 if air>=0 else 3,loc)
    elif rushing:
        loc=r.get("run_location"); gap=r.get("run_gap")
        if loc=="middle":lane=("rush","middle")
        elif loc in ("left","right") and gap in ("end","tackle","guard"):lane=("rush",loc+"_"+gap)
    if lane:
        gain=num(r,"passing_yards" if passing else "rushing_yards")
        epa=num(r,"epa")
        for group in (self.league,self.team) if chicago else (self.league,):
            v=group[lane];v[0]+=1;v[1]+=int(num(r,"complete_pass")==1) if passing else 0
            v[2]+=gain or 0
            if epa is not None:v[3]+=epa;v[4]+=1
    if not chicago or not (passing or rushing or num(r,"sack")==1):return
    week=num(r,"week")
    if week is None:return
    week=int(week)
    for metric in self.available:
        if metric=="hits" and num(r,"sack")==1:continue
        seen=set()
        for field in FIELDS[metric]:
            pid=r.get(field)
            if not valid(pid) or pid in seen:continue
            if metric in ("solo","assists","forcedFumbles","recoveries"):
                team_field=field.replace("_player_id","_team")
                if team_field not in r:team_field=field.replace("_player_id","_player_team")
                if r.get(team_field)!="CHI":continue
            if metric=="sacks" and field.startswith("half") and valid(r.get("sack_player_id")):continue
            seen.add(pid)
            self.players[pid][week][metric]+=.5 if metric=="sacks" and field.startswith("half") else 1
 def export(self,ids):
    def summary(v):
        return {"attempts":v[0],"completions":v[1],"yards":v[2],"epa":v[3]/v[4] if v[4] else None}
    zones=[]
    for d,label in enumerate(("20+","10–19","0–9","Behind LOS")):
        for j,loc in enumerate(("left","middle","right")):
            k=("pass",d,loc); t=self.team[k]; l=self.league[k]
            zones.append({"id":f"{d}-{j}","depth":label,"direction":loc.title(),"attempts":t[0],"completions":t[1],"epa":t[3]/t[4] if t[4] else None,"benchmark":l[1]/l[0] if l[0] else None,"yards":t[2]})
    lanes=[]
    for lane in ("left_end","left_tackle","left_guard","middle","right_guard","right_tackle","right_end"):
        k=("rush",lane)
        lanes.append({"id":lane,"team":summary(self.team[k]),"league":summary(self.league[k])})
    return {"available":self.available,"passingAllowed":zones,"rushingAllowed":lanes,"players":[{"gsisId":pid,"espnId":ids.get(pid),"totals":{k:sum(w[k] for w in weeks.values()) for k in self.available},"weeks":[{"week":w,"events":{k:v[k] for k in self.available}} for w,v in sorted(weeks.items())]} for pid,weeks in self.players.items()]}
