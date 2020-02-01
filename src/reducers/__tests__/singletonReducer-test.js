import singletonReducer from '../singletonReducer';
import configureStore from '../../store/configureStore';

describe('singletonReducer', () => {
  let store;
  let actions;

  beforeEach(() => {
    actions = {};
    store = configureStore({color: singletonReducer()}, {}, actions);
  });

  describe('Actions', () => {
    describe('definition', () => {
      it('populates Actions with things actions', () => {
        expect(Object.keys(actions)).toEqual(['color']);
      });

      it('populates Actions.things with actions', () => {
        expect(Object.keys(actions.color)).toEqual(jasmine.arrayContaining(['set']));
      });
    });

    describe('set', () => {
      it('sets the value', () => {
        actions.color.set('green');
        expect(store.getState()).toEqual({color: 'green'});
      });
    });

    describe('merge', () => {
      it('merges the object', () => {
        actions.color.set({name: 'green'});
        actions.color.merge({hex: '#00FF00'});
        expect(store.getState()).toEqual({
          color: {
            name: 'green',
            hex: '#00FF00'
          }
        });
      });

      it('replaces existing values', () => {
        actions.color.set({name: 'green'});
        actions.color.merge({name: 'blue'});
        expect(store.getState()).toEqual({color: {name: 'blue'}});
      });
    });
  });

});
