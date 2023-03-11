1. What is the difference between Component and PureComponent? give an
example where it might break my app.

- PureComponent implements shouldComponentUpdate lifecycle method with a shallow comparison of the current and next props and state, and it only re-renders if there are differences  

PureComponent does shallow comparison , so it could be the case where complex data structures changes frequently and it may not detect the changes.

2. Context + ShouldComponentUpdate might be dangerous. Can think of why is
that?

Unexpected behaviour like child components not updating when the context value changes. This is because shouldComponentUpdate only compares the context object reference, not its value. To avoid this, it's recommended to use the useContext hook instead of the static contextType property or the Consumer component.

3. Describe 3 ways to pass information from a component to its PARENT.

Using callback functions: the parent passes a function as a prop to the child component, which the child component can call with the updated information.

Using props: the child component can update its props, which causes the parent component to re-render with the updated information.

Using context: the child component can update the context value, which can be consumed by any ancestor component that uses the useContext hook or the Consumer component.

4. Give 2 ways to prevent components from re-rendering.

Using shouldComponentUpdate lifecycle method to control when the component should update.
Using PureComponent or React.memo to create a memoized version of the component that only re-renders if the props have changed.

5. What is a fragment and why do we need it? Give an example where it might
break my app.

A fragment is a React component that allows grouping multiple children elements without adding extra nodes to the DOM. Fragments are useful when you need to return multiple elements from a component, but they can only return a single element.

Styling fragments can break the app

6. Give 3 examples of the HOC pattern.

WithAuth: a HOC that adds authentication logic to a component, such as checking if the user is logged in and redirecting them to a login page if not.
WithData: a HOC that fetches data from an API and passes it as props to a component.
WithStyle: a HOC that adds CSS styles to a component using a CSS-in-JS library such as styled-components.

7. what's the difference in handling exceptions in promises, callbacks and
async...await.

Promises use the .catch() method to handle exceptions and propagate them down the chain.
Callbacks usually handle errors as the first argument of the callback function, such as (error, result) => {...}.
Async/await uses try/catch blocks to handle exceptions within the async function and returns a rejected Promise if an exception is thrown.

8. How many arguments does setState take and why is it async.

setState takes two arguments, an object that represents the new state or a function that returns the new state based on the previous state, and an optional callback function to be executed after the state has been updated. setState is asynchronous because React batches multiple state updates and only performs one re-render for efficiency.

9. List the steps needed to migrate a Class to Function Component.

Remove the class declaration and replace it with a function declaration.
Remove the constructor and its contents.
Replace this.state with the useState hook to manage the state of the component.
Remove the lifecycle methods, such as componentDidMount, componentDidUpdate, and componentWillUnmount, and replace them with the useEffect hook to perform side effects and manage the component's lifecycle.
Remove the render() method and replace it with a return statement that returns the JSX that the component should render.
Remove the this keyword and replace it with the appropriate variables or functions within the function component.
If the component uses props, add the props parameter to the function component declaration and use them as needed within the component.
If the component uses refs, replace this.refs with the useRef hook and define the ref using useRef().
If the component uses context, use the useContext hook to consume the context value.

10. List a few ways styles can be used with components.

Inline styles using style attribute,
using classNames attribute,
Styled components like CSS-in-JS,
CSS frameworks like bootstrap...etc,

11. How to render an HTML string coming from the server.

Using dangerouslySetInnerHTML attribute, html should be sanitized 