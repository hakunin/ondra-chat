import React from 'react';
import { render} from 'react-dom';
import MyComponent from '../../src/containers/App.js';
const App = () => (
    <MyComponent />
);
render(<App />, document.getElementById("root"));
