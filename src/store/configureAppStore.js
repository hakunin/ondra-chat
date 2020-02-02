import singletonReducer from '../reducers/singletonReducer';
import storedSingletonReducer from '../reducers/storedSingletonReducer';
import arrayReducer from '../reducers/arrayReducer';
import stackReducer from '../reducers/stackReducer';
import readonlyReducer from '../reducers/readonlyReducer';
import recordsByIdsReducer from '../reducers/recordsByIdsReducer';
import configureStore from './configureStore';
import Store from '../persistance/Store';
import updateRecordById from '../reducers/updateRecordById';
import batchArrayUpdater from '../reducers/batchArrayUpdater';

export default ({
  actions = {},
  state = window.__REDUX_INIT_CONTEXT,
} = {}) => {
  const map = {
    messages: storedSingletonReducer('messages', {}),
    user: storedSingletonReducer('user', {empty: true}),
    contacts: storedSingletonReducer('contacts', {}),
  };

  const globalReducers = [
    batchArrayUpdater(),
  ];

  const store = configureStore(
    map,
    state,
    actions,
    globalReducers
  );

  return {
    redux: store,
    store: new Store(store, actions),
    actions: actions,
  };
};

