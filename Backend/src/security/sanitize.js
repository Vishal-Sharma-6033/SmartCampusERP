export const sanitizeMiddleware = (req, res, next) => {
  const clean = (obj) => {
    if (!obj) return obj;

    Object.keys(obj).forEach((key) => {
      if (key.includes("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        clean(obj[key]);
      }
    });

    return obj;
  };

  req.body = clean(req.body);
  req.params = clean(req.params);
  

  next();
};