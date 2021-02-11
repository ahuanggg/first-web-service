// console.log('First web service starting up ...');

// pull in the HTTP server module
const http = require('http');

// pull in URL and query modules (for URL parsing)
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// locally this will be 3000, on Heroku it will be assigned;
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndexResponse,
  '/random-number': jsonHandler.getRandomNumberResponse,
  notFound: htmlHandler.get404Response,
};

const onRequest = (request, response) => {
  // //console.log(request.headers);

  const parsedUrl = url.parse(request.url);
  const { pathname } = parsedUrl;

  // console.log('parsedUrl=', parsedUrl);
  // console.log('pathname=', pathname);

  const params = query.parse(parsedUrl.query);

  // console.log('params=', params);
  // console.log('max=', max);

  if (urlStruct[pathname]) {
    urlStruct[pathname](request, response, params);
  } else {
    urlStruct.notFound(request, response, params);
  }
};

// 8 - create the server, hook up the request handling function, and start listening on `port`
http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);
