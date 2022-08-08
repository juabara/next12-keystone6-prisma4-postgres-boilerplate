import { config, list } from '@keystone-6/core';

import { Lists } from '.keystone/types';
import { text } from '@keystone-6/core/fields';

const deleteMeAfterFirstRealSchema: Lists.DeleteMeAfterFirstRealSchema = list({
  fields: {
    title: text({ validation: { isRequired: true } }),
    slug: text({ isIndexed: 'unique', isFilterable: true }),
    content: text(),
  },
});

export default config({
  db: {
    provider: 'postgresql',
    url: String(process.env.DATABASE_URL),
    onConnect: async (context) => {
      /* ... */
    },
    // Optional advanced configuration
    enableLogging: true,
    useMigrations: true,
    idField: { kind: 'uuid' },
    shadowDatabaseUrl: String(process.env.SHADOW_DATABASE_URL),
  },
  experimental: {
    generateNextGraphqlAPI: true,
    generateNodeAPI: true,
  },
  lists: { DeleteMeAfterFirstRealSchema: deleteMeAfterFirstRealSchema },
});
