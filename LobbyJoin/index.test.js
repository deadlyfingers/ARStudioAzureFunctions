const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const file = path.join(__dirname, './sample.dat');
const data = JSON.parse(fs.readFileSync(file, { 'encoding': 'utf8' }));
const myFunctionName = path.basename(__dirname);
const myFunction = require('./');

test(myFunctionName, (done) => {
  const mockContext = {
    'done': () => {
      expect(mockContext.res.status).toBe(400);
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

test(myFunctionName, (done) => {
  const mockContext = {
    'done': () => {
      expect(mockContext.res.status === 201 || 202).toBeTruthy();
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

afterAll(() => mongoose.disconnect());