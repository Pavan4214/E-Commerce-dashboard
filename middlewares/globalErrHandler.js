exports.globalErrhandler = (err, req, res, next) => {
  //error message in development
  const stack = err?.stack;
  const statusCode = err?.statusCode ? err?.statusCode : 500;
  const message = err?.message;

  // console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "development") {
    res.status(statusCode).json({
      stack,
      message,
    });
  } else if (process.env.NODE_ENV === "production") {
    res.status(statusCode).json({
      status: "failed",
      message: err.message,
    });
  }
};
