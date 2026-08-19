## Map vs. forEach: Why do we need both?

If map can do everything forEach does plus preserve the array layout automatically, why does forEach even exist?
It comes down to Intent and Memory Efficiency.

### 🗺️ Use map when you want a Transformative Pipeline (Data-In $\rightarrow$ Data-Out)

You use map when your goal is to generate a brand new array derived from an old one. It allocates memory for a new array container automatically.

- Example: Converting raw prices into formatted price strings for a UI.

### 🚗 Use forEach when you want a Side Effect (Data-In $\rightarrow$ Trigger Action)

You use forEach when you do not want a new array, and you just want to do something to the outside world for each item. It allocates zero extra array memory.

- Example 1: Saving each item into a database.
- Example 2: Sending an analytics tracking event for each user action.
- Example 3: Modifying the DOM (e.g., appending a HTML <li> element to a page for each array element).

### A Practical Comparison

If you just want to log items to a server, look at what happens under the hood:

// 🚗 CORRECT WAY: Pure side effect, no wasted memory

users.forEach(user => saveToDatabase(user));

// 🗺️ WRONG WAY: This creates an entirely new array of 'undefined' elements // in your computer's RAM, only to throw it away immediately.

users.map(user => saveToDatabase(user));

To summarize: Use map when you want to manufacture new data. Use forEach when you want to execute an action.

