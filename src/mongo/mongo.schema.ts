import type { PatientClaim, ResultAuth } from "./claim-authen.entity";
import type { ClaimDetaleRequesModel, ClaimDetaleResponstModel } from "./claim-endpoint.entity";

export interface ResultAuthSchema extends ResultAuth { }

export interface PatientClaimModel extends PatientClaim { }

export interface ClaimDetaleReques extends ClaimDetaleRequesModel { }

export interface ClaimDetaleResponstSchema extends ClaimDetaleResponstModel { }