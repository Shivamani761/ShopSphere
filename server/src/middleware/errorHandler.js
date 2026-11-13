export function notFoundHandler(_req, res) {
  res.status(404).json({ success: false, message: "API route not found." });
}

export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error." : error.message
  });
}
