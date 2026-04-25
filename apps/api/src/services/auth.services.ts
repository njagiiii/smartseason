import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "ADMIN" | "AGENT",
) => {
  // CHECK IF USER EXXISTS

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already Exists!");
  }

  // if user doesn't exist hash the password
  const hashedPass = await bcrypt.hash(password, 10);

  // create user to db
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPass,
      role,
    },
  });

  //   return user data
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt,
  };
};

// login user

export const loginUser = async (email: string, password: string) => {
  // Get the user details

  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // compared typed password to the db password

  const isMatch = await bcrypt.compare(password, user.password);
    

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // generate token
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
