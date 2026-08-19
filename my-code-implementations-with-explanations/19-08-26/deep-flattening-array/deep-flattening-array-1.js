const array = [1,[2,[3,[4,[5,6,[7,[[[[8]]]]]]]]],9,[[[[[[[[[[[[[[[10]]]]]]]]]]]]]]]]

function deepFlatten(input_array){
    let result =[]

    for(let i=0;i<input_array.length;i++){
        result = result.concat(Array.isArray(input_array[i]) ? deepFlatten(input_array[i]): input_array[i])
    }
    return result
}

console.log(deepFlatten(array))