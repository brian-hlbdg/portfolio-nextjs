"""Normalize nflverse weekly (through 2024) and daily (2025+) depth charts."""
from collections import defaultdict

def valid(v):return v not in (None,"","NA")
def normalize_depth(rows,year,last_game_date=None):
    daily=year>=2025
    candidates=[]
    for r in rows:
        if r.get("team" if daily else "club_code")!="CHI":continue
        if daily:
            dt=r.get("dt")
            if not valid(dt):continue
            # Historical season snapshots stop at the final recorded regular-season game.
            if last_game_date and dt[:10]>last_game_date:continue
            key=dt
        else:
            if r.get("game_type")!="REG":continue
            try:key=int(float(r["week"]))
            except (KeyError,ValueError,TypeError):continue
        candidates.append((key,r))
    if not candidates:return None,{}
    latest=max(k for k,r in candidates)
    result={}
    for k,r in candidates:
        if k!=latest:continue
        gsis=r.get("gsis_id") or r.get("player_gsis_id")
        espn=r.get("espn_id") or r.get("player_espn_id")
        try:rank=int(float(r["pos_rank" if daily else "depth_team"]))
        except (KeyError,ValueError,TypeError):continue
        if rank<1:continue
        pos=r.get("pos_abb" if daily else "depth_position")
        group=r.get("pos_grp" if daily else "formation")
        item={"rank":rank,"position":pos if valid(pos) else None,"group":group if valid(group) else None}
        for id in (["gsis:"+gsis] if valid(gsis) else [])+(["espn:"+espn.split(".")[0]] if valid(espn) else []):
            if id not in result or rank<result[id]["rank"]:result[id]=item
    return {"source":"nflverse depth charts","asOf":str(latest) if daily else "Week "+str(latest)},result
