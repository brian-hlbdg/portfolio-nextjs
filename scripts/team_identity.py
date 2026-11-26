"""Team efficiency on scrimmage plays, excluding kneels/spikes and no-plays."""
from collections import defaultdict

def blank():
    return dict(plays=0,passes=0,rushes=0,yards=0,epaSum=0,epaCount=0,success=0,explosive=0,turnovers=0,third=0,converted=0,sacks=0,td=0)
def summarize(v):
    def rate(n,d):return n/d if d else None
    return dict(plays=v["plays"],passShare=rate(v["passes"],v["plays"]),yardsPerPlay=rate(v["yards"],v["plays"]),epa=rate(v["epaSum"],v["epaCount"]),success=rate(v["success"],v["epaCount"]),explosive=rate(v["explosive"],v["plays"]),thirdDown=rate(v["converted"],v["third"]),turnovers=v["turnovers"],sacks=v["sacks"],touchdowns=v["td"],epaCount=v["epaCount"])
class TeamIdentity:
    def __init__(self):
        self.off=defaultdict(blank)
        self.defense=defaultdict(blank)
        self.league=blank()
        self.weeks=defaultdict(lambda:{"offense":blank(),"defense":blank()})
        self.downs=defaultdict(lambda:{"offense":blank(),"defense":blank(),"league":blank()})
    def observe(self,r,num):
        if num(r,"qb_kneel")==1 or num(r,"qb_spike")==1:return
        o,d=r.get("posteam"),r.get("defteam")
        if not o or not d or o=="NA" or d=="NA":return
        passing=num(r,"pass_attempt")==1 or num(r,"sack")==1
        rushing=num(r,"rush_attempt")==1 and not passing
        if not passing and not rushing:return
        # Scrambles are classified as recorded rushes, not inferred play calls.
        y=num(r,"yards_gained")
        if y is None:return
        e=num(r,"epa");w=num(r,"week");down=num(r,"down")
        third=num(r,"third_down_converted")==1 or num(r,"third_down_failed")==1
        turnover=num(r,"interception")==1 or num(r,"fumble_lost")==1
        groups=[self.off[o],self.defense[d],self.league]
        if w is not None:
            if o=="CHI":groups.append(self.weeks[int(w)]["offense"])
            if d=="CHI":groups.append(self.weeks[int(w)]["defense"])
        if down in (1,2,3,4):
            groups.append(self.downs[int(down)]["league"])
            if o=="CHI":groups.append(self.downs[int(down)]["offense"])
            if d=="CHI":groups.append(self.downs[int(down)]["defense"])
        for v in groups:
            v["plays"]+=1;v["passes"]+=int(passing);v["rushes"]+=int(rushing);v["yards"]+=y
            v["explosive"]+=int(y>=(20 if passing else 10))
            v["turnovers"]+=int(turnover);v["sacks"]+=int(num(r,"sack")==1)
            v["td"]+=int(num(r,"pass_touchdown")==1 or num(r,"rush_touchdown")==1)
            if e is not None:v["epaSum"]+=e;v["epaCount"]+=1;v["success"]+=int(e>0)
            if down==3 and third:v["third"]+=1;v["converted"]+=int(num(r,"third_down_converted")==1)
    def export(self):
        off=summarize(self.off["CHI"]); defense=summarize(self.defense["CHI"])
        metrics=("epa","success","yardsPerPlay","explosive","thirdDown")
        def ranks(group,own,reverse):
            out={}
            for key in metrics:
                vals=[summarize(v)[key] for v in group.values()]
                vals=[v for v in vals if v is not None]
                value=own[key]
                out[key]={"rank":1+sum((v>value if reverse else v<value) for v in vals),"count":len(vals)} if value is not None and vals else None
            return out
        return {"offense":off,"defense":defense,"league":summarize(self.league),"offenseRanks":ranks(self.off,off,True),"defenseRanks":ranks(self.defense,defense,False),"weeks":[{"week":w,"offense":summarize(v["offense"]),"defense":summarize(v["defense"])} for w,v in sorted(self.weeks.items())],"downs":[{"down":d,**{k:summarize(v) for k,v in self.downs[d].items()}} for d in (1,2,3,4)]}
