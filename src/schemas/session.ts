type SessionContext = {
  session?: {
    data: {
      id: string;
      name: string;
    };
  };
};

export const isSignedIn = ({ session }: SessionContext) => {
  return !!session;
};
