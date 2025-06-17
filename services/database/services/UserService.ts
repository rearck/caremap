import { logger } from '@/services/logging/logger';
import { useDB } from '../db';
import { User } from '../migrations/v1/schema_v1';
import { UserModel } from '../models/UserModel';

// Single shared instance of UserModel
const userModel = new UserModel();

// Runs a callback with a UserModel instance that is lazily initialized with the database.
async function useUserModel<T>(fn: (model: UserModel) => Promise<T>): Promise<T> {
    return useDB(async (db) => {
        if (!userModel['db']) {
            userModel.setDB(db);
        }
        return fn(userModel);
    });
}

export const isExistingUser = async (user: User): Promise<boolean> => {
    const existingUser = await getUser(user.email);
    if (existingUser) {
        return true;
    }
    return false;
}

export const createUser = async (user: User): Promise<void> => {

    return useUserModel(async (model) => {
        const userExists = await isExistingUser(user);
        if (!userExists) {
            await model.insert(user);
            logger.debug(`User saved to DB successfully`, `${user.email}`);
        }
    });
}

export const getUser = async (email: string): Promise<User | null> => {
    return useUserModel(async (model) => {
        const result = await model.getFirstByFields({ email: email });
        logger.debug("User stored in DB: ", result);
        return result;
    });
}

export const updateUser = async (user: Partial<User>, conditions: Partial<User>): Promise<void> => {
    return useUserModel(async (model) => {
        let result = await model.updateByFields(user, conditions);
        logger.debug("Updated DB User data: ", `${result}`);
    });
}

export const getAllUsers = async (): Promise<User[]> => {
    return useUserModel(async () => {
        return await userModel.getAll();
    });
}
