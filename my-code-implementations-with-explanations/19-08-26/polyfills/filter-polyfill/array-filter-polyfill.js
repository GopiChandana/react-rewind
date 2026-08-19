Array.prototype.myCustomFilter = function(callback,thisArg){
    if(this === null){
        throw new TypeError("cannot read properties of null or undefined")
    }
    if(typeof callback !== 'function'){
        throw new TypeError(callback + "is not a function ")
    }

    const array = Object(this)
    const length = array.length >>> 0
    const result = []

    for(let i=0;i<length;i++){
        if(i in array){
            const transformedResult = callback.call(thisArg,array[i],i,array)
            if(transformedResult){
                result.push(array[i])
            }
        }
    }
    return result
}

const orgArray = [1,2,,4,5,6,7,3,6,8]
const transformedArray = orgArray.myCustomFilter(num => num %2 === 0)
console.log(transformedArray)
const obj = {
    divisor:2
}
const anotherArray = orgArray.myCustomFilter(function(num){
    return num % this.divisor === 0
},obj)
console.log(anotherArray)