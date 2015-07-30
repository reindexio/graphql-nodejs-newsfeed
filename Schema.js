import {fromNode} from 'bluebird';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} from 'graphql';

const Story = new GraphQLObjectType({
  name: 'Story',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    text: {
      type: GraphQLString
    },
    author: {
      type: User,
      resolve(parent, args, {db}) {
        return fromNode((callback) => db.get(`
          SELECT * FROM User WHERE id = $id
        `, {$id: parent.author}, callback));
      }
    }
  })
});

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    stories: {
      type: new GraphQLList(Story),
      resolve(parent, args, {db}) {
        return fromNode((callback) => db.all(`
          SELECT * FROM Story WHERE author = $user
        `, {$user: parent.id}, callback));
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer: {
      type: User,
      resolve(parent, args, {db}) {
        return fromNode((callback) => db.get(`
          SELECT * FROM User WHERE name = 'freiksenet'
        `, callback));
      }
    },
    user: {
      type: User,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(parent, {id}, {db}) {
        return fromNode((callback) => db.get(`
          SELECT * FROM User WHERE id = $id
          `, {$id: id}, callback));
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
