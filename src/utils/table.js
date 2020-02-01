import React from 'react';
import matchSorter from 'match-sorter';

// Define a default UI for filtering
export function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}


// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
export function NumberRangeColumnFilter({
  column: { 
    filterValue = [],
    preFilteredRows,
    setFilter,
    id
  },
}) {
  /*
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
    preFilteredRows.forEach(row => {
      min = Math.min(row.values[id], min)
      max = Math.max(row.values[id], max)
    })
    return [min, max]
  }, [id, preFilteredRows])
  */

  return (
    <div>
      <div>
        <input
          type="text"
          value={filterValue[0] === null ? '' : filterValue[0]}
          onChange={e => {
            const val = e.target.value;
            setFilter((old = []) => [val, old[1]])
          }}
          //placeholder={`(${min})`}
          placeholder="min"
          style={{width: '70px'}}
        />
      </div>
      <div>
        <input
          type="text"
          value={filterValue[1] === null ? '' : filterValue[1]}
          onChange={e => {
            const val = e.target.value;
            setFilter((old = []) => [old[0], val])
          }}
          //placeholder={`(${max})`}
          placeholder="max"
          style={{width: '70px'}}
        />
      </div>
    </div>
  )
}

let empty = (v) => {
  return (v === null) || (v === '') || (v === undefined);
}

export function customBetween(rows, id, [min, max]) {

  if (empty(min) && empty(max)) {
    return rows;
  }

  let fn;

  if (empty(min)) {
    max = parseFloat(max);
    fn = (value) => value <= max;
  } else if (empty(max)) {
    min = parseFloat(min);
    fn = (value) => value >= min;
  } else {
    min = parseFloat(min);
    max = parseFloat(max);
    fn = (value) => (value >= min) && (value <= max);
  }

  return rows.filter(row => {
    return fn(row.values[id]);
  })
}

export function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val


