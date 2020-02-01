import {omitBy, isNil} from 'lodash-es';
import {parse, stringify} from 'qs';

import {basePath} from './clientPath';

export const toQueryString = (object) => {
  return stringify(omitBy(object, isNil), {
    arrayFormat: 'brackets',
    encode: false
  });
};

export const currentQuery = () => {
  let query = {};
  if (location.href.indexOf('?') > 0) {
    query = parse(location.href.split('?')[1]);
  }
  return query;
};

export const updateQuery = (newQuery) => {
  // update the query
  const query = {
    ...currentQuery(),
    ...newQuery,
  };

  let path = '';

  // get path
  let withoutProtocol = location.href.replace(/.*\/\//, '');
  if (withoutProtocol.indexOf('/') >= 0) {
    path = basePath(withoutProtocol.match(/\/.*/)[0]);
  }
  // remove query
  if (path.indexOf('?') > 0) {
    path = path.split('?')[0];
  }

  // update page query
  History.push({
    pathname: path,
    query: query,
  });
};
