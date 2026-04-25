export type UseRole = "ADMIN" | "AGENT";
export type FieldStages = "PLANTED" | "GROWING" | "READY" | "HARVESTED";
export type FieldStatus = "ACTIVE" | "AT_RISK" | "COMPLETED";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UseRole;
  createdAt: string;
}

export interface Field {
  id: string;
  name: string;
  cropType: string;
  plantingDate: string;
  stage: FieldStages;
  status: FieldStatus;
  agentId?: string;
  agent?: User;
  createdAt: string;
}

export interface FieldUpdate {
    id: string;
    fieldId: string; 
    agentId: string;
    notes?: string;
    stage: FieldStages;
    createdAt: string;
}
