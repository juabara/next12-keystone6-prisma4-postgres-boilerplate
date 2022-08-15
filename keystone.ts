import { config } from "@keystone-6/core";
import { statelessSessions } from "@keystone-6/core/session";
import { createAuth } from "@keystone-6/auth";
import { PrizePool } from "./src/schemas/prize-pool";
import { Halve } from "./src/schemas/halve";
import { User } from "./src/schemas/user";
import { Context } from ".keystone/types";
import { makeHalves } from "./src/rest/halves";

const auth = createAuth({
  identityField: "name",
  secretField: "password",
  listKey: "User",
  sessionData: `id name`,
  initFirstItem: {
    fields: ["name", "password"],
  },
});

export default auth.withAuth(
  config({
    db: {
      provider: "postgresql",
      url: String(process.env.DATABASE_URL),
      enableLogging: true,
      useMigrations: true,
      idField: { kind: "uuid" },
      shadowDatabaseUrl: String(process.env.SHADOW_DATABASE_URL),
    },
    experimental: {
      generateNextGraphqlAPI: true,
      generateNodeAPI: true,
    },
    lists: { PrizePool, Halve, User },
    session: statelessSessions({
      secret: "c4f190f9-2751-4eb0-9540-6f36ecf9a8d7", //String(process.env.SESSION_SECRET),
    }),
    server: {
      cors: {
        origin: [String(process.env.PAGE_URL)],
        credentials: true,
      },
      extendExpressApp: (app, createContext) => {
        app.use("/api", async (request, response, next) => {
          (request as any).context = await createContext(request, response);
          next();
        });

        app.get("/api/makehalves", makeHalves);
      },
    },
  })
);
