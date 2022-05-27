import React, { ReactNode, useContext } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { User, useCurrentUserQuery } from 'graphql/generated';

export const UserContext = React.createContext<User>({} as User);

export const UserContextProvider: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  useSession({
    required: true,
    onUnauthenticated: signIn,
  });

  const currentUserQuery = useCurrentUserQuery();

  const currentUser = currentUserQuery.data?.currentUser;

  if (!currentUser) {
    return null;
  }

  return (
    <UserContext.Provider value={currentUser as User}>
      {children}
    </UserContext.Provider>
  );
};

export default function useCurrentUser() {
  const user = useContext(UserContext);
  return user;
}
