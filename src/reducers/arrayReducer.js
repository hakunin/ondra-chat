import {
  differenceBy,
  find,
  reduce,
  values,
  assign,
} from 'lodash-es';

export default ((initial = []) => {
  const initialState = initial;
  var namespace;
  var store;

  const handler = (state = initialState, action) => {
    const [action_namespace, action_type] = action.type.split('/');

    if (namespace != action_namespace) {
      return state;
    }

    const length = state.length;
    const { payload } = action;
    let newState;

    // set record by ID
    switch (action_type) {
      case 'set':
        for (let i = 0; i < length; i++) {
          if (state[i].id == payload.id) {
            newState = state.concat();
            newState[i] = assign({}, state[i], payload);
            return newState;
          }
        }
        return state.concat(payload);

      case 'setAll':
        const records = payload.concat();
        const recordIds = records.map(({id}) => id);
        newState = state.concat();
        let recordIndex;
        let oldRecord;
        for (let i = 0; i < length; i++) {
          recordIndex = recordIds.indexOf(state[i].id);
          if (recordIndex > -1) {
            oldRecord = state[i];
            const record = find(records, ({id}) => id == oldRecord.id);
            newState.splice(i, 1, assign({}, oldRecord, record));
            records.splice(recordIndex, 1);
            recordIds.splice(recordIndex, 1);
          }
        }
        return newState.concat(records);

      case 'swapAll':
        const removeRecords = payload[0];
        const newRecords = reduce(payload[1], (acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});

        newState = differenceBy(state, removeRecords, 'id');
        newState = newState.map((item) => {
          const record = newRecords[item.id];
          if (record) {
            delete newRecords[item.id];
            return assign({}, item, record);
          } else {
            return item;
          }
        });
        return newState.concat(values(newRecords));


      case 'replaceAll':
        return payload.concat();

      // removes record by ID
      case 'remove':
        return differenceBy(state, [{id: payload}], 'id');

      case 'removeAll':	
        return differenceBy(state, payload, 'id');	

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
    'set': (value) => {
      store.dispatch({type: namespace+'/set', payload: value});
    },
    'setAll': (value) => {
      store.dispatch({type: namespace+'/setAll', payload: value});
    },
    'replaceAll': (value) => {
      store.dispatch({type: namespace+'/replaceAll', payload: value});
    },
    'remove': (value) => {
      // make sure we're removing by the ID
      if (value && value.id) {
        value = value.id;
      }
      store.dispatch({type: namespace+'/remove', payload: value});
    },
    'removeAll': (items) => {
      store.dispatch({type: namespace+'/removeAll', payload: items});
    },
    'clear': () => {
      store.dispatch({type: namespace+'/clear'});
    },
    'swapAll': (remove, set) => {
      store.dispatch({type: namespace+'/swapAll', payload: [remove, set]});
    },
    'swap': (id, value) => {
      store.dispatch({type: namespace+'/swap', payload: [id, value]});
    },
  };

  return handler;
});
