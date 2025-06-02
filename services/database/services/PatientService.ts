// /database/services/UserService.ts
import { logger } from '@/services/logging/logger';
import { SQLiteDatabase } from 'expo-sqlite';
import { Patient, tables, User } from '../migrations/v1/schema_v1';
import { PatientModel } from '../models/PatientModel';

export class PatientService {
    private db: SQLiteDatabase;
    private patientModel: PatientModel;

    constructor(db: SQLiteDatabase) {
        this.db = db;
        this.patientModel = new PatientModel(db);
    }

    async isExistingPatient(userId: string): Promise<boolean> {
        const existingPatient = await this.getPatientByUserId(userId);
        if (existingPatient) {
            return true;
        }
        return false;
    }

    async createPatient(user: User): Promise<void> {
        const patientExists = await this.isExistingPatient(user.id);
        if (!patientExists) {
            const newPatient: Partial<Patient> = {
                user_id: user.id,
                name: user.name
            };
            await this.patientModel.insert(newPatient);
            logger.debug(`Patient saved to DB successfully`, `${newPatient.name}`);
        }

    }

    async getPatientByUserId(userId: string): Promise<Patient | null> {
        const result = await this.db.getFirstAsync<Patient>(`SELECT * FROM ${tables.PATIENT} WHERE user_id = ?`, [userId]);
        logger.debug("Patient data: ", result);
        return result;
    }

    async getPatient(id: number): Promise<Patient | null> {
        const result = await this.db.getFirstAsync<Patient>(`SELECT * FROM ${tables.PATIENT} WHERE id = ?`, [id]);
        logger.debug("Patient data: ", result);
        return result;
    }

    async updatePatient(patient: Partial<Patient>, conditions: Partial<Patient>): Promise<void> {
        let result = await this.patientModel.updateByFields(patient, conditions);
        logger.debug("Updated patient data: ", `${result}`);
    }

    async getAllPatients(): Promise<Patient[]> {
        return await this.patientModel.getAll();
    }
}
