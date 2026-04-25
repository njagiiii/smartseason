import { Request, Response, NextFunction, json } from "express";
import Jwt from "jsonwebtoken";

// create the type request so thatthe controller knows the type of request itis handling

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

// function that vrifyies the user

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  // attach headers to evry request
  const authHeaders = req.headers.authorization;

  //   check if headers xist
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // attach the headers to a variable token
  const tokens = authHeaders.split(" ")[1];

  // now verify the encoded tokens
  try {
    const decode = Jwt.verify(tokens, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
      email: string;
    };

    // if token is verifies attach the user request to the decoded token then call the callback function
    req.user = decode;
    next();
  } catch {
    res.status(401).json({ message: "Invalid tokens" });
  }
};

//   role assess of admin and agent

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  // if whoever is making the request is not an admin throw an error
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ message: "Admin access is required" });
    return;
  }
  next();
};

export const requireAgent = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  // so if whoever is making the request and is neither an agent nor adminstart with the lowest priviledge and throw an error
  if (req.user?.role !== "AGENT" && req.user?.role !== "ADMIN") {
    res.status(403).json({ message: "Agent access is required" });
    return;
  }

  next();
};
