// /database/services/UserService.ts
import { logger } from '@/services/logging/logger';
import { SQLiteDatabase } from 'expo-sqlite';
import { tables, User } from '../migrations/v1/schema_v1';
import { UserModel } from '../models/UserModel';

export class UserService {
    private db: SQLiteDatabase;
    private userModel: UserModel;

    constructor(db: SQLiteDatabase) {
        this.db = db;
        this.userModel = new UserModel(db);
    }

    async isExistingUser(user: User): Promise<boolean> {
        const existingUser = await this.getUser(user.email);
        if (existingUser) {
            return true;
        }
        return false;
    }

    async createUser(user: User): Promise<void> {
        const userExists = await this.isExistingUser(user);
        if (!userExists) {
            await this.userModel.insert(user);
            logger.debug(`User saved to DB successfully`, `${user.email}`);
        }

    }

    async getUser(email: string): Promise<User | null> {
        const result = await this.db.getFirstAsync<User>(`SELECT * FROM ${tables.USER} WHERE email = ?`, [email]);
        logger.debug("User data: ", result);
        return result;
    }

    async updateUser(user: Partial<User>, conditions: Partial<User>): Promise<void> {
        let result = await this.userModel.updateByFields(user, conditions);
        logger.debug("Updated user data: ", `${result}`);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userModel.getAll();
    }
}
