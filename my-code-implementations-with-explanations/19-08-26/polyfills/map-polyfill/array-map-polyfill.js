Array.prototype.myCustomMap = function (callback,thisArg){
    if(this === null){
        throw new TypeError("cannot read properties of null or undefined")
    }
    if(typeof callback !== 'function') {
        throw new TypeError(callback + "is not a function")
    }
    const array = Object(this)
    const length = array.length >>> 0
    let result = new Array(length)
    // console.log(result)

    for(let i=0;i<length;i++){
        if(i in array){
            result[i] = callback.call(thisArg,array[i],i,array)
        }
    }
    return result
}

const orgArray = [1,2,,4,5]
const mappedArray = orgArray.myCustomMap(num => num*2)
console.log(mappedArray)
const mappedArray2 = orgArray.myCustomMap(function (num){
    return num + 2
})
console.log(mappedArray2)
const obj = {
    divisor: 2
}
const mappedArray3 = orgArray.myCustomMap(function (num){
    return num / this.divisor
},obj)
console.log(mappedArray3)