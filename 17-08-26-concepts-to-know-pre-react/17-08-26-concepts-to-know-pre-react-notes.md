- package.json - a configuration for npm

- npm manages packages but doesnt stand for node package manager

- npm install -D package-name => -D => devdependencies

- devDependencies used in developer env like tools for building

- normal dependencies in production

- node-modules are like databases for packages installed

- package.json -> configuration for npm

- transitive dependencies -> like in node modules ideally only parcel should be there when i first installed but there are several others bcoz parcel as a project depends on some other dependencies and those dependencies depend on some other this chain is called transitive dependency.package-lock .json contains exact versions of all dependencies and transitive dependencies nd node modules contains the code.

- In Babel, a preset is a pre-packaged bundle of plugins.By itself, Babel is an empty shell. It does absolutely nothing to your code. If you pass an arrow function through a raw Babel installation, it outputs the exact same arrow function.To make Babel change anything, you have to give it explicit rules called plugins.To convert an arrow function, you need: @babel/plugin-transform-arrow-functions.To convert classes, you need: @babel/plugin-transform-classesTo convert template literals, you need: @babel/plugin-transform-template-literals.Configuring dozens of these manually for modern React would take hours. Presets solve this.

1. @babel/preset-env (The Browser Compatibility Preset)This is a smart preset that contains every single plugin needed to convert modern JavaScript (ES6, ES7, etc.) down to old browser-safe JavaScript.Instead of guessing what features older browsers lack, this preset automatically analyzes target environments and applies only the exact plugins required to make your code run safely there.

2. @babel/preset-react (The React Preset)Web browsers do not know what HTML tags like `<div>` or `<h1>` are doing inside a JavaScript file. This preset bundles the plugins required to handle React code. It automatically strips out JSX tags and converts them into standard browser-readable code:

   // Before Preset-React runs:
   const element = `<h1>`Hello`</h1>`;

   // After Preset-React runs:
   const element = React.createElement("h1", null, "Hello");

3. @babel/preset-typescript (The TypeScript Preset)Browsers do not understand type annotations (like : string or : number). If a browser sees them, it crashes with a syntax error.This preset contains the plugins that tell Babel to strip away all type definitions, interfaces, and annotations completely, leaving behind pure, clean JavaScript that any engine can execute.

- "browserslist": [
  "> 0.2%",
  "last 4 versions",
  "not dead"
  ] - what does this mean
  1. "> 0.2%"Meaning: Target any browser version that currently accounts for more than 0.2% of global web usage.Why it matters: This ensures you automatically support mainstream web clients (like modern Chrome, Safari, Edge, and Firefox releases) across the globe while safely dropping support for obsolete variants that virtually nobody uses anymore.
  2. Meaning: Explicitly support the last 4 consecutive releases of every major browser platform.Why it matters: Many users or corporate environments postpone system updates for months. By compiling code back through 4 version generations, you guarantee that recruiters using older corporate laptops or lagging operating systems can open your project without encountering runtime crashes.
  3. Meaning: Exclude "dead" browsers—defined as official platforms that no longer receive commercial security updates or maintain less than 0.5% global usage for over 24 months (such as Internet Explorer 11 or BlackBerry browser).Why it matters: It stops your compiler from bloating your final production files with massive, unnecessary code polyfills meant for entirely defunct software engines.
  4. RUN npx browserslist to check list of browsers.

* we dont need to push node_modules in git bcoz if we have package.json and package-lock.json we. can recreate node_modules. so basically whatever we can regenerate no need to push to git.

* npm - installing a package , npx - executing a package
* <!-- <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script> -->

      <!-- Adding these two script tages makes that project having React inside it and browser will understand react but better to install as dependency since its expensive operation to go to unpkg and fetch and also versions are fixed in cdn links we need to keep updated-->

* Parcel builder features:
  1. Dev build
  2. hosts local server
  3. HMR - Hot Module Replacement - instant changes reflect on browser as soon as saved in vs code ..HOW ? parcel does file tracking algorithm which is wrritten in C++.
  4. Parcel gives faster builds bcoz of caching
  5. Parcel also does image optimization
  6. Minification of files
  7. Bundling
  8. Compression
  9. Consistent Caching :
     In web bundlers like `[Parcel](https://github.com/parcel-bundler/parcel)`, the term "consistent hashing" is often used interchangeably with Content Hashing. It is a foundational feature that manages how built assets (.js, .css, optimized images) are named and cached.
     - The Core Goal: Long-Term Caching
       When users visit your website, their browsers download your code and save it (cache it) locally so the site loads faster next time.
     - The Problem: If you fix a bug in App.js and push it to production, how does the user's browser know it needs to throw away the old file and download the new one?
     - The Solution: Content Hashing.

     ***
     - How Parcel Uses Content Hashing
       Whenever you run a production build (parcel build index.html), Parcel reads the exact text and content inside your individual files. It passes that content through a cryptographic hash function to generate a short, unique string of characters. It then injects this string into the output filename:

     - index.css → index.cd99c106.css
     - App.js → App.83145ee1.js

     - Why it is "Consistent" (Stable)
     1. Identical content = Identical hash: If you build your project 100 times without changing a single line of code in App.js, the output filename will remain exactly App.83145ee1.js. The hash is completely deterministic.
     2. Any change = Brand new hash: If you modify even a single character (like changing a color from blue to purple), the mathematical hash completely changes, and Parcel builds a file named something like index.f2a83b19.css.

     ***
     - The Massive Benefit: Instant CDN and Browser Invalidation
       Because the filenames are tied strictly to the content, production servers can safely tell browsers to store these assets forever (using a Cache-Control: max-age=31536000, immutable header).
       When you ship an update:
     - Unchanged files retain their original filenames, meaning returning users instantly load them from their local cache without wasting network data.
     - Modified files get a brand-new name, forcing the browser to download the updated file immediately.

     - What Stays Unchanged?

     By default, entry files (like your primary root index.html) do not receive a dynamic content hash. They must maintain a static name so your website URL stays predictable (e.g., ://yoursite.com). Instead, Parcel updates the internal `<link>` and `<script>` tags inside that HTML file to point to the freshly hashed CSS and JS bundles automatically.

     If you ever need to disable this behavior during specific deployments, you can pass the following flag to the build command:

     parcel build index.html --no-content-hash

     Note: This keeps a hash in the file name structure but prevents it from recalculating based on content changes.

  10. code splitting
      Code splitting is an optimization technique that breaks your massive, single JavaScript bundle into smaller, bite-sized chunks.
      Instead of forcing a user to download your entire application's code upfront, the browser only downloads the specific code needed for the page they are currently looking at.

      ***
      - How Code Splitting Works in Parcel
        In many bundlers (like Webpack), setting up code splitting requires complex configuration files. In `[Parcel](https://github.com/parcel-bundler/parcel)`, it is completely automatic.

      - Parcel triggers code splitting the moment it encounters a Dynamic Import (import()) in your JavaScript or React files.

      - How to Implement It in React

        The most common way to use code splitting in React is through React.lazy and Suspense. This allows you to dynamically load entire components or pages only when they are rendered on the screen.

      - Example: Dynamic Routing / Component Loading
        Imagine you have a heavy component, like a data dashboard view (Dashboard.js), that users only see after logging in.

```
      import React, { lazy, Suspense } from 'react';

      // 1. Static Import (Loaded immediately on page load)

      import Navbar from './components/Navbar';

      // 2. Dynamic Import (Parcel splits this into a separate file automatically)

      const Dashboard = lazy(() => import('./components/Dashboard'));

      function App() {
      return (
      <div>
          <Navbar />

          {/* 3. Wrap the lazy component in Suspense with a fallback loading UI */}
            <Suspense fallback={<div>Loading Dashboard...</div>}>
              <Dashboard />
            </Suspense>
        </div>
        );
        }
      export default App;
```

- What Parcel Does Behind the Scenes

  When you run parcel build index.html on the code above, Parcel analyzes your dependency tree and creates two separate output files in your dist folder:
  1. index.83145ee1.js (The main bundle containing Navbar, App, and core React engine files).
  2. Dashboard.cd99c106.js (The split bundle containing only the code for the dashboard view).

  When a user visits your website, their browser downloads the tiny main bundle instantly. The moment they click over to view the dashboard, Parcel's runtime engine sends a quick network request to fetch Dashboard.cd99c106.js on demand.

  ***
  - 🚀 Key Benefits of Code Splitting

  - Faster Initial Load: Users don't waste data downloading code they might never see (like administrative panels or profile settings pages on their first visit).
  - Better Caching (Consistent Hashing): If you update the code inside your Dashboard component, only the hash for that specific file changes. Users won't have to re-download the main bundle files when returning to your site.
  - Parallel Loading: Parcel handles loading your split chunks and any associated split CSS files simultaneously to prevent layout flashes.

11. differential bundling

    Differential Bundling is an optimization strategy where Parcel builds two entirely different versions of your JavaScript code for production:
    1. Modern Bundle: Fast, tiny, un-transpiled code sent to modern browsers.
    2. Legacy Bundle: Larger, transpiled code with extra fallback code (polyfills) sent to older browsers.
    - Parcel handles this completely automatically based on your project configuration, ensuring that modern devices aren't slowed down by fixes meant for old tech.
    - The Problem It Solves
      Older browsers (like Internet Explorer or old versions of Safari) don't understand modern JavaScript features like arrow functions (() => {}), classes, or async/await.
      Traditionally, developers had to transform all their code into old ES5 syntax so it would run everywhere. However, this transformation makes the file size significantly larger and slower to execute on modern smartphones and laptops.

    ***
    - How Parcel Implements It Automatically
      Parcel triggers differential bundling based on how you write your script tags in your index.html file.
    - 1. The Modern Target (type="module")
         When you include your script like this, modern browsers look at the type="module" attribute and know they can safely execute modern JavaScript.

    `<script type="module" src="./index.js">``</script>`
    - What Parcel creates: A highly optimized file utilizing modern syntax. It skips generating massive chunks of helper code because modern engines handle the syntax natively.

    - 2. The Legacy Target (nomodule)
         Older browsers do not understand type="module" and will completely ignore that tag. To serve them, you can provide a fallback script using the nomodule attribute:

    `<script nomodule src="./index.js">``</script>`
    - What Parcel creates: A heavily processed bundle where modern code is converted into old-school JavaScript, packed with polyfills to simulate features that the old browser lacks.

    ***
    - How to Tell Parcel Which Browsers to Target
      Parcel reads a key in your package.json file called browserslist to know exactly how aggressive it should be with its optimizations.
      You can add this to your package.json to define your target audience:

    {
    "name": "react-rewind",
    "version": "1.0.0",
    "browserslist": [
    "last 2 Chrome versions",
    "last 2 Safari versions",
    "last 2 Firefox versions",
    "Edge >= 79"
    ]
    }
    - 🚀 The Key Benefits
      - Faster Performance: Over 90% of your users run modern browsers and will download smaller files that parse and run much faster.
      - No Extra Setup: You do not need complex Webpack config plugins. Parcel looks at your HTML tags and outputs both versions into your dist folder natively.

12. Diagnostics (in terminal local it gives errors) and Error handling (good error view)

13. local server running on http but parcel also gives us a chance to run in https.Parcel does this by automatically generating a temporary, locally trusted SSL certificate for your machine the moment you tell it to run securely and changes accordingly made in package.json now when u write command "npm run start:secure" in terminal it automatically runs in https.

14. Tree shaking(remove unused code)

15. Different builds for prod(npx parcel build index.html or npm run start prod) and dev (prod takes a bit more time for optimization)

REFERENCE : `https://parceljs.org/`
