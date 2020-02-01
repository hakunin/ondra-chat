import Promise from 'promise';
import Notifications from '../../utils/Notifications';
import StoreClass from '../Store';
import {reportError} from '../../utils/Airbrake';

//var StoreClass = Store;
var retryInfo;
var wrapped;

describe('Store', () => {

  beforeEach(() => {
    wrapped = mount();
  });

  describe('retry behavior', () => {

    beforeEach(() => {
      retryInfo = {
        retries: 0,
        retry: jasmine.createSpy('retry'),
        reject: jasmine.createSpy('reject'),
      };
    });

    afterEach(() => {
      Flash.clear();
    });

    describe("Error that we can retry after", () => {
      beforeEach(() => {
        Store.responseError({ status: 503 }, retryInfo);
      });

      it("calls retry", () => {
        jest.runAllTimers(); // there is a wait before retry is called
        expect(retryInfo.retries).toEqual(1);
        expect(retryInfo.retry).toHaveBeenCalledTimes(1);
        expect(retryInfo.reject).not.toHaveBeenCalled();
        jest.runAllTimers();
      });

      it("displays retry message", () => {
        expect(wrapped.find(Notifications).text().trim()).toEqual(
          'Connection problem, retrying in 2 seconds'
        );
      });
    });

    describe("Custom error", () => {
      beforeEach(() => {
        Store.responseError({responseJSON: {error: 'Custom error message'}}, retryInfo);
      });

      it("doesn't retry", () => {
        jest.runAllTimers();
        expect(retryInfo.retries).toEqual(0);
        expect(retryInfo.retry).not.toHaveBeenCalled();
        expect(retryInfo.reject).toHaveBeenCalledTimes(1);
      });

      it("displays error message", () => {
        expect(wrapped.find(Notifications).text().trim()).toEqual('Custom error message');
      });
    });

    describe("Custom notice", () => {
      beforeEach(() => {
        Store.responseError({responseJSON: {notice: 'Notice message'}}, retryInfo);
      });

      it("doesn't retry", () => {
        jest.runAllTimers();
        expect(retryInfo.retries).toEqual(0);
        expect(retryInfo.retry).not.toHaveBeenCalled();
        expect(retryInfo.reject).toHaveBeenCalledTimes(1);
      });

      it("displays notice message", () => {
        expect(wrapped.find(Notifications).text().trim()).toEqual('Notice message');
      });
    });

    describe("Retry behavior", () => {
      beforeEach(() => {
        retryInfo = {
          retries: 0,
          // immediately trigger error on retry
          retry: (retryInfo) => {
            Store.responseError({ status: 503 }, retryInfo);
          },
          reject: jasmine.createSpy('reject'),
        };
        spyOn(retryInfo, 'retry').and.callThrough();
        spyOn(Flash, 'error');
      });

      it("retries certain number of times", () => {
        Store.responseError({ status: 503 }, retryInfo);
        jest.runAllTimers(); // runs timers and any following ones
        expect(retryInfo.retry).toHaveBeenCalledTimes(5);
        expect(retryInfo.reject).toHaveBeenCalledTimes(1);
        expect(Flash.error.calls.allArgs()).toEqual([
          ['Connection problem, retrying in 2 seconds', 2],
          ['Connection problem, retrying in 4 seconds', 4],
          ['Connection problem, retrying in 8 seconds', 8],
          ['Connection problem, retrying in 16 seconds', 16],
          ['Connection problem, retrying in 32 seconds', 32],
          ['Sorry, something went wrong'],
        ]);
      });
    });

    describe("Generic error", () => {
      beforeEach(() => {
        Store.responseError({ status: 500 }, retryInfo);
      });

      it("doesn't retry", () => {
        jest.runAllTimers();
        expect(retryInfo.retries).toEqual(0);
        expect(retryInfo.retry).not.toHaveBeenCalled();
        expect(retryInfo.reject).toHaveBeenCalledTimes(1);
      });

      it("displays generic error message", () => {
        expect(wrapped.find(Notifications).text().trim()).toEqual(StoreClass.GENERIC_ERROR);
      });
    });

    it("displays message on certain codes from HTTP_MESSAGES", () => {
      StoreClass.HTTP_MESSAGES[777] = 'Test message';
      Store.responseError({ status: 777 }, retryInfo);
      expect(wrapped.find(Notifications).text().trim()).toEqual('Test message');
    });
  });

  describe("save", () => {
    it("returns promise", () => {
      var promise = Store.save({_t: 'task', id: 1});
      expect(promise).toEqual(jasmine.any(Promise));
    });

    describe('record', () => {
      var record = factoryCreate('workflow_action');

      describe("when unchanged", () => {
        let result;
        beforeEach(() => {
          result = Store.save({ ...record });
        });

        it("returns promise", () => {
          expect(result).toEqual(jasmine.any(Promise));
        });

        it("should not add new record", () => {
          expect(Store.store.getState().workflowActions.length).toEqual(1);
        });

        it("should not change record", () => {
          expect(Store.store.getState().workflowActions[0]).toEqual(record);
        });
      });

      describe('when missing type', () => {
        it("returns promise", () => {
          reportError.silence(() => {
            const result = Store.save({name: 'record without type'});
            expect(result).toEqual(jasmine.any(Promise));
          });
        });
      });

      describe("temporary records", () => {
        var temp_record;
        var ajax;

        beforeEach(() => {
          temp_record = { ...record, id: Store.randomId(), temp_record: true };
          ajax = spyOn($, 'ajax');
        });

        it("refuses to save temporary records", () => {
          const notice = spyOn(Flash, 'notice');
          Store.save(temp_record);
          expect(ajax).not.toHaveBeenCalled();
          expect(notice).not.toHaveBeenCalledWith('');
        });

        it("returns promise", () => {
          reportError.silence(() => {
            const result = Store.save({temp_record});
            expect(result).toEqual(jasmine.any(Promise));
          });
        });

      });

    });
  });

  describe("destroy", () => {
    it("returns promise", () => {
      var promise = Store.destroy({_t: 'task', id: 1});
      expect(promise).toEqual(jasmine.any(Promise));
    });
  });

  describe("wrapAjax", () => {
    beforeEach(() => {
      spyOn($, 'ajax');
    });

    it("wraps ajax call in a Promise", () => {
      var promise = Store.wrapAjax({});
      expect(promise).toEqual(jasmine.any(Promise));
    });

    it("runs the request", () => {
      Store.wrapAjax({});
      expect($.ajax).toHaveBeenCalledTimes(1);
    });

    it("runs callback after success", () => {
      $.ajax.and.callFake((options) => {
        options.success();
      });
      var success = jasmine.createSpy('success');
      Store.wrapAjax({
        success: success
      });
      expect(success).toHaveBeenCalledTimes(1);
    });

    it("runs callback after complete failure", () => {
      $.ajax.and.callFake((options) => {
        options.error({status: 0}); // no connection status, always retries
      });

      var error = jasmine.createSpy('error');
      Store.wrapAjax({error: error});

      // avoid warning output
      jest.runAllTimers();
      expect(error).toHaveBeenCalledTimes(1);
      Debug.enabled = false;
      jest.runAllTicks(); // triggers promise catch while Debug is disabled
    });
  });

  describe("wrapAjax api", () => {
    var resolve;

    beforeEach(() => {
      resolve = jasmine.createSpy('resolve');
    });

    it("runs resolve callback when no success is defined", () => {
      Store.wrapAjax({}).then(resolve); // no success callback
      jest.runAllTimers();
      expect(resolve).toHaveBeenCalledTimes(1);
    });

    it("runs resolve callback by default", () => {
      Store.wrapAjax({
        // success arity is 0
        success: () => {}
      }).then(resolve);
      jest.runAllTimers();
      expect(resolve).toHaveBeenCalledTimes(1);
    });

    it("rusn resolve itself when success arity is 1", () => {
      Store.wrapAjax({
        // success arity is 1
        success: (response) => {}
      }).then(resolve);

      jest.runAllTimers();
      expect(resolve).toHaveBeenCalledTimes(1);
    });

    it("lets success run resolve callback if arity is 2", () => {
      Store.wrapAjax({
        // success arity is 2 and has to call resolve itself
        success: (response, retryInfo) => { retryInfo.resolve(); }
      }).then(resolve);

      jest.runAllTimers();
      expect(resolve).toHaveBeenCalledTimes(1);
    });
  });

  describe("response processing", () => {
    var setAll;
    beforeEach(() => {
      setAll = spyOn(Store, 'setAll');
    });

    it("processes true as a noop", () => {
      Store.processResponse(true);
      expect(setAll).not.toHaveBeenCalled();
    });

    it("processes false as a noop", () => {
      Store.processResponse(false);
      expect(setAll).not.toHaveBeenCalled();
    });

    it("puts records data into stores", () => {
      Store.processResponse({
        user: [{
          _t: 'user',
          id: 123,
        }]
      });
      expect(Store.store.getState().users[0]).not.toEqual(null);
    });

    it("should push if it has the correct _format attribute", () => {
      Store.processResponse({
        _format: 1,
        user: [{
          _t: 'user',
          id: 123,
        }]
      });
      expect(setAll).toHaveBeenCalled();
    });

    it("not push if there is no _format attribute", () => {
      Store.processResponse({
        search: {
          results: [],
          totalResults: 0,
        }
      });
      expect(setAll).not.toHaveBeenCalled();
    });

    it("complains about old data format", () => {
      expect(() => {
        Store.processResponse({
          _t: 'user',
          id: 123,
        });
      }).toThrowError('Old response type: {"_t":"user","id":123}');
    });
  });
});

