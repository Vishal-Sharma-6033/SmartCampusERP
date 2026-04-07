import express from 'express';
import { search , recentSearches} from './search.controller.js';
import role from "../../middlewares/role.middleware.js";
import auth from "../../middlewares/auth.middleware.js";


const router = express.Router();

router.get('/', auth, search);
router.get("/recent", auth, recentSearches);
export default router;