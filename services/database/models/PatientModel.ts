import { SQLiteDatabase } from "expo-sqlite";
import { BaseModel } from "../BaseModel";
import { Patient, tables } from "../migrations/v1/schema_v1";

export class PatientModel extends BaseModel<Patient> {

  constructor(db: SQLiteDatabase) {
    super(db, `${tables.PATIENT}`);
  }

}
