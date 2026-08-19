If you have 3, 4, or even 10 levels of nesting, hardcoding individual if checks becomes impossible. You need a way to build the nested object path dynamically.
Let's look at the absolute clearest way to write and visualize a multi-level groupBy without drowning in confusion.

### The Clean, Modern Multi-Level Pattern
Instead of complex array tracking, we loop through our list of keys and step deeper into the object layer-by-layer.

const inventory = [
  { name: "iPhone 15 Pro", category: "Electronics", type: "Phone", brand: "Apple" },
  { name: "Galaxy S24", category: "Electronics", type: "Phone", brand: "Samsung" },
  { name: "MacBook Pro", category: "Electronics", type: "Laptop", brand: "Apple" },
  { name: "Air Jordan", category: "Footwear", type: "Sneaker", brand: "Nike" }
];
```
function groupByMultipleLevels(array, keysArray) {
  return array.reduce((acc, curr) => {
    // 1. Start a tracker at the top root of our accumulator object
    let pointer = acc;

    // 2. Walk down the keys array layer-by-layer
    keysArray.forEach((key, index) => {
      const value = curr[key]; // e.g., "Electronics", then "Phone", then "Apple"
      const isLastKey = index === keysArray.length - 1;

      if (isLastKey) {
        // TERMINAL LAYER: If it's the last key, build an ARRAY bucket
        if (!pointer[value]) {
          pointer[value] = [];
        }
        pointer[value].push(curr); // Deposit the item here
      } else {
        // MIDDLE LAYER: If it's not the last key, build an OBJECT directory
        if (!pointer[value]) {
          pointer[value] = {};
        }
        // Move our tracker reference inside this newly confirmed object layer
        pointer = pointer[value]; 
      }
    });

    return acc;
  }, {});
}
```
// Grouping by 3 levels deep: Category -> Type -> Brandconst result = groupByMultipleLevels(inventory, ["category", "type", "brand"]);
console.log(JSON.stringify(result, null, 2));


### The "Tracker" Mental Model: Following a File Path
The variable let pointer = acc is simply a reference tracker. Think of it exactly like creating nested folders on your computer desktop:
Imagine you are processing the `[iPhone 15 Pro](https://www.google.com/search?kgmid=FAILED_OR_SKIPPED)` (["Electronics", "Phone", "Apple"]):

   1. Start: pointer is looking at the root empty object {}.
   2. Key 1 ("category" → "Electronics"):
   * Is "Electronics" a folder inside pointer? No.
      * It creates it: pointer["Electronics"] = {}.
      * Move inside: pointer = pointer["Electronics"]. Now pointer is trapped inside the "Electronics" folder.
   3. Key 2 ("type" → "Phone"):
   * Is "Phone" a folder inside our current layer? No.
      * It creates it: pointer["Phone"] = {}.
      * Move inside: pointer = pointer["Phone"]. Now pointer is pushed deeper, sitting inside the "Phone" folder.
   4. Key 3 ("brand" → "Apple"):
   * This is the last key.
      * It creates an array file bucket: pointer["Apple"] = [].
      * It throws the iPhone item into that list.
   
Because objects in JavaScript copy by reference (not value), editing pointer deep inside the loop updates your main acc object instantly. When the item finishes processing, acc now holds the perfect 3-layer deep nested structure.

### Why this works for any number of levels

* If you pass 2 keys: ["category", "brand"] → It loops twice, shifts the pointer once, and pushes an array.
* If you pass 5 keys: It loops 5 times, shifting the pointer deeper 4 times, and builds a 5-layer deep tree structure seamlessly.

### The Final Output
When you run this script, your code organizes the flat list of objects into a nested 3-layer tree structure (Category $\rightarrow$ Type $\rightarrow$ Brand). Here is exactly what will print out in your terminal:
```
{
  "Electronics": {
    "Phone": {
      "Apple": [
        {
          "name": "iPhone 15 Pro",
          "category": "Electronics",
          "type": "Phone",
          "brand": "Apple"
        }
      ],
      "Samsung": [
        {
          "name": "Galaxy S24",
          "category": "Electronics",
          "type": "Phone",
          "brand": "Samsung"
        }
      ]
    },
    "Laptop": {
      "Apple": [
        {
          "name": "MacBook Pro",
          "category": "Electronics",
          "type": "Laptop",
          "brand": "Apple"
        }
      ]
    }
  },
  "Footwear": {
    "Sneaker": {
      "Nike": [
        {
          "name": "Air Jordan",
          "category": "Footwear",
          "type": "Sneaker",
          "brand": "Nike"
        }
      ]
    }
  }
}
```
### What does JSON.stringify(result, null, 2) do?
If you just run console.log(result), modern console layouts compress deeply nested objects. They will print shortcuts like Phone: [Object] or hide the arrays, making it incredibly annoying to read.
JSON.stringify(object, replacer, space) forces JavaScript to turn the object into a beautiful, fully expanded text block. Here is what each argument does:

* result: The actual JavaScript object you want to convert into text.
* null: The "replacer" argument. Passing null tells JavaScript to include all keys and properties without filtering or altering anything.
* 2: The "space" argument. This is the magic formatting switch. It instructs the engine to indent every nested layer by exactly 2 spaces. If you change it to 4, the layout widens. If you leave it blank, the entire output prints on one massive, single unreadable line.


