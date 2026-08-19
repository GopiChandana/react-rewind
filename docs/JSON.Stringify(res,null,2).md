Inside JSON.stringify(res1, null, 2), the null and the 2 act as styling settings to turn a messy, single-line text string into a beautifully formatted, readable layout.

Here is exactly what each piece does:

### 1. What does the 2 do? (The Indentation Switch)
By default, JSON.stringify squeezes all data onto a single massive, continuous line to save memory.
Passing 2 forces JavaScript to break lines and indent every nested layer by exactly 2 spaces [dataviz].

* If you change it to 4, the formatting will widen with 4 spaces.
* If you leave it out, everything stays on one long line.

| Without 2                          |  With 2 |
|---|---|
| {"name":"Alex","status":"Premium"} | 
                                       {
                                        "name": "Alex",
                                        "status": "Premium"
                                        } |


### 2. What does the null do? (The Replacer Filtering Switch)
The middle argument is officially called the Replacer. It allows you to filter out specific keys or modify values before converting the object to text.
Passing null simply means: "Do not filter or change anything. Print 100% of the keys and data exactly as they are."
### When would you use something other than null?
If your database has highly sensitive information (like passwords) that you don't want to print to your logs, you can pass an array of acceptable keys instead of null:

const user = { name: "Alex", password: "secret123", status: "Premium" };
// Only print 'name' and 'status', completely hiding the password!
console.log(JSON.stringify(user, ["name", "status"], 2));

### Summary Shortcut
Writing JSON.stringify(data, null, 2) is the universal developer shortcut for: "Print all my data exactly as it is, but make it pretty and readable."
Now that the logging mechanics are crystal clear, let me know if we should move to coding your Promise.all polyfill, or explore performance optimizations like Debounce!

