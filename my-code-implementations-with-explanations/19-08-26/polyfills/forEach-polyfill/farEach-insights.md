# The Fatal Bug: forEach should never mutate natively

Native Array.prototype.forEach never overwrites array data on its own. It is strictly a read-only loop tool.

If someone passes a function that returns a value (like your arrow function num => num - 1), forEach is supposed to completely ignore that return value.

With your current modification, look what happens if someone uses your polyfill for a basic calculation:

```
const userAges =;
// The developer just wants to check if anyone is over 21
userAges.myCustomForEach((age) => {
    return age > 21;
});
```

console.log(userAges); // NATIVE EXPECTED: [20, 25, 30] (Unchanged)// YOUR CURRENT CODE: [false, true, true] ❌ (You permanently destroyed their original data!)

### The Rule to Follow

- If you want to read elements without changing the original array size or data: Use forEach (without array[i] =).

- If you want to transform values and save them into a brand new array: Use map.

- If you want to mutate the original array inside a forEach, the developer must do it explicitly in their callback, not your polyfill.

### The Correct, 100% Compliant Version

To make it perfect and compliant, remove the array[i] = assignment from line 14:

```
Array.prototype.myCustomForEach = function(callback, thisArg){
    if(this === null){
        throw new TypeError("cannot read properties of null or undefined")
    }
    if(typeof callback !== 'function'){
       throw new TypeError(callback + " is not a function")
    }

    const array = Object(this);
    const length = array.length >>> 0;

    for(let i = 0; i < length; i++){
        if(i in array){
            // CORRECT: Just execute the function. Do not capture or assign its return.
            callback.call(thisArg, array[i], i, array);
        }
    }

    return undefined;
};
```

#### No, forEach does not change the original array on its own. This is one of the most common misconceptions in JavaScript.

forEach is purely a read-only loop. It passes data to your callback function, but it completely ignores anything that function returns.
The only way a forEach loop changes an array is if you explicitly write code inside the callback to modify it.

### The Two Ways to Read and Handle Data with forEach

To understand how to read your changes, let's look at the two distinct ways developers use forEach via line-by-line simulations.

### Simulation 1: The "Read-Only" Approach (Using an External Variable)

If you don't want to destroy your original array, you create a separate bucket (like a counter or a new array) outside the loop, fill it up inside the loop, and read it afterward.

```
const originalArray =;

const resultsBucket = []; // 1. Create an external bucket

originalArray.myCustomForEach(function(num) {
  // 2. Put the calculated value into the external bucket
  resultsBucket.push(num - 1);
});
// 3. Read your changes here!
console.log("Original Array:", originalArray); // [10, 20, 30] (Safe and untouched!)
console.log("Calculated Changes:", resultsBucket); // [9, 19, 29] (Here are your changes!)
```

### Simulation 2: The "Explicit Mutation" Approach (Changing the Original Array)

If you explicitly want to overwrite the original array, you cannot rely on the polyfill to do it for you. You must accept the index (i) and the source array (arr) arguments inside your callback, and manually assign the new value.

```
const originalArray =;
// We accept 'i' (index) and 'arr' (the live array reference)
originalArray.myCustomForEach(function(num, i, arr) {
  // We explicitly target and overwrite the array item at index 'i'
  arr[i] = num - 1;
});
// Read your changes here!
console.log("Original Array:", originalArray); // Output: [9, 19, 29] (Permanently mutated because YOU ordered it on line 5!)
```

### Comprehensive Simulation of Your Original Setup

Let's trace your sparse array setup using the correct, read-only myCustomForEach polyfill to see why your traditional function test seemed like it wasn't working.

```
// 1. The Perfect Read-Only Polyfill
Array.prototype.myCustomForEach = function(callback, thisArg){
    const array = Object(this);
    const length = array.length >>> 0;
    for(let i = 0; i < length; i++){
        if(i in array){
            callback.call(thisArg, array[i], i, array); // Just runs it, does not save it!
        }
    }
    return undefined;
};

// 2. The Setup

const orgArray2 = [10, , 30]; // Index 1 is an empty hole

const obj = { number: 1 };

const trackedChanges = []; // We create a bucket to read our changes later!

// 3. The Execution

orgArray2.myCustomForEach(function(num, i, arr){
    const calculation = num - this.number;
    trackedChanges.push(calculation); // Save it to our reading bucket
}, obj);
```

### Behind-the-Scenes Execution Steps:

- i = 0 (Value = 10):
- 0 in array is true. The polyfill runs your function.
  - Inside your function: 10 - obj.number ($10 - 1 = 9$).
  - trackedChanges.push(9) executes.
- i = 1 (Empty Hole):
- 1 in array is false. The polyfill skips index 1 entirely. Your function never runs.
- i = 2 (Value = 30):
- 2 in array is true. The polyfill runs your function.
  - Inside your function: 30 - obj.number ($30 - 1 = 29$).
  - trackedChanges.push(29) executes.

### Reading the Final State:

console.log(orgArray2); // Output: [10, <1 empty item>, 30] (Original stays pure)
console.log(trackedChanges); // Output: [9, 29] (Read your successfully computed changes here!)

#### To clarify precisely: Native forEach does not change the original array on its own, and your polyfill should not either.

It is designed to be a read-only tool. If a developer wants to change the original array using forEach, they must do it manually inside their callback function by writing array[index] = newValue. Your polyfill shouldn't force that mutation on them.

### What happens if your Polyfill forces mutation? (The Breaking Point)

If you keep the array[i] = callback.call(...) line inside your polyfill, you break standard JavaScript code. Here is a real-world scenario where your code will break an application:

```
// A developer wants to count how many scores are passing (>= 50)

const examScores =;

let passingCount = 0;

// Native forEach ignores the return value. The scores stay as numbers.

examScores.myCustomForEach((score) => {
  if (score >= 50) {
    passingCount++;
  }
  return score >= 50; // Returns true or false
});

console.log(passingCount); // Output: 2
console.log(examScores);   // EXPECTED NATIVE OUTPUT: [45, 80, 55, 30]// YOUR MUTATING OUTPUT:  [false, true, true, false] ❌ (You just erased the student's actual grades!)
```

### The Final Verdict for Your Interview / Repository

1.  Keep your polyfill read-only (Remove array[i] = and just leave callback.call(...)). This makes it 100% compliant with native JavaScript specifications.
2.  If you want to test your traditional function and see the array change, change your test script at the bottom of your file to mutate it explicitly:

const orgArray2 = [1, 2, 4, , 5, 6, , 7, , , , 9];const obj = { number : 1 };
// The developer (you) explicitly mutates using the index 'i' and array 'arr'
orgArray2.myCustomForEach(function(num, i, arr){
arr[i] = num - this.number;
}, obj);

console.log(orgArray2); // Output: [0, 1, 3, <1 empty item>, 4, 5, <1 empty item>, 6, <4 empty items>, 8]
