/*
If an interviewer wants to make this problem significantly harder, 
they will mix Deep Flattening and Frequencies together. 
They will say: "The tags can be nested inside multiple layers of sub-arrays. Count them all."
*/

const crazyData = [
  { name: "Devan", tags: ["JS", ["Frontend", "React"]] },
  { name: "Amara", tags: [["Backend", "Python"], "JS"] }
];

function flattenArray(array){
    const res =  array.reduce((acc,curr)=>
        acc.concat(Array.isArray(curr) ? flattenArray(curr):curr),[])
    return res
}
function skillFrequency(data){
    const res= data.reduce((acc,curr)=>{
        const normalArrayTags = flattenArray(curr.tags)
        normalArrayTags.forEach((value)=>{
            if(value in acc){
                acc[value]+=1
            }else{
                acc[value] =1
            }
        })


          return acc
    },{})
    return res
}
const res = skillFrequency(crazyData)
console.log(JSON.stringify(res,null,2))