
import stackReducer from '../stackReducer';
import configureStore from '../../store/configureStore';

describe('stackReducer', () => {
  let store;
  let actions;

  beforeEach(() => {
    actions = {};
    store = configureStore({things: stackReducer()}, {}, actions);
  });

  describe('Actions', () => {
    describe('definition', () => {
      it('populates Actions with things actions', () => {
        expect(Object.keys(actions)).toEqual(['things']);
      });

      it('populates Actions.things with actions', () => {
        expect(Object.keys(actions.things)).toEqual(jasmine.arrayContaining([
          'push',
          'pop',
          'clear',
          'replaceAt',
        ]));
      });
    });

    describe('push', () => {
      it('adds item to empty stack', () => {
        actions.things.push('Thing 1');
        expect(store.getState()).toEqual({
          things: ['Thing 1'],
        });
      });

      it('adds the item on top of the stack', () => {
        actions.things.push('Thing 1');
        actions.things.push('Thing 2');
        expect(store.getState()).toEqual({
          things: ['Thing 1', 'Thing 2'],
        });
      });

      it('returns index of added item', () => {
        expect(actions.things.push('Thing 1')).toEqual(0);
        expect(actions.things.push('Thing 2')).toEqual(1);
      });
    });

    describe('pop', () => {
      it('removes topmost item', () => {
        actions.things.push('Thing 1');
        actions.things.push('Thing 2');
        actions.things.pop();
        expect(store.getState()).toEqual({
          things: [
            'Thing 1',
          ]
        });
      });

      it('removes the last item', () => {
        actions.things.push('Thing 1');
        actions.things.pop();
        expect(store.getState()).toEqual({
          things: [],
        });
      });
    });

    describe('replaceAt', () => {
      it('replaces an item at index', () => {
        actions.things.push('Thing 1');
        actions.things.push('Thing 2');
        actions.things.replaceAt(0, 'Thing 1 updated');
        expect(store.getState()).toEqual({
          things: [
            'Thing 1 updated',
            'Thing 2',
          ]
        });
      });
    });


    describe('clear', () => {
      it('removes all items', () => {
        actions.things.push('Thing 1');
        actions.things.push('Thing 2');

        actions.things.clear();
        expect(store.getState()).toEqual({
          things: []
        });
      });
    });
  });


});


