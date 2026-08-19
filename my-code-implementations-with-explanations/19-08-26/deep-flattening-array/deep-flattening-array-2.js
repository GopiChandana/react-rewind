const array = [
  1,
  [2, [3, [4, [5, 6, [7, [[[[8]]]]]]]]],
  9,
  [[[[[[[[[[[[[[[10]]]]]]]]]]]]]]],
];

function deepFlattenWithReduce(input_array) {
  return input_array.reduce((acc, curr) => {
    acc = acc.concat(Array.isArray(curr) ? deepFlattenWithReduce(curr) : curr);
    return acc;
  }, []);
}
console.log("1:", deepFlattenWithReduce(array));

const deepFlattenWithReduceSimple = (input_array) =>
  input_array.reduce(
    (acc, curr) =>
      acc.concat(
        Array.isArray(curr) ? deepFlattenWithReduceSimple(curr) : curr,
      ),
    [],
  );

console.log("2:", deepFlattenWithReduceSimple(array));
