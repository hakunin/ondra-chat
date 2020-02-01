
// output format for the chart: 
/*{
  "date":" 2010-01-03T23:00:00.000Z",
  "open": 25.436282332605284,
  "high": 25.835021381744056,
  "low": 25.411360259406774,
  "close": 25.710416,
  "volume": 38409100,
  "split":"",
  "dividend":""
}
*/
export function readFormat(heading) {
  if (heading == "Date,Open,Close,High,Low,Volume") {
    // convert into candles, move to its own file
    return 'CSV_DOCHLV';
  }

  throw new Error("Format not supported: "+heading);
}

export function readBlock(format, block) {
  return formats[format](block);
}

const formats = {
  CSV_DOCHLV: (block) => {
    return block.map((line) => {
      const [date, open, close, high, low, volume] = line.split(',');

      
      const candle = {
        "date": new Date(date),
        "open": parseFloat(open),
        "high": parseFloat(high),
        "low": parseFloat(low),
        "close": parseFloat(close),
        "volume": parseFloat(volume),
        "split": "",
        "dividend": ""
      };

      //console.log([date, open, close, high, low, volume]);
      //console.log(JSON.stringify(candle));

      return candle;
    });
  }
}
