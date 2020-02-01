//import arrayReducer from '../arrayReducer';
//import configureStore from '../../store/configureStore';
import batchArrayUpdater from '../batchArrayUpdater';

describe('batchArrayUpdater', () => {

  describe('update', () => {
    it('updates records to state', () => {
      const reducer = batchArrayUpdater({}, 'tasks')
      let state = {tasks: [{id: 1, name: 'Name 1'}]};

      state = reducer(state, {tasks: state.tasks.concat()}, {
        type: 'batchUpdateArrays',
        update: {tasks: [{id: 1, name: 'Name 1 New'}]}
      });

      expect(state.tasks).toEqual([{
        id: 1, name: 'Name 1 New'
      }]);
    });

    it('merges records old attributes with new ones', () => {
      const reducer = batchArrayUpdater({}, 'tasks')
      let state = {tasks: [{id: 1, name: 'Name 1', description: '...'}]};

      state = reducer(state, {tasks: state.tasks.concat()}, {
        type: 'batchUpdateArrays',
        update: {tasks: [{id: 1, name: 'Name 1 New'}]}
      });

      expect(state.tasks).toEqual([{
        id: 1, name: 'Name 1 New', description: '...'
      }]);
    });
  });

  describe('swap', () => {
    it('removes records from first array by IDs', () => {
      const reducer = batchArrayUpdater({}, 'tasks')
      let state = {tasks: [{id: 1, name: 'Name 1'}]};

      state = reducer(state, {tasks: state.tasks.concat()}, {
        type: 'batchUpdateArrays',
        swap: {tasks: [[{id: 1}], []]},
      });

      expect(state.tasks).toEqual([]);
    });
    
    it('merges records old attributes with new ones', () => {
      const reducer = batchArrayUpdater({}, 'tasks')
      let state = {tasks: [{id: 1, name: 'Name 1', description: '...'}]};

      state = reducer(state, {tasks: state.tasks.concat()}, {
        type: 'batchUpdateArrays',
        swap: {tasks: [[], [{id: 1, name: 'Name 1 New'}]]},
      });

      expect(state.tasks).toEqual([{
        id: 1, name: 'Name 1 New', description: '...'
      }]);
    });
  });

});


