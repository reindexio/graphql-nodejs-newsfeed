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
      resolve(parent, args, {rootValue: {db}}) {
        return db.get(`
          SELECT * FROM User WHERE id = $id
        `, {$id: parent.author});
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
      resolve(parent, args, {rootValue: {db}}) {
        return db.all(`
          SELECT * FROM Story WHERE author = $user
        `, {$user: parent.id});
      }
    }
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    viewer: {
      type: User,
      resolve(parent, args, {rootValue: {db, userId}}) {
        return db.get(`
          SELECT * FROM User WHERE id = $id
        `, {$id: userId});
      }
    },
    user: {
      type: User,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(parent, {id}, {rootValue: {db}}) {
        return db.get(`
          SELECT * FROM User WHERE id = $id
          `, {$id: id});
      }
    },
    story: {
      type: Story,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(parent, {id}, {rootValue: {db}}) {
        return db.get(`
          SELECT * FROM Story WHERE id = $id
          `, {$id: id});
      }
    }
  })
});

const Schema = new GraphQLSchema({
  query: Query
});
export default Schema;
