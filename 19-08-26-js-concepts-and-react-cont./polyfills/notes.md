## REFER CODE FOR POLYFILLS IN DETAIL UNDER MY_CODE_IMPLEMENTATIONS_WITH_DETAILED_EXPLANATIONS

### 🧱 What is a Polyfill?

A polyfill is a piece of code (usually JavaScript on the web) used to provide modern functionality on older browsers that do not natively support it.

- The Analogy: Imagine you buy a modern multi-plug electronic device, but you travel to an old house with ancient wall sockets. A polyfill is the physical adapter you plug in so your modern device can still draw power.
- Why we need it: JavaScript evolves every year (ES6, ES7, etc.). Modern browsers understand new features like .includes() or Promise.all(), but older enterprise browsers do not. A polyfill checks if a feature exists; if it doesn't, it injects a fallback version using old, universally understood JavaScript.

---

### 🎯 The 3 Core Polyfills Interviewers Ask For

In a corporate interview, you will almost never be asked to write a polyfill for something basic. Interviewers will specifically ask you to write a custom polyfill for high-order array methods or functional methods.
Let's look at the absolute favorites:

### 1. Polyfill for Array.prototype.map()

The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.

```
// Step 1: Attach our custom function to the global Array structure so any array can use it.
Array.prototype.myMap = function (callback) {

  // Step 2: Create a brand new, empty bucket to hold our transformed values.
  const result = [];

  // Step 3: Run a basic loop to look at every single item inside the array.
  // 'this' refers to the array that called myMap (e.g., [1, 2, 3]).
  for (let i = 0; i < this.length; i++) {

    // Step 4: Take the current item, pass it into the user's custom rule (callback),
    // and store the brand new calculated value.
    const transformedValue = callback(this[i], i, this);

    // Step 5: Push that transformed value into our output bucket.
    result.push(transformedValue);
  }

  // Step 6: Hand back the completed new array.
  return result;
};

```

---

This is the most common point of confusion in JavaScript, so do not worry! Let’s completely demystify this line.
To understand callback(this[`i`], i, this), you have to understand that the callback is not a value—it is an empty instruction manual that the user passes into your function.

### 🔍 The Story of the Machine and the Instruction Manual

Think of your polyfill myMap like a factory machine. The machine knows how to loop through a box of items, but it has no idea what to do to the items. It needs an operator to hand it a specific instruction manual.
That instruction manual is what we call the callback function.

### Line-by-Line Execution Walkthrough

Let's look at this specific execution:

const normalNumbers =;

const result = normalNumbers.myMap((num) => {
return num \* 2;
});

When you hit execute, here is exactly what happens step-by-step inside the machine:

### Loop Round 1 (i = 0):

1.  this[i] is this[0], which is 10.
2.  The index i is 0.
3.  this is the whole array: [10, 20, 30].
4.  The machine reaches the line: callback(this[i], i, this);
5.  It substitutes the variables: callback(10, 0, [10, 20, 30]);
6.  Now, it runs the instruction manual (num) => { return num \* 2; } using those inputs.
7.  The manual takes 10, multiplies it by 2, and returns 20.
8.  The line result.push(...) grabs that 20 and drops it into your bucket.

### Loop Round 2 (i = 1):

1.  this[i] is this[1], which is 20.
2.  The index i is 1.
3.  The machine runs: callback(20, 1, [10, 20, 30]);
4.  The instruction manual takes 20, multiplies it by 2, and returns 40.
5.  result.push(...) drops 40 into your bucket.

---

### 🎨 What if we change the instruction manual?

The beauty of the callback is that it is dynamic. If tomorrow you want to add 5 instead of multiplying, you change the manual:

const dynamicNumbers = normalNumbers.myMap((num) => {
return num + 5;
});

Now, when the machine hits callback(this[i], i, this), it uses the new manual:

- Loop 1 runs callback(10, 0, ...) $\rightarrow$ Manual returns 15 $\rightarrow$ Pushed to bucket.
- Loop 2 runs callback(20, 1, ...) $\rightarrow$ Manual returns 25 $\rightarrow$ Pushed to bucket.

### 💡 Summary

callback(...) is simply executing the code block that the user wrote outside your polyfill, passing the current array item into it, and capturing whatever value comes back out.
Create that map-test.js file inside your my-code-implementations folder right now and add a console.log(dynamicNumbers) at the end to see the final bucket print out on your MacBook terminal.
Let me know if seeing it run helps it fully click!

This is the exact logical question that separates a beginner developer from someone who understands JavaScript deeply. It is a fantastic catch.
To clarify a tiny syntax detail first: you are only pushing the final calculated single result into the bucket (result.push(transformedValue)). You are not pushing all three items into the array.
However, your question is: "Why do we need to pass this[`i`], i, this into the execution of the callback?"
Here is the simple, real-world reason why passing all three is mandatory for a perfect polyfill.

### 💡 The Core Reason: You Don't Know What the User Needs

When you write a polyfill, you are building a generic tool for other developers. You do not know what kind of logic they will write inside their custom callback functions.
While 80% of the time they only need the item itself (this[i]), JavaScript's native .map() specifications state that the callback has the right to access the index position and the entire original array if it wants to.

### 🎨 Scenario 1: When Only this[i] is Enough (Basic)

If a developer just wants to multiply numbers, they don't care about the index position. They write:

const doubled = [10, 20, 30].myMap((item) => item \* 2);

In this case, your loop passes (10, 0, [10,20,30]) into the callback. The user's code just ignores the 0 and the array, takes the 10, multiplies it, and gives you back 20. It works perfectly.

### 🚀 Scenario 2: When the Index (i) is Absolutely Required (Advanced)

What if a developer wants to multiply each number by its index position in the array?

- Item 10 is at index 0 $\rightarrow$ should become 10 \* 0 = 0
- Item 20 is at index 1 $\rightarrow$ should become 20 \* 1 = 20
- Item 30 is at index 2 $\rightarrow$ should become 30 \* 2 = 60

To achieve this, the developer will write their callback instruction manual like this:

const indexedNumbers = [10, 20, 30].myMap((item, index) => item \* index);

If your polyfill loop only executed callback(this[i]), the variable index inside the user's manual would be undefined. The calculation would break, resulting in 10 \* undefined = NaN (Not a Number).
By passing callback(this[i], i, this), you ensure that if the user's manual asks for the index position (index), your loop safely hands it over to them.

### 🌐 Scenario 3: When the Original Array (this) is Required

Sometimes, a developer needs to compare the current item against the average of the entire array, or check the next element in the list. They need access to the whole parent array inside their rule:

const checkBalance = [10, 20, 30].myMap((item, index, originalArray) => {
// They can check properties of the original parent array here!
return item + originalArray.length;
});

### 🎯 Summary

Passing this[i], i, this acts like providing a complete toolkit to the callback function.

- The callback function can choose to grab just the first tool (the item).
- Or it can grab all three tools (item, index, whole array).

By writing callback(this[i], i, this), your custom adapter handles every single use-case flawlessly, making it a 100% compliant native polyfill that will pass any senior corporate interview.
Did seeing how the user can dynamically request the index variable help it make total sense? Let me know, and we can seamlessly transition into the Filter polyfill next!

---

## MAJOR MISTAKE DONE

```
Array.prototype.myCustomMap = (callback)=>{
    const result = []

    for(let i=0;i<this.length;i++){
        const transformedValue = callback(this[i],i,this)
        result.push(transformedValue)
    }
    return result
}

const normalArray = [1,2,3,4,5]

const finalArray = normalArray.myCustomMap((num)=> num/2)

console.log(finalArray) // []
```

Ah! Seeing that empty bracket [] in your mind clarifies everything. Your terminal is actually working perfectly and compiling the file.
The output is returning an empty array [] because of a subtle JavaScript arrow function scope trap in your code. Let's fix it right now.

### 🔍 The Mistake: The Arrow Function Return Trap

Look closely at line 5 of your code in the screenshot:

const transformedValue = callback(this[i], i, this)

Now, look at line 1 of your file where you defined your polyfill structure:

Array.prototype.myCustomMap = (callback) => { ... }

You used a fat arrow function (=>) to define myCustomMap.

### ⚠️ Why Arrow Functions Break Polyfills

In JavaScript, arrow functions do not have their own binding to the this keyword. Instead, they look outside themselves at the global context.

- Because myCustomMap is an arrow function, this.length is evaluating to 0 inside your loop.
- The loop for (let i = 0; i < this.length; i++) never runs even a single round. It immediately jumps straight to line 8 and returns your empty result array [].

### 🛠️ The Direct Fix: Use a Traditional Function

To allow the array normalArray to pass its own elements into your polyfill via the this keyword, you must use a standard JavaScript function definition.
Change line 1 of your code from this:

Array.prototype.myCustomMap = (callback) => {

To this exact standard function syntax:

Array.prototype.myCustomMap = function(callback) {

### 📥 Complete Correct Code Checklist

Make sure your file looks exactly like this:

Array.prototype.myCustomMap = function(callback) {
const result = [];

    for (let i = 0; i < this.length; i++) {
        const transformedValue = callback(this[i], i, this);
        result.push(transformedValue);
    }

    return result;

};
const normalArray =;const finalArray = normalArray.myCustomMap((num) => num / 2);

console.log(finalArray);

Hit Cmd + S to save your changes, and run your terminal command one more time:

node array-map-polyfill.js

You are about to witness the true output display on your terminal screen! Let me know when those numbers load.

---

### 2. Polyfill for Array.prototype.filter()

The filter() method creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test implemented by the provided function.

```
if (!Array.prototype.myFilter) {
  Array.prototype.myFilter = function (callback) {
    const result = [];

    for (let i = 0; i < this.length; i++) {
      // If the callback returns true, push the element to results
      if (callback(this[i], i, this)) {
        result.push(this[i]);
      }
    }

    return result;
  };
}
// How to test it:const scores =;const highScores = scores.myFilter((score) => score > 15);
console.log(highScores); // [25, 30]
```

### 3. Polyfill for Array.prototype.reduce()

This is the "boss level" array polyfill that corporate interviewers use to filter out average candidates. reduce() executes a user-supplied "reducer" callback function on each element of the array, passing in the return value from the calculation on the preceding element.

```
if (!Array.prototype.myReduce) {
  Array.prototype.myReduce = function (callback, initialValue) {
    // If accumulator isn't provided, use the first element of the array
    let accumulator = initialValue !== undefined ? initialValue : this[0];

    // If accumulator wasn't provided, start loop from index 1, otherwise index 0
    let startIndex = initialValue !== undefined ? 0 : 1;

    for (let i = startIndex; i < this.length; i++) {
      accumulator = callback(accumulator, this[i], i, this);
    }

    return accumulator;
  };
}
// How to test it:const expenses =;const total = expenses.myReduce((acc, curr) => acc + curr, 0);
console.log(total); // 600
```

---

### 🧠 How to Explain Polyfills to an Interviewer

If asked about polyfills in a structured technical screening, structure your answer using these three punchy talking points:

1.  Definition: "A polyfill is developer-written fallback code that implements modern JavaScript features in environments or older browsers that natively lack support."
2.  Prototype Chaining: "We implement polyfills by attaching our custom functions directly to the global prototypes (like Array.prototype or Function.prototype) so they become available globally across the application execution."
3.  Modern Alternative: Mention that in modern production environments, developers don't write all polyfills manually. We use automated transpilers like Babel and libraries like Core-js to handle polyfilling automatically during the build process. (Mentioning this shows real corporate architecture awareness!)

### 1. Asynchronous Polyfills (The Most Common Next Step)

Because frontend engineering handles heavy API data, interviewers want to see if you can handle asynchronous flow control manually.

### 🔸 Polyfill for Promise.all()

Promise.all takes an array of promises and returns a single promise that resolves only when all input promises resolve. If even one rejects, the whole thing rejects.

```
if (!Promise.myAll) {
  Promise.myAll = function (promises) {
    return new Promise((resolve, reject) => {
      const results = [];
      let completedPromises = 0;

      if (promises.length === 0) {
        resolve(results);
        return;
      }

      promises.forEach((promise, index) => {
        // Wrap in Promise.resolve in case a non-promise value is passed
        Promise.resolve(promise)
          .then((value) => {
            results[index] = value; // Keep original index order
            completedPromises += 1;

            // If all promises are done, resolve the final array
            if (completedPromises === promises.length) {
              resolve(results);
            }
          })
          .catch((error) => {
            reject(error); // Reject immediately if any promise fails
          });
      });
    });
  };
}
```

---

### 2. Functional Context Polyfills (The Structural Core)

These test your understanding of JavaScript scope, memory allocation, and the execution context (this keyword).

### 🔸 Polyfill for Function.prototype.bind()

The bind() method creates a new function that, when called, has its this keyword set to the provided value.

```
if (!Function.prototype.myBind) {
  Function.prototype.myBind = function (context, ...args) {
    const originalFunction = this; // 'this' refers to the function itself

    return function (...newArgs) {
      // Execute original function using apply to bind the context and combine arguments
      return originalFunction.apply(context, [...args, ...newArgs]);
    };
  };
}
```

---

### 3. Performance Optimization Polyfills (Frontend Specific)

These two are technically custom utility implementations rather than native browser prototypes, but interviewers frequently ask for them under the guise of "polyfills" to test your browser performance awareness.

### 🔸 Polyfill / Implementation for debounce()

Debouncing ensures that a function is not called again until a certain amount of time has passed since its last execution (e.g., waiting for a user to stop typing in a search bar).

```
function myDebounce(func, delay) {
  let timer;

  return function (...args) {
    const context = this;

    // Clear previous pending timer if user acts before delay finishes
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
```

### 🔸 Polyfill / Implementation for throttle()

Throttling guarantees that a function is executed at most once every specified time interval (e.g., handling rapid page-scrolling events).

```
function myThrottle(func, limit) {
  let inThrottle = false;

  return function (...args) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;

      // Reset lock block after the time limit passes
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
```
