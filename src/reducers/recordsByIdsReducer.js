import {keyBy} from 'lodash-es';

export default (store, key) => {

  return (prevState, newState, action) => {
    const before = prevState[store];
    const now = newState[store];

    // if users have not changed, do nothing
    if (before === now) {
      // unless we're initialising computed values
      if (action.type !== 'initComputed') {
        return newState;
      }
    }

    // update derived field in state
    return {
      ...newState,
      [key]: keyBy(now, 'id'),
    };
  };
};
