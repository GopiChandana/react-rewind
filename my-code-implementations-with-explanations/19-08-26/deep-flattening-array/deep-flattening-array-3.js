// "Your code is perfect, but what if the nesting is 100,000 layers deep?
// It will crash the browser with a Maximum Call Stack Size Exceeded error.
// Can you rewrite this without recursion?"

const array = [
  1,
  [2, [3, [4, [5, 6, [7, [[[[8]]]]]]]]],
  9,
  [[[[[[[[[[[[[[[10]]]]]]]]]]]]]]],
];

function deepFlattenIterative(input_array) {
  const stack = [...input_array];
  
  const result = [];
  while (stack.length > 0) {
    const next = stack.shift();
    if (Array.isArray(next)) {
      stack.unshift(...next);
    } else {
      result.push(next);
    }
  }
  return result;
}
console.log(deepFlattenIterative(array));
