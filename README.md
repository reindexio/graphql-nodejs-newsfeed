# graphql-nodejs-newsfeed

Code for [blog post](https://www.reindex.io/blog/building-a-graphql-server-with-node-js-and-sql/).

Example of a GraphQL Node.js backend for a news feed, built with Hapi and SQLite.

```
$ npm install
$ npm start
```

## Test database

`bin/createdb.sql` contains sql script to create a test database. You can create one with

```
$ cat bin/createdb.sql | sqlite3 ./db.sqlite3
```
