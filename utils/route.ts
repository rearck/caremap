export const ROUTES = {

    LAUNCH: "/public/launch" as const,
    ONBOARDING: "/public/onboarding" as const,
    LOGIN: "/auth/login" as const,
    MY_HEALTH: "/myhealth/home" as const,

} as const;
export type AppRoutes = keyof typeof ROUTES;