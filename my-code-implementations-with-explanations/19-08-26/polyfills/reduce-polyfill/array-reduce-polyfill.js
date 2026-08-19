Array.prototype.myCustomReduce = function(callback,initialValue){
    if(this === null){
        throw new TypeError("cannot read properties of null or undefined")
    }
    if(typeof callback !== 'function'){
        throw new TypeError(callback + "is not a function")
    }
    const array = Object(this)
    const length = array.length >>> 0


    const hasInitialValue = arguments.length > 1 ? true : false
    let initialIndex = 0;
    let foundFirstValue = false;
    let accumulator;

    if(hasInitialValue){
        accumulator = initialValue;
        foundFirstValue = true;
    }else{
        for(let j=0;j<length;j++){
            if(j in array){
                foundFirstValue = true;
                accumulator = array[j]
                initialIndex = j+1
                break;
            }
        }
    }
    if(!foundFirstValue){
        throw new TypeError("Reduce of empty array with no initial value")
    }

    for(let i=initialIndex;i<length;i++){
        if(i in array)
            //bcoz its reduce no context so no this so no .call
        accumulator = callback(accumulator,array[i],i,array)
    }
    return accumulator
}

const orgArray = [1,,,3,4,5,,,7,43,8,0]
const result= orgArray.myCustomReduce((acc,curr)=>acc+curr,1)
console.log("1:",result)
const obj ={
    additional : 1
}
const result2 = orgArray.myCustomReduce(function (acc,curr){
   acc = acc + (curr + this.additional)
   return acc
}.bind(obj),1) // for traditional we can use .bind
console.log("2:",result2)