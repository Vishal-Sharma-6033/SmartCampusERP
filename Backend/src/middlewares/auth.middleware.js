import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

<<<<<<< HEAD
export default authMiddleware;
=======
export default authMiddleware;
>>>>>>> 4cdd07dbacf2981a6e1b4c0a38503635040b7d31
