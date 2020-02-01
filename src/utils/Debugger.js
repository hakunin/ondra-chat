import $ from 'jquery';
import storeJs from 'store';

if (window.console == null) {
  window.console = {
    log: function() {}
  };
}


export class Debugger {

  constructor() {
    this.enabled = storeJs.get('jsdebug') === true;
    if (this.enabled) {
      this.log("(╯°□°）╯︵ ┻━┻ Debug mode on! (turn off with Debug.debug(false))");
    }
  }

  debug(do_output) {
    if (do_output == null) {
      do_output = true;
    }
    storeJs.set('jsdebug', do_output, { path: '/' });
    this.enabled = do_output;
    if (this.enabled) {
      return "(╯°□°）╯︵ ┻━┻ Debug mode turned on.";
    } else {
      return "┬──┬ ノ( ゜-゜ノ) Debug mode is off";
    }
  }

  try(cb) {
    try {
      return cb();
    } catch (e) {
      return this.error(e);
    }
  }

  error(e) {
    if (this.enabled) {
      if (!e) {
        return console.error("Empty error");
      }
      if (e.stack) {
        if (console.exception) {
          console.exception(e);
        } else {
          console.error(e.stack);
        }
      } else {
        console.error(e);
      }
    }
  }

  onError(cb) {
    return $(this).bind('debug:error', cb);
  }

  log() {
    if (this.enabled) {
      var args = Array.prototype.slice.call(arguments);
      try {
        return console.log.apply(console, args);
      } catch (e) {
        return console.log(args);
      }
    }
  }

  warn(message) {
    var e;
    if (this.enabled) {
      try {
        throw new Error(message);
      } catch (_error) {
        e = _error;
        return console.warn(e.stack);
      }
    }
  }

}


window.Debug = new Debugger;
export default Debug;

Debug.onError((e) => {
  try {
    Airbrake.notify(e.error);
  } catch (_error) {
    e = _error;
    Debug.warn("Airbrake.notify failed");
  }

})



