export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    req.validatedData = parsed;
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.errors?.[0]?.message || "Validation error",
    });
  }
};