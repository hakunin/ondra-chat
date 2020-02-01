import {find} from 'lodash-es';

export default (store, key, keyWithId, options = {}) => {

  return (prevState, newState, action) => {

    // if users have not changed, do nothing
    if (prevState[store] == newState[store]) {
      // unless we're initialising computed values
      if (action.type != 'initComputed') {
        return newState;
      }
    }

    const recordBefore = find(prevState[store], {id: newState[keyWithId]});
    const recordNow = find(newState[store], {id: newState[keyWithId]});

    // if record has changed
    if ((recordNow != recordBefore) || (action.type == 'initComputed')) {
      let updatedRecord = recordNow;

      if (options.merge) {
        updatedRecord = {
          ...prevState[key],
          ...recordNow,
        };
      }

      // update derived field in state
      newState = {
        ...newState,
        [key]: updatedRecord,
      };
    }

    return newState;
  };
};
