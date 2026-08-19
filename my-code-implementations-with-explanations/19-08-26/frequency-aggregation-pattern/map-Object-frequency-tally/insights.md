## The Map Object Frequency Tally.

### The Final Twist: Aggregation with Map instead of Plain Objects

In standard interviews, you aggregate into a plain object {}. But top-tier interviewers will occasionally add this constraint: "Your frequency counter must preserve the exact insertion order of the elements, or handle keys that aren't strings. Do this without a plain object."
To solve this, you swap out {} for a native Map.

### 📋 The Challenge

Take an array of words (which might repeat) and return a frequency tally using a Map structure.

### 🛠️ The Implementation Pattern

Instead of value in acc, you must use acc.has(value). Instead of acc[value] = count, you must use acc.get(value) and acc.set(value, count).

```
const userActions = ["click", "hover", "click", "scroll", "click", "hover"];
function tallyWithMap(actions) {
  return actions.reduce((acc, action) => {
    // 1. Check if the key exists using .has()
    // 2. Read current count with .get() or default to 0, then add 1
    const count = (acc.get(action) || 0) + 1;

    // 3. Save the updated count using .set()
    acc.set(action, count);

    return acc;
  }, new Map()); // Initial value is a clean Map instance!
}
const frequencyMap = tallyWithMap(userActions);
console.log(frequencyMap);// Output: Map(3) { 'click' => 3, 'hover' => 2, 'scroll' => 1 }
// To read a value from it later:
console.log("Click count:", frequencyMap.get("click")); // Output: 3
```

### Why Interviewers Care About the Map Switch:

1.  No Key Coercion: Plain JavaScript objects convert all keys into strings. A Map lets you keep data types pure (e.g., you can count frequencies of numbers, booleans, or even other objects without them turning into strings).
2.  Built-in Methods: It proves you understand modern ES6 data architecture methods (.has(), .get(), .set()) rather than just relying on legacy dot/bracket notation.
