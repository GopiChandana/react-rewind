Array.prototype.myCustomForEach = function(callback,thisArg){
    if(this === null){
        throw new TypeError("cannot read properties of null or undefined")
    }
    if(typeof callback !== 'function'){
       throw new TypeError(callback + "is not a function")
    }

    const array = Object(this);
    const length = array.length >>> 0

    for(let i=0;i<length;i++){
        if(i in array){
            callback.call(thisArg,array[i],i,array)
        }
    }

    return undefined

}

const orgArray = [1,2,4,,5,6,,7,,,,9]
const result1 = []
orgArray.myCustomForEach(num=>{
    result1.push(num-1)
})
// console.log(result)
console.log(orgArray)
const orgArray2 = [11,12,14,,15,16,,17,,,,19]
const obj = {
    number : 1
}
const result2 = []
const result3 = []
orgArray2.myCustomForEach(function(num,i){
    result2.push(num - this.number)
    result3[i]= num - this.number
},obj)

console.log(orgArray2,result2,result3)