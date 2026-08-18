## JSX stands for JavaScript XML.

It is a syntax extension for JavaScript that allows you to write HTML-like code directly inside your React files.

While HTML and XML look similar because they both use tags, they have completely different purposes.
HTML is for displaying data (how it looks), while XML is for carrying data (what it means).

#### Key Differences

| Feature           | HTML (HyperText Markup Language)                 | XML (eXtensible Markup Language)                      |
| ----------------- | ------------------------------------------------ | ----------------------------------------------------- |
| Primary Goal      | Displays content on a web browser.               | Stores and transports data across systems.            |
| Tags              | Pre-defined (e.g., `<h1>`, `<p>`, `<div>`).      | Custom / Author-defined (e.g., `<user>`, `<price>`).  |
| Syntax Strictness | Lenient (works even with missing closing tags).  | Extremely strict (fails if a single tag is unclosed). |
| Case Sensitivity  | Not case-sensitive (`<div>` is same as `<DIV>`). | Case-sensitive (`<user>` is different from `<User>`). |

### Side-by-Side Example

HTML: Telling the browser how to style a book

```html
<div>
  <h1>JavaScript Basics</h1>
  <p>Price: ₹499</p>
</div>
```

The browser reads this and instantly knows to make the title big and bold.

XML: Storing raw book data to send to another server

```xml
<book>
  <title>JavaScript Basics</title>
  <price currency="INR">499</price>
</book>
```

A browser won't style this automatically. It is just structured data that a software program can easily read and process.

# Why this matters for React (JSX)

React uses JSX (JavaScript XML) because it combines the best of both:

- It looks like HTML so you can design layouts easily.
- It follows the strict rules of XML (like mandatory closing tags and case sensitivity for components) so JavaScript can reliably convert it into real webpage elements.

Under the hood, browsers cannot read JSX or XML. React must use a build tool (like Babel or Vite) to convert your XML-like syntax into standard JavaScript functions.
Because XML has incredibly strict rules, it provides the perfect structure for React to parse your code safely.

## Here is exactly how React uses those XML rules to build your app.

### Rule 1: Every tag must be explicitly closed

In standard HTML, you can get away with lazy coding, like leaving an image tag unclosed (`<img alt= "img" src="logo.png">`).
XML forbids this. Because React follows XML rules, you must close everything, or the JavaScript compiler will break.

// ❌ Invalid JSX (Throws a syntax error)

const element = `<img src="logo.png">`

// Valid JSX (Self-closing tag)

const element = `<img src="logo.png" /> `

What it becomes in JavaScript:

React turns that tag into a function call. An unclosed tag means an unclosed function call, which breaks the code.

// Standard JavaScript output

const element = React.createElement('img', { src: 'logo.png' });

### Rule 2: Case sensitivity determines what is HTML vs. React

As we discussed earlier, XML is strictly case-sensitive. React uses this specific XML rule to know whether you are rendering a standard browser element or a custom React component.

// Lowercase = Standard HTML

const myElement = `<button>`Click`</button>`;// JavaScript output: React.createElement('button', null, 'Click')

// Uppercase = Custom React Component

const myElement = `<Button>`Click`</Button>`;// JavaScript output: React.createElement(Button, null, 'Click')

Notice that the second one passes the actual JavaScript variable Button instead of a string 'button'.

### Rule 3: There must be a single root element

In XML, a document can only have one main parent tag enclosing everything. This is why React components cannot return multiple sibling tags without wrapping them.

// ❌ Invalid JSX (Two root elements at the same level)

return (
`<h1>`Hello`</h1>`
`<p>`Welcome`</p>`
);
// Valid JSX (Wrapped in a single parent or Fragment)

return (
<>
`<h1>`Hello`</h1>`
`<p>`Welcome`</p>`
</>
);

### What it becomes in JavaScript:

A JavaScript function can only return one single value at a time. By forcing a single XML root element, React can wrap all the children neatly inside one single function execution:

// Standard JavaScript output

return React.createElement(
React.Fragment,
null,
React.createElement('h1', null, 'Hello'),
React.createElement('p', null, 'Welcome')
);
