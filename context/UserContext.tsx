import React, { createContext, PropsWithChildren, useCallback, useState } from "react";
import { getUserFromStorage } from "@/services/auth-service/google-auth";
import { User } from "@/services/database/migrations/v1/schema_v1";

interface UserContextType {
  user: User | null;
  setUserData: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUserData: async () => {},
});

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const setUserData = useCallback(async () => {
    const userData = await getUserFromStorage();
    setUser(userData);
  }, []);

 

  return (
    <UserContext.Provider
      value={{
        user,
        setUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}