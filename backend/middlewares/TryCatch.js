const TryCatch = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.error("SERVER ERROR:", error);

      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        errors: error.message,
      });
    }
  };
};

export default TryCatch;
