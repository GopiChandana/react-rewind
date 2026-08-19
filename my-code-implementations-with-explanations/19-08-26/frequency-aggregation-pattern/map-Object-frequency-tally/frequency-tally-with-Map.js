/*
"Your frequency counter must preserve the exact insertion order of the elements, 
or handle keys that aren't strings. Do this without a plain object."
 */
const userActions = ["click", "hover", "click", "scroll", "click", "hover"];

// Output: Map(3) { 'click' => 3, 'hover' => 2, 'scroll' => 1 }

const frequencyUsingMap = (data)=>{
    const res = data.reduce((acc,currentAction)=>{
        if(acc.has(currentAction)){
            acc.set(currentAction,acc.get(currentAction)+1)
        }else{
            acc.set(currentAction,1)
        }
        return acc
    },new Map())
    return res
}
console.log(frequencyUsingMap(userActions))