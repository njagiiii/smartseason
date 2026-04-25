import { Response, Request } from "express";
import * as authService from "../services/auth.services";

// Here we handle the users request to register and login, call the authservice to register use, then sendthe response

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // extract the needed data from the request body
    const { name, email, password, role } = req.body;
    //  check if the data is okay
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: "Name, email and password are required" });
      return;
    }
    // call the authservice to register user
    const user = await authService.registerUser(name, email, password, role);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// handles the login request
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email, Password are required" });
      return;
    }

    // call the auth service.login
    const result = await authService.loginUser(email, password);
    res.status(201).json(result)
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
