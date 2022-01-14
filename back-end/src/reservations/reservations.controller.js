/**
 * List handler for reservation resources
 */
//require service file
//require asyncErrorBoundary 
//complete list function
//valid date middleware


async function list(req, res) {
  res.json({
    data: [],
  });
}

module.exports = {
  list,
};
