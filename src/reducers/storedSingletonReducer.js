import storeJs from 'store';

// TODO innitial is from the store
export default ((namespace, initial) => {
  const initialState = storeJs.get(namespace) || initial;
  console.log('store get initial', namespace, storeJs.get(namespace));

  // this is so that we can override this safely later?
  var namespace;

  const handler = (state = initialState, action) => {
    const [action_namespace, action_type] = action.type.split('/');

    if (namespace != action_namespace) {
      return state;
    }

    switch (action_type) {
      case 'set':
        storeJs.set(action_namespace, action.payload);
        return action.payload;
      case 'merge':
        const newState = {
          ...state,
          ...action.payload,
        };
        storeJs.set(action_namespace, newState);
        return newState;
      default:
        return state;
    }
  };

  let store;
  handler.__init = (_store, _namespace) => {
    store = _store;
    namespace = _namespace;
  };

  handler.__actions = {
    'set': (value) => {
      store.dispatch({
        type: namespace+'/set',
        payload: value
      });
    },
    'merge': (value) => {
      store.dispatch({
        type: namespace+'/merge',
        payload: value
      });
    }
  };

  return handler;
});
