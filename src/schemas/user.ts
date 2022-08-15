import { text, password } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';

export const User = list({
    fields: {
        name: text({
            isIndexed: 'unique',
            validation: {
              isRequired: true,
            },
            label: 'Username'
        }),
        password: password({
            validation: {
              isRequired: true,
            }
        })
    },
    db: {
        map: 'users'
    }
});