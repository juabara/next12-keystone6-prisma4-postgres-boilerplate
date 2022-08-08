import { config } from "@keystone-6/core";

export default config({
  db: { provider: "postgresql", url: "file:./app.db" },
  experimental: {
    generateNextGraphqlAPI: true,
    generateNodeAPI: true,
  },
  lists: {},
});
