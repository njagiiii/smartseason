import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import * as userService from "../services/user.services";

export const getAllAgents = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const agents = await userService.getAllAgents();
    res.status(200).json({ agents });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};