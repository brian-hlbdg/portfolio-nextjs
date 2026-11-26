"""Compact Chicago game/drive explorer from observed play-by-play."""
from collections import defaultdict

def valid(v):return v not in (None,"","NA")
class GameDrives:
    def __init__(self):
        self.games={}
        self.drives=defaultdict(dict)
    def observe(self,r,num):
        home,away=r.get("home_team"),r.get("away_team")
        gid=r.get("game_id")
        if "CHI" not in (home,away) or not valid(gid):return
        g=self.games.setdefault(gid,{"id":gid,"week":int(num(r,"week") or 0),"home":home,"away":away,"date":r.get("game_date"),"homeScore":None,"awayScore":None,"final":False})
        for field,key in (("total_home_score","homeScore"),("total_away_score","awayScore")):
            v=num(r,field)
            if v is not None:g[key]=int(v)
        if num(r,"game_seconds_remaining")==0 and r.get("desc","").upper().find("END GAME")>=0:g["final"]=True
        offense=r.get("posteam")
        drive=r.get("fixed_drive")
        if not valid(drive):drive=r.get("drive")
        pid=num(r,"play_id")
        if not valid(offense) or not valid(drive) or pid is None:return
        kind=r.get("play_type")
        if kind not in ("pass","run","punt","field_goal","qb_kneel","qb_spike","no_play"):return
        if kind=="no_play" and num(r,"penalty")!=1:return
        key=(drive,offense)
        d=self.drives[gid].setdefault(key,{"id":str(drive)+"-"+offense,"team":offense,"result":None,"plays":[]})
        result=r.get("fixed_drive_result") or r.get("drive_end_transition")
        if valid(result):d["result"]=result
        yards=num(r,"yards_gained") if kind!="no_play" else None
        start=num(r,"yardline_100")
        # End position is estimated from recorded net play yards, not tracking.
        end=max(0,min(100,start-yards)) if start is not None and yards is not None and kind in ("pass","run","qb_kneel","qb_spike") and num(r,"interception")!=1 and num(r,"fumble_lost")!=1 else None
        p={"id":int(pid),"quarter":num(r,"qtr"),"clock":r.get("time") if valid(r.get("time")) else None,"down":num(r,"down"),"distance":num(r,"ydstogo"),"start":start,"end":end,"yards":yards,"kind":"sack" if num(r,"sack")==1 else kind,"epa":num(r,"epa") if kind!="no_play" else None,"description":r.get("desc") or "Description unavailable","td":num(r,"pass_touchdown")==1 or num(r,"rush_touchdown")==1,"turnover":num(r,"interception")==1 or num(r,"fumble_lost")==1}
        d["plays"].append(p)
    def export(self):
        result=[]
        for gid,g in self.games.items():
            drives=[]
            for d in self.drives[gid].values():
                p=sorted(d["plays"],key=lambda v:v["id"])
                scrimmage=[v for v in p if v["kind"] in ("pass","run","sack","qb_kneel","qb_spike")]
                if not scrimmage and not any(v["kind"] in ("punt","field_goal") for v in p):continue
                measured=[v["epa"] for v in scrimmage if v["epa"] is not None]
                start=next((v["start"] for v in p if v["start"] is not None),None)
                drives.append({**d,"plays":p,"start":start,"snapCount":len(scrimmage),"netYards":sum(v["yards"] or 0 for v in scrimmage),"epa":sum(measured) if measured else None,"epaCount":len(measured)})
            drives.sort(key=lambda d:d["plays"][0]["id"])
            if drives:result.append({**g,"drives":drives})
        return sorted(result,key=lambda g:(g["week"],g["id"]))
