import prisma from "../prisma";
import { Status, Stage } from "@prisma/client";

// lets compute the ststu based on the stages and expectedHarvestDate

const computeStatus = (stage: Stage, expectedHarvestDate: Date): Status => {
  // Alredy havested => completed
  if (stage === "HARVESTED") return "COMPLETED";

  // paSt harvested date + not harvested => AT_RISK
  const today = new Date();

  if (today > expectedHarvestDate) return "AT_RISK";

  // ELSE EVERYTHING ELSE IS ACTIVE
  return "ACTIVE";
};

// FUNCTION TO CREATE FIELD
export const createField = async (
  name: string,
  cropType: string,
  plantingDate: Date,
  expectedHarvestDate: Date,
  agentId?: string,
) => {
  // each field has a ststus, compute the statu to start at planted

  const status = computeStatus("PLANTED", expectedHarvestDate);

  // create the field

  const createdField = await prisma.field.create({
    data: {
      name,
      cropType,
      plantingDate,
      expectedHarvestDate,
      stage: "PLANTED",
      status,
      agentId,
    },
    include: { agent: true },
  });

  return createdField;
};

// get all created fields

export const getAllFields = async () => {
  const fields = await prisma.field.findMany({
    include: { agent: true, updates: true },
    orderBy: { createdAt: "desc" },
  });

  return fields;
};

// get all agent fields by using agent id

export const getAgentFields = async (agentId: string) => {
  const fields = await prisma.field.findMany({
    where: { agentId },
    include: { agent: true, updates: true },
    orderBy: { createdAt: "desc" },
  });
  return fields;
};

// get a single fields by id
export const getFieldById = async (id: string) => {
  return prisma.field.findUnique({
    where: { id },
    include: {
      agent: true,
      updates: {
        orderBy: { createdAt: "desc" },
        include: { agent: true },
      },
    },
  });
};

// update the field(Agents => reporters, Admin -> Managers)
// so agents -> status, stages + notes

export const updateField = async (
  id: string,
  stage: Stage,
  notes: string,
  agentId: string,
) => {
  const field = await prisma.field.findUnique({ where: { id } });
  if (!field) {
    throw new Error("Field doesn't exist");
  }
  // if field exist check the agent asigned to that field
  if (field.agentId !== agentId) {
    throw new Error("You are not assigned to this field");
  }

  // recompute the status based on the new stage

  const status = computeStatus(stage, field.expectedHarvestDate);
  //  update the field
  const updated = await prisma.field.update({
    where: { id },
    data: {
      stage,
      status,
    },
    include: {
      agent: true,
      updates: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Create audit trail
  await prisma.fieldUpdate.create({
    data: { fieldId: id, agentId, stage, notes },
  });
  return updated;
};

// Admin updates fields details

export const updateFieldDetails = async (
  id: string,
  data: {
    name?: string;
    cropType?: string;
    plantingDate?: Date;
    expectedHarvestDate?: Date;
  },
) => {
  // check if fields exist
  const field = await prisma.field.findUnique({ where: { id } });
  if (!field) throw new Error("Field not found!");

  // recompute the status if maybe the date chages
  const expectedHarvestDate =
    data.expectedHarvestDate || field.expectedHarvestDate;
  const status = computeStatus(field.stage, expectedHarvestDate);

  // update the changes

  return prisma.field.update({
    where: { id },
    data: { ...data, status },
    include: { agent: true },
  });
};

// Admin assigns agent a field

export const AssignFields = async (fieldId: string, agentId: string) => {
  // check if the field exists
  const field = await prisma.field.findUnique({ where: { id: fieldId } });

  // check if the agent exists is actuallt an agen
  const agent = await prisma.user.findUnique({ where: { id: agentId } });
  if (!agent) throw new Error("Agent not Found");
  // check there role
  if (agent.role !== "AGENT") throw new Error("User not an Agent");

  // if agent exists update the field to have the assigned agent

  return prisma.field.update({
    where: { id: fieldId },
    data: { agentId },
    include: { agent: true },
  });
};

// Dashboard summary
export const getDashboardSummary = async (agentId?: string) => {
  const where = agentId ? { agentId } : {};

  const [total, active, atRisk, completed] = await Promise.all([
    prisma.field.count({ where }),
    prisma.field.count({ where: { ...where, status: "ACTIVE" } }),
    prisma.field.count({ where: { ...where, status: "AT_RISK" } }),
    prisma.field.count({ where: { ...where, status: "COMPLETED" } }),
  ]);

  return { total, active, atRisk, completed };
};
