const doneError = (context, error, status = 500) => {
  context.res = {
    'body': { 'error': error },
    'status': status
  };
  context.done();
};

const doneSuccess = (context, doc, status = 200) => {
  if (doc === null) {
    return doneError(context, "Doc not found", 404);
  }
  context.res = {
    'body': doc,
    'status': status
  };
  context.done();
};

// Match output only needs to return the match id rather than the full doc
const outputId = function(doc) {
  const { _id, createdAt, updatedAt } = doc;
  return {
    _id,
    createdAt,
    updatedAt
  };
}

module.exports = {
  doneError,
  doneSuccess,
  outputId
};