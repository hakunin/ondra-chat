
export default ((namespace, initial = null) => {
  const initialState = initial;
  var namespace;

  const handler = (state = initialState, action) => {
    const [action_namespace, action_type] = action.type.split('/');

    if (namespace != action_namespace) {
      return state;
    }

    switch (action_type) {
      case 'set':
        return action.payload;
      case 'merge':
        return({
          ...state,
          ...action.payload,
        });
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
