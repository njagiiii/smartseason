import { Router, RequestHandler } from "express";
import * as authController from "../controllers/auth.controller";

// create a variable router
const router:Router = Router();

// public routes for our controller auth - no middleware needed
router.post("/register", authController.register as RequestHandler);
router.post("/login", authController.login as RequestHandler);

export default router;