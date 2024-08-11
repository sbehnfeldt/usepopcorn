# usepopcorn
Sing-along with the "usepopcorn" project in  [The Ultimate React Course 2024](https://www.udemy.com/course/the-ultimate-react-course/) 
on [Udemy](https://udemy.com) by Jonas Schmedtmann.

## Bootstrapping
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
 
## Dev

`npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
The page will reload when you make changes.\
You may also see any lint errors in the console.

## Lessons
### Lesson 110. Prop Drilling
Passing a prop untouched through multiple levels of components.
This occurs when two or more components require the same prop,
but their common ancestor is more than a single level (or generation) away.

### Lesson 111. Component Composition
Define a React component with the {children} prop.  
Then the contents of where the component is used
are available to be used in the component definition.  
Useful for creating flexible and reusable components.
Also useful for fixing prop drilling.

### Lesson 112. Fix Prop Drilling With  Composition (and Building a Layout)
Eliminate prop drilling by moving descendents requiring those props 
into the body of the common ancestor instance, then redefine the common ancestor
to use the {children} prop.

### Lesson 114. Passing Elements as Props (Alternative to children)
Component composition can also be achieved by passing the contents 
as a JSX value in a prop.

### Lesson 115. Building a Reusable Star Rating Component
Began building the component by creating a new JSX file for it 
and defining placeholders for the stars and the numerical rating.
Import that file into index.js (comment out the <App> for simplicity).
Define CSS styles as JSON objects and include them 
as the value of the "style" attribute in the appropriate element.
(Define the JSON objects OUTSIDE the compopnent function 
so that JS does not need to re-generate them every time the component is re-rendered).
Define a "maxRating" prop in the StarRating definition
to allow user to specify the rating scale.
Provide a default value for the prop.

### Lesson 116. Creating the Stars
Began building the StarRating component, replacing the placeholder asterisks with SVG star images
and listening for click events on them to set the rating.

### Lesson 117. Handling Hover Events
Star components listen for onMouseEnter and onMouseLeave events, setting a temporary hover rating
on enter and clearing it on leave.  When the hover rating is set, use it (instead of the actual rating)
to determine the number of full and outlined stars to draw in the star component.

### Lesson 119. Improving Re-usability with Props
More props => more flexible component, but also more cumbersome. 

### Lesson 120. PropTypes
Implement type checking on props with PropTypes. 
import {PropTypes} from "prop-types";

### Lesson 141. The Component Lifecycle
1) Mount (initial render): instance rendered for the first time; fresh state and props created
2) Re-render: Happens when state, props or context changes or when parent re-renders
3) Unmount: instance destroyed and removed, state and props destroyed
Code can be executed at any of these points with `useEffect()`

### Lesson 142. How NOT to Fetch Data in React
NOT from within in the component.
This would be a side effect, which would re-render the component, which would re-fetch the data....
