import { differenceInYears } from "date-fns";
import { Patient } from "../database/migrations/v1/schema_v1";

// Helper function to get current timestamp
export function getCurrentTimestamp(): Date {
    return new Date();
}

// Helper function to calculate age from date
export function calculateAge(date: Date | undefined | null): number | null {
    if (!date) return null;
    try {
        const today = new Date();
        return differenceInYears(today, date);
    } catch (error) {
        console.error("Error calculating age:", error);
        return null;
    }
} 

 export const getDisplayName = (patient: Patient): string => {
    return `${patient.first_name} ${
      patient.middle_name ? patient.middle_name + " " : ""
    }${patient.last_name}`;
  };