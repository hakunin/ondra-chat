
export default ((initial = []) => {
  const initialState = initial;
  var namespace;
  var store;

  const handler = (state = initialState, action) => {
    const [action_namespace, action_type] = action.type.split('/');

    if (namespace != action_namespace) {
      return state;
    }

    const { payload, index } = action;
    let newState;

    // set record by ID
    switch (action_type) {
      case 'push':
        return state.concat(payload);

      case 'pop':
        newState = state.slice();
        newState.pop();
        return newState;

      // removes record by ID
      case 'replaceAt':
        newState = state.slice();
        newState.splice(index, 1, payload);
        return newState;

      case 'clear':
        return [];

      default:
        return state;
    }
  };

  handler.__init = (_store, _namespace) => {
    store = _store;
    namespace = _namespace;
  };

  handler.__actions = {
    'push': (payload) => {
      store.dispatch({type: namespace+'/push', payload});
      return store.getState()[namespace].length - 1;
    },
    'pop': () => {
      store.dispatch({type: namespace+'/pop'});
    },
    'clear': () => {
      store.dispatch({type: namespace+'/clear'});
    },
    'replaceAt': (index, payload) => {
      store.dispatch({type: namespace+'/replaceAt', index, payload});
    },
  };

  return handler;
});
