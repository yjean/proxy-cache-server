const http = require('http');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const through2 = require('through2');
const production = require('request');
const server = http.createServer(handler);

const BASE_PATH = '/path/prefix/to/save/resources';
const SOURCE_HOST = 'https://url.from.where/to/fetch/resources';

function handler(req, res) {
  // log query
  console.log(`Fetching ${req.url}`);
  // target filename
  const targetFilename = decodeURI(`${BASE_PATH}${req.url}`);
  // get path
  const dir = path.dirname(targetFilename);
  // create directories if needed
  mkdirp(dir, (err) => {
    if (err) {
      console.log(err);
      res.statusCode = 500;
      return res.end(err);
    }
    // open file path to write
    const fileStream = fs.createWriteStream(targetFilename);
    // get asset from production, pipe it to FileSystem and pipe again to the response
    production.get(`${SOURCE_HOST}${req.url}`)
      .pipe(through2(function(chunk, enc, next) {
        fileStream.write(chunk);
        this.push(chunk);
        next();
      }))
      .pipe(res)
      .on('finish', _ => {
        console.log(`${req.url} fetched.`);
        fileStream.end();
      });
  });
}

server.listen(4242);
