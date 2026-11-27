// Official Chicago Bears roster snapshot, verified 2026-11-27.
// Season-specific values, not historical measurements or draft-year calculations.
// Exp is the club's listed NFL experience (0 = rookie).
export const starterRosterSource='https://www.chicagobears.com/team/players-roster/';
export const starterRosterSeason=2026;
export const starterRosterAsOf='2026-11-27';
type StarterProfile={gsisId:string;espnId:string|null;name:string;heightInches:number;weightLbs:number;college:string;listedExperience:number};
const profiles:StarterProfile[]=[
  {
    "gsisId": "00-0031203",
    "espnId": "17427",
    "name": "Cairo Santos",
    "heightInches": 68,
    "weightLbs": 173,
    "college": "Tulane",
    "listedExperience": 13
  },
  {
    "gsisId": "00-0031583",
    "espnId": "2576492",
    "name": "Grady Jarrett",
    "heightInches": 73,
    "weightLbs": 294,
    "college": "Clemson",
    "listedExperience": 12
  },
  {
    "gsisId": "00-0032391",
    "espnId": null,
    "name": "Joe Thuney",
    "heightInches": 77,
    "weightLbs": 301,
    "college": "N.C. State",
    "listedExperience": 11
  },
  {
    "gsisId": "00-0032464",
    "espnId": "2973405",
    "name": "Kalif Raymond",
    "heightInches": 69,
    "weightLbs": 160,
    "college": "Holy Cross",
    "listedExperience": 10
  },
  {
    "gsisId": "00-0034067",
    "espnId": null,
    "name": "Scott Daly",
    "heightInches": 74,
    "weightLbs": 245,
    "college": "Notre Dame",
    "listedExperience": 6
  },
  {
    "gsisId": "00-0035357",
    "espnId": "3916577",
    "name": "Cam Lewis",
    "heightInches": 69,
    "weightLbs": 183,
    "college": "Buffalo",
    "listedExperience": 7
  },
  {
    "gsisId": "00-0035386",
    "espnId": "3121544",
    "name": "T.J. Edwards",
    "heightInches": 72,
    "weightLbs": 228,
    "college": "Wisconsin",
    "listedExperience": 8
  },
  {
    "gsisId": "00-0035525",
    "espnId": "4036261",
    "name": "Devin Bush",
    "heightInches": 71,
    "weightLbs": 234,
    "college": "Michigan",
    "listedExperience": 8
  },
  {
    "gsisId": "00-0035588",
    "espnId": null,
    "name": "Garrett Bradbury",
    "heightInches": 75,
    "weightLbs": 305,
    "college": "N.C. State",
    "listedExperience": 8
  },
  {
    "gsisId": "00-0035643",
    "espnId": "4035369",
    "name": "Jeffery Simmons",
    "heightInches": 76,
    "weightLbs": 305,
    "college": "Mississippi State",
    "listedExperience": 8
  },
  {
    "gsisId": "00-0035647",
    "espnId": "3134690",
    "name": "Montez Sweat",
    "heightInches": 78,
    "weightLbs": 270,
    "college": "Mississippi State",
    "listedExperience": 8
  },
  {
    "gsisId": "00-0036258",
    "espnId": null,
    "name": "Jonah Jackson",
    "heightInches": 75,
    "weightLbs": 319,
    "college": "Ohio State",
    "listedExperience": 7
  },
  {
    "gsisId": "00-0036275",
    "espnId": "4259545",
    "name": "D'Andre Swift",
    "heightInches": 68,
    "weightLbs": 204,
    "college": "Georgia",
    "listedExperience": 7
  },
  {
    "gsisId": "00-0036292",
    "espnId": "4243253",
    "name": "Jaylon Johnson",
    "heightInches": 72,
    "weightLbs": 195,
    "college": "Utah",
    "listedExperience": 7
  },
  {
    "gsisId": "00-0036337",
    "espnId": "4259181",
    "name": "James Lynch",
    "heightInches": 76,
    "weightLbs": 295,
    "college": "Baylor",
    "listedExperience": 7
  },
  {
    "gsisId": "00-0038111",
    "espnId": "4361093",
    "name": "Kyler Gordon",
    "heightInches": 71,
    "weightLbs": 200,
    "college": "Washington",
    "listedExperience": 5
  },
  {
    "gsisId": "00-0038390",
    "espnId": "4430822",
    "name": "Noah Sewell",
    "heightInches": 73,
    "weightLbs": 246,
    "college": "Oregon",
    "listedExperience": 4
  },
  {
    "gsisId": "00-0038932",
    "espnId": null,
    "name": "Darnell Wright",
    "heightInches": 77,
    "weightLbs": 325,
    "college": "Tennessee",
    "listedExperience": 4
  },
  {
    "gsisId": "00-0039071",
    "espnId": "4426374",
    "name": "Tyrique Stevenson",
    "heightInches": 72,
    "weightLbs": 212,
    "college": "Miami",
    "listedExperience": 4
  },
  {
    "gsisId": "00-0039459",
    "espnId": null,
    "name": "Theo Benedet",
    "heightInches": 79,
    "weightLbs": 304,
    "college": "University of British Columbia",
    "listedExperience": 2
  },
  {
    "gsisId": "00-0039745",
    "espnId": "4686889",
    "name": "Tory Taylor",
    "heightInches": 76,
    "weightLbs": 225,
    "college": "Iowa",
    "listedExperience": 3
  },
  {
    "gsisId": "00-0039918",
    "espnId": "4431611",
    "name": "Caleb Williams",
    "heightInches": 73,
    "weightLbs": 226,
    "college": "USC",
    "listedExperience": 3
  },
  {
    "gsisId": "00-0040126",
    "espnId": "4723086",
    "name": "Colston Loveland",
    "heightInches": 78,
    "weightLbs": 241,
    "college": "Michigan",
    "listedExperience": 2
  },
  {
    "gsisId": "00-0040735",
    "espnId": "4685278",
    "name": "Luther Burden III",
    "heightInches": 72,
    "weightLbs": 210,
    "college": "Missouri",
    "listedExperience": 2
  },
  {
    "gsisId": "00-0041051",
    "espnId": "4869748",
    "name": "Zavion Thomas",
    "heightInches": 70,
    "weightLbs": 190,
    "college": "LSU",
    "listedExperience": 0
  },
  {
    "gsisId": "00-0041538",
    "espnId": "4954445",
    "name": "Dillon Thieneman",
    "heightInches": 72,
    "weightLbs": 201,
    "college": "Oregon",
    "listedExperience": 0
  },
  {
    "gsisId": "00-0039919",
    "espnId": "4431299",
    "name": "Rome Odunze",
    "heightInches": 75,
    "weightLbs": 214,
    "college": "Washington",
    "listedExperience": 3
  },
  {
    "gsisId": "00-0036290",
    "espnId": "4258595",
    "name": "Cole Kmet",
    "heightInches": 78,
    "weightLbs": 257,
    "college": "Notre Dame",
    "listedExperience": 7
  }
];
export function starterProfile(id:string,season:number){
 if(season!==starterRosterSeason)return undefined;
 const key=id.replace(/^gsis:/,'');
 return profiles.find(p=>p.gsisId===key||p.espnId===key);
}
export const starterProfiles=profiles;
