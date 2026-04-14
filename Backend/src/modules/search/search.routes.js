import express from 'express';
import { search , recentSearches} from './search.controller.js';
import role from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";
import auth from "../../middlewares/auth.middleware.js";
import { auditMiddleware } from "../../middlewares/audit.middleware.js";


const router = express.Router();

router.get('/', auth, role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("SEARCH", "SEARCH"), search);
router.get("/recent", auth, role(ROLES.STUDENT, ROLES.TEACHER, ROLES.ADMIN),auditMiddleware("RECENT_SEARCH", "SEARCH"), recentSearches);

export default router;