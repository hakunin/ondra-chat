import {
  createStore,
  combineReducers,
} from 'redux';

import mapActions from './mapActions';

export default function configureStore(map, initialState = {}, actions = {}, globalReducers = []) {
  const reducer = combineReducers(map);

  // wrap redux combined reducers into our computed ones
  const wrappedReducer = (prevState, action) => {
    let newState = reducer(prevState, action);
    globalReducers .forEach((reducer) => {
      newState = reducer(prevState, newState, action);
    });
    return newState;
  };

  // pre-fill computer values
  initialState = wrappedReducer(initialState, {type: 'initComputed'});

  const store = createStore(
    wrappedReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  mapActions(map, store, actions);

  return store;
}
