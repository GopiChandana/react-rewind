// Challenge 1: Group By Condition (Dynamic Categorization)
// Scenario: You are building a dashboard for a school. You are given an array of student objects. 
// You need to group them by their final grade letter, which is calculated based on their numeric score:
// "A": Score ≥ 90
// "B": Score ≥ 80 and < 90
// "Fail": Score < 80
// Write a function groupByGrade that accepts the students array and a condition function to group them into an object.

const students = [
  { name: "Alice", score: 92 },
  { name: "Bob", score: 85 },
  { name: "Charlie", score: 73 },
  { name: "Diana", score: 88 },
  { name: "Ethan", score: 95 }
];
/* Required Output Shape:
{
  A: [ { name: 'Alice', ... }, { name: 'Ethan', ... } ],
  B: [ { name: 'Bob', ... }, { name: 'Diana', ... } ],
  Fail: [ { name: 'Charlie', ... } ]
}
*/

const conditionToSatify = (data)=>{
    if(data["score"] < 80){
        return "Fail"
    }
    return data["score"] >= 90 ? "A" : "B"
}

const groupByGrade = (data,condition) => {
  return data.reduce((finalData,eachData)=>{
    const res = condition(eachData)
    if(res in finalData){
        finalData[res].push(eachData)
    }else{
        finalData[res] = [eachData]
    }
    return finalData
  },{})
}

console.log(groupByGrade(students,conditionToSatify))