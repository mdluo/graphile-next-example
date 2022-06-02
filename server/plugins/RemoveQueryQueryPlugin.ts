import { Plugin } from 'postgraphile';

const RemoveQueryQueryPlugin: Plugin = (builder) => {
  builder.hook('GraphQLObjectType:fields', (fields, _build, context) => {
    if (context.scope.isRootQuery) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { query, ...rest } = fields;
      // Drop the `query` field
      return rest;
    } else {
      return fields;
    }
  });
};

export default RemoveQueryQueryPlugin;
