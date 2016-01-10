# graphql-nodejs-newsfeed
Example of graphql nodejs backend with newsfeed, built with hapi and sqlite

## Set Up Database

```
$ sqlite3 db.sqlite3 < scripts/createdb.sql
```

## Run Server

```
$ npm start
```

## Example Query

```
$ curl --data "query={ __schema { types { name } } }" localhost:8000
```
