import xss from "xss";

export const xssSanitizer = (req, res, next) => {
  try {
    if (req.body) {
      for (let key in req.body) {
        if (typeof req.body[key] === "string") {
          req.body[key] = xss(req.body[key]);
        }
      }
    }

    next();
  } catch (err) {
    next();
  }
};