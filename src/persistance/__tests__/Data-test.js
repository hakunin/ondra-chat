import Promise from 'promise';
import {each} from 'lodash-es';

import Data from '../Data';

// there are timer mocks and no server calls so nothing should take too long
jasmine.DEFAULT_TIMEOUT_INTERVAL = 50;

describe('Store', () => {
  beforeEach(() => {
    mount();
  });

  describe("Data._ajax", () => {
    it("returns a Promise", () => {
      var promise = Data._ajax('GET', '/api/blah', {});
      expect(promise).toEqual(jasmine.any(Promise));
    });

    it("returns a Promise that runs then with the result", (done) => {
      var callback = jasmine.createSpy('callback');
      Data._ajax('GET', '/api/blah').then(() => {
        callback();
        expect(callback).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  each(['get', 'post', 'put'], (method) => {
    describe("Data."+method, () => {

      it("returns a Promise", () => {
        var promise = Data[method]('/api/blah');
        expect(promise).toEqual(jasmine.any(Promise));
      });

      it("returns a Promise that runs then with the result", (done) => {
        Data[method]('/api/blah').then(() => {
          done();
        });
      });

      it("pushes calls Store.processResponse", () => {
        spyOn($, 'ajax').and.callFake((options) => {
          options.success('ajax response');
        });
        var processResponse = spyOn(Store, 'processResponse');

        Data[method]('/api/blah');

        expect(processResponse).toHaveBeenCalledTimes(1);
        expect(processResponse).toHaveBeenCalledWith('ajax response');
      });

    });
  });

});

