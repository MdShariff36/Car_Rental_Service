const successResponse = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

const errorResponse = (res, message = "Error occurred", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
