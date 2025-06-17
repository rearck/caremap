import { Patient, User } from "../database/migrations/v1/schema_v1";
import { createPatient, getPatient, getPatientByUserId } from "../database/services/PatientService";
import { createUser, isExistingUser } from "../database/services/UserService";



export async function syncPatientSession(user: User): Promise<Patient> {
    if (!user?.id) {
        throw new Error("User session missing");
    }

    // Storing user in DB if not already exists
    const existingUser = await isExistingUser(user);
    if (!existingUser) {
        await createUser(user);
    }

    // Get patient by user_id
    const existingPatient = await getPatientByUserId(user.id);
    if (existingPatient) {
        // Get patient by patient id
        const fullPatient = await getPatient(existingPatient.id);
        if (!fullPatient) throw new Error("Patient fetch failed.");
        return fullPatient;
    }

    // Create patient
    await createPatient(user);
    const newPatient = await getPatientByUserId(user.id);
    if (!newPatient) throw new Error("Patient creation failed.");

    const fullPatient = await getPatient(newPatient.id);
    if (!fullPatient) throw new Error("Failed to retrieve created patient.");

    return fullPatient;
}
