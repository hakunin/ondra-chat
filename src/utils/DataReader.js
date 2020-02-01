import Data from '../persistance/Data';
import Promise from 'promise';

import {readFormat, readBlock} from '../utils/readFormat';

// TODO see how the chart implements panning with loading and update

const BUCKET = 'https://dami-t.s3.eu-central-1.amazonaws.com';
const BLOCK_SIZE = 1024 * 100;

export const FILES = [
  // bucket path, format, where to start (bytes)
  ['worldtradingdata-history-AAPL.csv', 'CSV_DOCHLV', 1024*30*8],
];

export default class DataReader {
  
  constructor(file = FILES[0]) {
    this.url = BUCKET + '/' + file[0];
    this.format = file[1];
    this.start = file[2];
    this.firstReadIndex = this.start;
    this.lastReadIndex = this.start;
    this.blocksByRange = {};
    this.blocks = [];
  }

  // this should set:
  //    this.firstReadIndex
  //    this.lastReadIndex
  //    data: complete lines from first to last index
  read(direction = 'right') {
    let from, to;

    if (direction == 'right') {
      from = this.lastReadIndex;
      to = from + BLOCK_SIZE;
    } else {
      to = this.firstReadIndex;
      from = from - BLOCK_SIZE;
    }

    console.log('READING BLOCK', from, to);

    return new Promise((resolve, reject) => {

      if (from < 0) {
        // can't read beyong file start
        return reject(); 
      }

      Data.get(this.url, {
        headers: {Range: `bytes=${from}-${to}`}
      }).then((r) => {
        try {
          let lines = [];
          // now split the data line by line and omit the last line
          lines = r.split("\n");

          // set correct format based on file heading
          if (from == 0) {
            this.format = readFormat(lines[0]);
            // remove header from the block
            console.log('format is', this.format);
            lines.shift();
          }

          if (direction === 'right') {
            lines.pop(); // last line is incomplete, discard
            
            // TODO first line is incomplete when starting at the middle of the file at random
            if (from == this.start && this.start != 0) {
              lines.shift(); 
            }

            for (let i = r.length; i > 0; i--) {
              if (r[i] == "\n") {
                this.lastReadIndex = i;
                break;
              }
            }
          } else {
            lines.unshift(); // first line is incomplete, discard
            this.firstReadIndex = from;
          }

          resolve(readBlock(this.format, lines));
        } catch(e) {
          console.error(e);
        }
      });
    });
  }
}
