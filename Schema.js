import {fromNode} from 'bluebird';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

const Story = new GraphQLObjectType({
  name: 'Story',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    text: {
      type: GraphQLString
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    bestStoryEver: {
      type: Story,
      resolve(parent, args, {db}) {
        return fromNode((callback) => db.get(`
          SELECT * FROM Story LIMIT 1
        `, callback));
      }
    },
    story: {
      type: Story,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(parent, {id}, {db}) {
        return fromNode((callback) => db.get(`
          SELECT * FROM Story WHERE id = $id
          `, {$id: id}, callback));
      }
    }
  })
});

const Schema = new GraphQLSchema({
  query: Query
});
export default Schema;
