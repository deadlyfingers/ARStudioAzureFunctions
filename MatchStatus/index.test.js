const path = require('path');
const mongoose = require("mongoose");
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

afterAll(() => mongoose.disconnect());