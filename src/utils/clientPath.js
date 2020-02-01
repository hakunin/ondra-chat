import {toQueryString} from '../utils/urlHelpers';

var url_map = {};

url_map.index = () => {
  return "/";
};




// returns a path that can be used with History.pushState
// the path has to be based on the current getUrlBase()
export var clientPath = function(name, ...options) {
  // get the url
  let path_function = url_map[name];
  if (!path_function) {
    throw new Error('Uknown path "'+name+'".');
  }
  var path = path_function(...options);

  path = basePath(path);

  const lastArg = options[options.length - 1];
  if (typeof lastArg === 'object') {
    const queryString = toQueryString(lastArg);
    if (queryString.length > 0) {
      path += '?' + queryString;
    }
  }

  return path;
};

// returns path relative to the base
export const basePath = (path) => {
  // remove the url base
  var baseMatch = new RegExp('^'+Page.currentClass.getUrlBase());
  path = path.replace(baseMatch, '');
  if (path[0] !== '/') {
    path = "/" + path;
  }
  return path;
};

// this is used for links that result in location reload
// like this: href={clientHref(...)}
export var clientHref = function(name, ...options) {
  var path = url_map[name](...options);

  const lastArg = options[options.length - 1];
  if (typeof lastArg === 'object') {
    const queryString = toQueryString(lastArg);
    if (queryString.length > 0) {
      path += '?' + queryString;
    }
  }

  return path;
};

// this is used for links that are used with onClick
export var navigateFn = function(name, ...options) {
  let url = clientPath(name, ...options);
  let fn = (e) => {
    // when native event, left click => e.which == 1
    if (e && !e.nativeEvent) {
      // when modifier key is pressed, open in new window
      if (e.which === 1 && (e.ctrlKey || e.metaKey)) {
        return;
      }
      if (e.which !== 1) { return; }
    }

    // when synthetic event, left click => e.button == 0
    if (e && e.nativeEvent) {
      // when modifier key is pressed, open in new window
      if (e.button === 0 && (e.ctrlKey || e.metaKey)) {
        return;
      }
      if (e.button !== 0) { return; }
    }

    // Debug.log('NavigateFn', url);
    History.push(url);

    // prevent page load
    if (e) {
      e.preventDefault();
      if (e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
  };
  fn.url = url;
  return fn;
};
