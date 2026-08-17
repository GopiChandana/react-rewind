import "./index.css";

const heading1 = React.createElement("h1", { id: "heading" }, "Hello Gopi From React");
// creating element in react

//  Nested like 
//  <div id="heading">
//  <div id="child">
//      <h1>Hello H1</h1>
//  </div>

//  </div>

const heading2 = React.createElement("div", { id: "parent" }, React.createElement("div", { id: "child" }, [React.createElement("h1", {}, "Hello H1"),React.createElement("h2", {}, "Hello H2")]))

//  in create element its creating an object and while rendering into dom its converting into html and injects it. so React.createELEMWNT IS FOR CRETING AN OBJECT

console.log(heading2)


const root = ReactDOM.createRoot(document.getElementById("root"));
// we are using react dom bcoz we need to render all this stuff on dom 
root.render(heading2)