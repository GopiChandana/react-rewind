// Challenge 2: Partition (The Binary Split)
// Scenario: You are managing an e-commerce inventory.
// You need to separate items into two categories based on a true/false condition: 
// items that are in stock and items that are out of stock.
// Write a function partitionInventory that uses reduce to 
// return a single array containing exactly two nested arrays:
//  [ [items passing], [items failing] ].

//This variation is an interview favorite because it tests 
// whether you know how to use an array containing nested arrays
//  [[], []] as your starting accumulator inside reduce.


const products = [
  { name: "Laptop", inStock: true },
  { name: "Mouse", inStock: false },
  { name: "Keyboard", inStock: true },
  { name: "Monitor", inStock: false }
];
// console.log("Available:", available);
// Required Output Shape: [ { name: 'Laptop', ... }, { name: 'Keyboard', ... } ]

// console.log("Unavailable:", unavailable);
// Required Output Shape: [ { name: 'Mouse', ... }, { name: 'Monitor', ... } ]

const partitionInventory = (input,predictionFn)=>{
    return input.reduce((acc,curr)=>{

        if(predictionFn(curr)){
            acc[0].push(curr)
        }else{
            acc[1].push(curr)
        }

        return acc
    },[[],[]])
}
const predictionFn = (input) => input.inStock 
const [instock,outstock] = partitionInventory(products,predictionFn)
console.log("instock:",instock)
console.log("outstock:",outstock)
