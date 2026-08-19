// Scenario:You are building an HR optimization panel.
// You are given an array of developer profile objects. 
// Each developer profile contains an inner array listing
// their localized technical stack (skills).

// Task:Write a function tallySkills(profiles) that loops through 
// every single profile, navigates into the nested skills array, 
// and counts the exact frequency of every unique skill across the 
// entire company.

const candidates = [
  { name: "Devan", skills: ["JS", "React"] },
  { name: "Amara", skills: ["Python", "JS"] },
  { name: "Kiran", skills: ["React", "CSS", "JS"] }
];

/* Required Output Shape:
{
  "JS": 3,
  "React": 2,
  "Python": 1,
  "CSS": 1
}
*/

const tallySkills = (profiles)=>{
    return profiles.reduce((acc,curr)=>{
        let skills = curr.skills
        skills.forEach((value)=>{
          if(value in acc){
            acc[value]+= 1
          }else{
            acc[value] = 1
          }
        })
      return acc
    },{})
}

console.log(JSON.stringify(tallySkills(candidates),null,2))