import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    name: {
      type: GraphQLString
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      type: User,
      resolve() {
        return {
          name: 'freiksenet'
        };
      }
    }
  })
});

const Schema = new GraphQLSchema({
  query: Query
});
export default Schema;
