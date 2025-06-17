import { BaseModel } from "../BaseModel";
import { Patient, tables } from "../migrations/v1/schema_v1";

export class PatientModel extends BaseModel<Patient> {

  constructor() {
    super(tables.PATIENT);
  }

}
