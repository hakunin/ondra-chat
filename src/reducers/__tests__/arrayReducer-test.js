import arrayReducer from '../arrayReducer';
import configureStore from '../../store/configureStore';

describe('arrayReducer', () => {
  let store;
  let actions;

  beforeEach(() => {
    actions = {};
    store = configureStore({things: arrayReducer()}, {}, actions);
  });

  describe('Actions', () => {
    describe('definition', () => {
      it('populates Actions with things actions', () => {
        expect(Object.keys(actions)).toEqual(['things']);
      });

      it('populates Actions.things with actions', () => {
        expect(Object.keys(actions.things)).toEqual(jasmine.arrayContaining([
          'set',
          'setAll',
          'replaceAll',
          'remove',
          'removeAll',
        ]));
      });
    });

    describe('set', () => {
      it('adds the item by its ID', () => {
        actions.things.set({id: 1, name: 'Thing 1'});
        expect(store.getState()).toEqual({
          things: [{id: 1, name: 'Thing 1'}],
        });
      });

      it('replaces the item with the same ID', () => {
        actions.things.set({id: 1, name: 'Thing Old'});
        actions.things.set({id: 1, name: 'Thing New'});
        expect(store.getState()).toEqual({
          things: [{id: 1, name: 'Thing New'}],
        });
      });

      it('merges attributes not present in new record with old ones', () => {
        actions.things.set({id: 1, name: 'Thing Old', description: '...'});
        actions.things.set({id: 1, name: 'Thing New'});
        expect(store.getState()).toEqual({
          things: [{id: 1, name: 'Thing New', description: '...'}],
        });
      });
    });

    describe('setAll', () => {
      it('adds the multiple items', () => {
        actions.things.set({id: 1, name: 'Thing 1'});
        actions.things.setAll([
          {id: 1, name: 'Thing 1 updated'},
          {id: 2, name: 'Thing 2 new'}
        ]);
        expect(store.getState()).toEqual({
          things: [
            {id: 1, name: 'Thing 1 updated'},
            {id: 2, name: 'Thing 2 new'},
          ]
        });
      });

      it('replaces the multiple items by IDs', () => {
        actions.things.setAll([
          {id: 1, name: 'Thing 1'},
          {id: 2, name: 'Thing 2'}
        ]);
        actions.things.setAll([
          {id: 1, name: 'Thing 1 New'},
          {id: 2, name: 'Thing 2 New'}
        ]);
        expect(store.getState()).toEqual({
          things: [
            {id: 1, name: 'Thing 1 New'},
            {id: 2, name: 'Thing 2 New'},
          ]
        });
      });

      it('merges records with old ones', () => {
        actions.things.setAll([
          {id: 1, name: 'Thing 1', description: 'one'},
          {id: 2, name: 'Thing 2', description: 'two'}
        ]);
        actions.things.setAll([
          {id: 1, name: 'Thing 1 New'},
          {id: 2, name: 'Thing 2 New'}
        ]);
        expect(store.getState()).toEqual({
          things: [
            {id: 1, name: 'Thing 1 New', description: 'one'},
            {id: 2, name: 'Thing 2 New', description: 'two'}
          ]
        });
      });
    });

    describe('swapAll', () => {
      it('adds the multiple items', () => {
        actions.things.set({id: 1, name: 'Thing 1'});
        actions.things.swapAll([], [
          {id: 1, name: 'Thing 1 updated'},
          {id: 2, name: 'Thing 2 new'}
        ]);
        expect(store.getState()).toEqual({
          things: [
            {id: 1, name: 'Thing 1 updated'},
            {id: 2, name: 'Thing 2 new'},
          ]
        });
      });

      it('removes the item from first argument', () => {
        actions.things.setAll([
          {id: 1, name: 'Thing 1'},
          {id: 2, name: 'Thing 2'},
          {id: 3, name: 'Thing 3'}
        ]);
        actions.things.swapAll([{id: 3, name: 'Thing 3'}], []);
        expect(store.getState()).toEqual({
          things: [
            {id: 1, name: 'Thing 1'},
            {id: 2, name: 'Thing 2'},
          ]
        });
      });

      it('replaces the multiple items by IDs', () => {
        actions.things.setAll([
          {id: 1, name: 'Thing 1'},
          {id: 2, name: 'Thing 2'},
          {id: 3, name: 'Thing 3'}
        ]);
        actions.things.swapAll([
          {id: 3, name: 'Thing 3'},
        ], [
          {id: 1, name: 'Thing 1 New'},
          {id: 2, name: 'Thing 2 New'}
        ]);
        expect(store.getState()).toEqual({
          things: [
            {id: 1, name: 'Thing 1 New'},
            {id: 2, name: 'Thing 2 New'},
          ]
        });
      });

      it('merged items', () => {
        actions.things.setAll([
          {id: 1, name: 'Thing 1', description: 'one'},
          {id: 2, name: 'Thing 2', description: 'two'},
          {id: 3, name: 'Thing 3', description: 'three'}
        ]);
        actions.things.swapAll([
          {id: 3, name: 'Thing 3'},
        ], [
          {id: 1, name: 'Thing 1 New'},
          {id: 2, name: 'Thing 2 New'}
        ]);
        expect(store.getState()).toEqual({
          things: [
            {id: 1, name: 'Thing 1 New', description: 'one'},
            {id: 2, name: 'Thing 2 New', description: 'two'},
          ]
        });
      });
    });

    describe('replaceAll', () => {
      it('sets the multiple items by IDs', () => {
        actions.things.set({id: 1, name: 'Thing 1'});
        actions.things.replaceAll([{id: 2, name: 'Thing 2'}]);
        expect(store.getState()).toEqual({
          things: [
            {id: 2, name: 'Thing 2'},
          ]
        });
      });
    });

    describe('remove', () => {
      it('removes item by ID', () => {
        actions.things.setAll([
          {id: 1, name: 'Thing 1'},
          {id: 2, name: 'Thing 2'}
        ]);
        actions.things.remove(1);
        expect(store.getState()).toEqual({
          things: [
            {id: 2, name: 'Thing 2'},
          ]
        });
      });
    });

    describe('removeAll', () => {
      it('removes multiple items by IDs', () => {
        actions.things.setAll([
          {id: 1, name: 'Thing 1'},
          {id: 2, name: 'Thing 2'},
          {id: 3, name: 'Thing 3'}
        ]);
        actions.things.removeAll([{id: 1},{id: 2}]);
        expect(store.getState()).toEqual({
          things: [
            {id: 3, name: 'Thing 3'}
          ]
        });
      });
    });

    describe('clear', () => {
      it('sets the multiple items by IDs', () => {
        actions.things.set({id: 1, name: 'Thing 1'});
        actions.things.clear();
        expect(store.getState()).toEqual({
          things: []
        });
      });
    });

  });

  describe('multiple reducers', () => {
    beforeEach(() => {
      actions = {};
      store = configureStore({
        smells: arrayReducer(),
        colors: arrayReducer()
      }, {}, actions);
    });

    it('it assigns records into correct stores', () => {
      actions.smells.set({id: 1, name: 'Smell'});
      actions.colors.set({id: 1, name: 'Color'});
      expect(store.getState()).toEqual({
        smells: [{id: 1, name: 'Smell'}],
        colors: [{id: 1, name: 'Color'}]
      });
    });
  });


});


