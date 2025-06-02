import { SQLiteDatabase } from "expo-sqlite";
import { BaseModel } from "../BaseModel";
import { User, tables } from "../migrations/v1/schema_v1";

export class UserModel extends BaseModel<User> {

  constructor(db: SQLiteDatabase) {
    super(db, `${tables.USER}`);
  }

}