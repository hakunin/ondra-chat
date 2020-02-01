import updateRecordById from '../updateRecordById';
import singletonReducer from '../singletonReducer';
import readonlyReducer from '../readonlyReducer';
import arrayReducer from '../arrayReducer';
import configureStore from '../../store/configureStore';
import StoreClass from '../../persistance/Store';

let Actions, Store;

const setupStore = (options) => {
  const map = {
    currentUserId: singletonReducer(),
    currentUser: readonlyReducer,
    users: arrayReducer(),
  };

  const globalReducers = [
    updateRecordById('users', 'currentUser', 'currentUserId', { merge: true }),
  ];

  Actions = {};
  const store = configureStore(
    map,
    options.state || {},
    Actions,
    globalReducers
  );

  Store = new StoreClass(store, Actions);
};

describe('updateRecordById', () => {

  describe('initial behavior', () => {
    it('populates Actions with things actions', () => {
      setupStore({
        state: {
          users: [{id: 1, name: 'John'}],
          currentUser: {id: 1, preferences: {}},
          currentUserId: 1,
        }
      });
      expect(Store.store.getState().currentUser).toEqual(
        {id: 1, name: 'John', preferences: {}}
      );
    });
  });

  describe('edge cases', () => {
    it('does not override object if store record isn not there', () => {
      setupStore({
        state: {
          users: [], // user isn't present
          currentUser: {id: 1, preferences: {}},
          currentUserId: 1,
        }
      });
      expect(Store.store.getState().currentUser).toEqual(
        {id: 1, preferences: {}}
      );
    });
  });
});


