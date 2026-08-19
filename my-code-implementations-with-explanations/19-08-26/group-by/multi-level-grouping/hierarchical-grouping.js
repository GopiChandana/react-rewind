// 1. The Multi-Key Grouping Pattern (Hierarchical Grouping)
// In real-world data pipelines, you rarely group by just one thing.
// Interviewers will ask you to group by multiple properties at once,
// creating a nested object tree.
// The Scenario: Group products by category AND then by type and brand.
// The Output Structure: A nested object containing objects that contain arrays:
// { category: { brand: [ items ] } }


// OUTPUT :
// {
//   "Electronics": {
//     "Phone": {
//       "Apple": [
//         {
//           "name": "iPhone 15 Pro",
//           "category": "Electronics",
//           "type": "Phone",
//           "brand": "Apple"
//         }
//       ],
//       "Samsung": [
//         {
//           "name": "Galaxy S24",
//           "category": "Electronics",
//           "type": "Phone",
//           "brand": "Samsung"
//         }
//       ]
//     },
//     "Laptop": {
//       "Apple": [
//         {
//           "name": "MacBook Pro",
//           "category": "Electronics",
//           "type": "Laptop",
//           "brand": "Apple"
//         }
//       ]
//     }
//   },
//   "Footwear": {
//     "Sneaker": {
//       "Nike": [
//         {
//           "name": "Air Jordan",
//           "category": "Footwear",
//           "type": "Sneaker",
//           "brand": "Nike"
//         }
//       ]
//     }
//   }
// }

const inventory = [
  { name: "iPhone 15 Pro", category: "Electronics", type: "Phone", brand: "Apple" },
  { name: "Galaxy S24", category: "Electronics", type: "Phone", brand: "Samsung" },
  { name: "MacBook Pro", category: "Electronics", type: "Laptop", brand: "Apple" },
  { name: "Air Jordan", category: "Footwear", type: "Sneaker", brand: "Nike" }
];

function groupByMultipleLevels(array, keysArray) {
  return array.reduce((acc, curr) => {
    let pointer = acc;
    keysArray.forEach((item,index)=>{
        const itemValue = curr[item]
        const lastIndex = index === keysArray.length -1

        if(lastIndex){
            if(!pointer[itemValue]){
                pointer[itemValue] = []
            }
            pointer[itemValue].push(curr)
        }else{
            if(!pointer[itemValue]){
                pointer[itemValue] = {}
            }
            pointer = pointer[itemValue]
        }
    })

    return acc;
  }, {});
}

// Grouping by 3 levels deep: Category -> Type -> Brand
const res = groupByMultipleLevels(inventory, ["category", "type", "brand"]);
console.log(JSON.stringify(res,null,2))

