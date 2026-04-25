import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as fieldService from "../services/field.services";



export const createFieldController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  // get all the fields

  const { name, cropType, plantingDate, expectedHarvestDate, agentId } =
    req.body;

  if (!name || !cropType || !plantingDate || !expectedHarvestDate ) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  // call the services to create the field
  const field = await fieldService.createField(
    name,
    cropType,
    new Date(plantingDate),
    new Date(expectedHarvestDate),
    agentId,
  );

  res.status(200).json({ message: "Field Created", field });
};

// get all fields

export const getAllFieldsController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const fields = await fieldService.getAllFields();
    res.status(200).json({ fields });
  } catch (error: any) {
    res.status(401).json({ message: error.mesage });
  }
};

// get agent fields
// we are getting the agent id from the token if not anyone can fake their id

export const getAgentFieldsController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const agentId = req.user!.id;
    const fields = await fieldService.getAgentFields(agentId);
    res.status(200).json({ fields });
  } catch (error: any) {
    res.status(401).json({ message: error.mesage });
  }
};

// get fields by id
export const getFieldsController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const field = await fieldService.getFieldById(id);
    res.status(200).json({ field });
  } catch (error: any) {
    res.status(401).json({ message: error.mesage });
  }
};
// admin updates
export const updateAllFieldsController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, cropType, plantingDate, expectedHarvestDate } = req.body;

    const fields = await fieldService.updateFieldDetails(id, {
      name,
      cropType,
      plantingDate: plantingDate ? new Date(plantingDate) : undefined,
      expectedHarvestDate: expectedHarvestDate
        ? new Date(expectedHarvestDate)
        : undefined,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.mesage });
  }
};

// assign fields

export const assignFieldsController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;

    if (!agentId) {
      res.status(400).json({ message: "Agent ID is required" });
      return;
    }

    const fields = await fieldService.AssignFields(id, agentId);
    res.status(200).json({ message: "Field assigned successfully", fields });

  } catch (error: any) {
    res.status(401).json({ message: error.mesage });
  }
};




// update fields controller
export const updateFieldController = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const agentId = req.user!.id;
    const { id } = req.params;
    const { stage, notes } = req.body;

    if (!stage) {
      res.status(400).json({ message: "Stage is required" });
      return;
    }

    const updatedFields = await fieldService.updateField(
      id,
      stage,
      notes,
      agentId,
    );
    res
      .status(200)
      .json({ message: "Field updated successfully", updatedFields });
  } catch (error: any) {
    res.status(401).json({ message: error.mesage });
  }
};


// BOTH


// dashboard summary

export const getDashboardSummaryController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const agentId =
      req.user!.role === "AGENT" ? req.user!.id : undefined;
    const summary = await fieldService.getDashboardSummary(agentId);
    res.status(200).json({ summary });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
