import {
  differenceBy,
  find,
  map,
  assign,
  reduce,
  values,
} from 'lodash-es';

export default (options = {}, key) => {

  return (prevState, newState, action) => {
    if (action.type !== 'batchUpdateArrays') {
      return newState;
    }

    map(action.update, (records, key) => {
      newState[key] = updateAll(records, prevState[key], newState[key]);
    });

    map(action.swap, (records, key) => {
      newState[key] = swapAll(records, prevState[key], newState[key]);
    });

    // return new object, or it gets ignored
    return { ...newState };
  };
};


let updateAll = (payload, state, newState) => {
  const records = payload.concat();
  const recordIds = map(records, 'id');
  newState = state.concat();
  let recordIndex;
  let oldRecord;

  for (let i = 0; i < state.length; i++) {
    recordIndex = recordIds.indexOf(state[i].id);
    oldRecord = state[i];

    if (recordIndex > -1) {
      const record = find(records, (record) => record.id == state[i].id);
      newState.splice(i, 1, assign({}, oldRecord, record));
      records.splice(recordIndex, 1);
      recordIds.splice(recordIndex, 1);
    }
  }
  return newState.concat(records);
};

// removes all records from first part of payload and adds records from second part
let swapAll = (payload, state, newState) => {
  const removeRecords = payload[0];
  const newRecords = reduce(payload[1], (acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  // remove records from first array
  newState = differenceBy(state, removeRecords, 'id');

  // add / update new records
  newState = newState.map((item) => {
    const newRecord = newRecords[item.id];
    if (newRecord) {
      delete newRecords[item.id];
      return assign({}, item, newRecord);
    } else {
      return item;
    }
  });
  return newState.concat(values(newRecords));
};




