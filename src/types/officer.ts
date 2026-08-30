export type OfficerRole = "OFFICER" | "SUPERVISOR" | "ADMINISTRATOR";
export type OfficerStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Officer {
  id: string;
  badgeNumber: string;
  fullName: string;
  email: string;
  role: OfficerRole;
  status: OfficerStatus;
  checkpointId: string;
  checkpointName: string;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
}
