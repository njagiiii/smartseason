import * as fieldController from "../controllers/field.controller";
import { RequestHandler } from "express";
import { authenticate , requireAdmin, requireAgent} from "../middleware/auth.middleware";
import { Router } from "express";


const router :Router = Router();
router.use(authenticate as RequestHandler)

// Dashboard - both roles

router.get("/dashboard", fieldController.getDashboardSummaryController as RequestHandler)

// admin routes
router.post("/createfield", requireAdmin as RequestHandler, fieldController.createFieldController as RequestHandler)
router.get("/getallfields", requireAdmin as RequestHandler, fieldController.getAllFieldsController);
router.put("/updateallfields/:id", requireAdmin as RequestHandler, fieldController.updateAllFieldsController);
router.post("/:id/assign", requireAdmin as RequestHandler, fieldController.assignFieldsController as RequestHandler);



// Agent routes
router.get("/my-fields", requireAgent as RequestHandler, fieldController.getAgentFieldsController as RequestHandler);
router.post("/:id/update", requireAgent as RequestHandler, fieldController.updateFieldController as RequestHandler);

// get single field, both roles
router.get("/getfield/:id", fieldController.getFieldsController as RequestHandler);

export default router;