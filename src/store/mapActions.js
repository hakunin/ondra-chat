import {each} from 'lodash-es';
import {pluralize, camelize} from 'inflection';

// This allows us to easily call actions on reducers, like so:
// Actions.task.set() and
export default (map, store, actions) => {

  // set actions for each store
  each(map, (v, k) => {
    if (v.__init) {
      v.__init(store, k);
      actions[k] = v.__actions;
    }
  });

};
