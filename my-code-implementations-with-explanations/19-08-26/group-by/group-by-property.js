const inventory = [
  { name: "Asparagus", type: "vegetables" },
  { name: "Bananas", type: "fruit" },
  { name: "Goat Cheese", type: "dairy" },
  { name: "Cherries", type: "fruit" },
  { name: "Broccoli", type: "vegetables" },
];

// Required Output:
// {
//   vegetables: [ { name: "Asparagus", ... }, { name: "Broccoli", ... } ],
//   fruit: [ { name: "Bananas", ... }, { name: "Cherries", ... } ],
//   dairy: [ { name: "Goat Cheese", ... } ]
// }

function groupBy(array, property) {
  return array.reduce((acc, curr) => {
    const propertytoCheck = curr[property];
    if (propertytoCheck in acc) {
      acc[propertytoCheck].push(curr);
    } else {
      acc[propertytoCheck] = [curr];
    }
    return acc;
  }, {});
  
}
console.log(groupBy(inventory, "type"));
