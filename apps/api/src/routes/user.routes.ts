import { Router, RequestHandler } from "express";
import * as userController from "../controllers/user.controller";
import {
  authenticate,
  requireAdmin,
} from "../middleware/auth.middleware";

const router: Router = Router();

router.use(authenticate as RequestHandler);

// Admin only
router.get("/agents", requireAdmin as RequestHandler, userController.getAllAgents as RequestHandler);

// Both roles
router.get("/:id", userController.getUserById as RequestHandler);

export default router;