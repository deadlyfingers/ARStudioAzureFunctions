const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, './sample.dat');
const data = JSON.parse(fs.readFileSync(file, { 'encoding': 'utf8' }));
const myFunctionName = path.basename(__dirname);
const myFunction = require('./');
const createLobby = require('./').createLobby;
const randomPin = require('./').randomPin;

test(myFunctionName + " private", (done) => {
  const mockContext = {
    'done': () => {
      expect(mockContext.res.status).toBe(201);
      done();
    },
    'log': () => {}
  };
  const mockRequest = {
    'body': data,
    'query': {}
  };
  myFunction(mockContext, mockRequest);
});

test(myFunctionName, (done) => {
  const mockContext = {
    'done': () => {
      expect(mockContext.res.status).toBe(201);
      done();
    },
    'log': () => {}
  };
  const mockRequest = {
    'body': {},
    'query': {}
  };
  myFunction(mockContext, mockRequest);
});

test("randomPin ***", () => {
  var result = randomPin();
  expect(result.length).toEqual(3);
});

test("randomPin() ****", () => {
  var result = randomPin(4);
  expect(result.length).toEqual(4);
});

test("createLobby", (done) => {
  const mockContext = {
    'done': () => {
      expect(mockContext.res.status).toBe(201);
      done();
    },
    'log': () => {}
  };
  const mockData = {
    'pinLength': 4,
    'private': true
  };
  createLobby(mockContext, mockData);
});