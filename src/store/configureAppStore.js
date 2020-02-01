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
    //server: singletonReducer(),
    buckets: arrayReducer(),
    strategies: singletonReducer('', []),
    connected: singletonReducer(),
    filteredStrategies: singletonReducer(),
    metaSettings: storedSingletonReducer('metaSettings', {}),
    metas: arrayReducer(),
    presets: arrayReducer(),
    recordings: arrayReducer(),
    //recordings: arrayReducer(),
    //experiments: arrayReducer(),
    global: storedSingletonReducer('global', {}),
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

