#Mongoose Soft Delete
Schema middleware that makes it easy to flip a bit instead of removing docs.

##Installation
```
npm install mongoose-soft-delete
```

##Using Soft Delete in your schemas
Mount as standard middleware in your mongoose schemas.
```
const softDelete    = require('mongoose-soft-delete');

const ExampleSchema = new mongoose.Schema({
  field: String,
  anotherField: String
});

ExampleSchema.plugin(softDelete);

mongoose.model('Example', ExampleSchema);
```

##What it does
- Adds a new `isDeleted` path to schemas that is set to false by default. This path is indexed to improve query efficiency
- Adds middleware to `find` and `findOne` queries that filter out documents where isDeleted is true
- Still allows you to query for isDeleted queries if explicitly set in query conditions
- Overrides model's `remove()` method to set isDeleted to true instead of deleting the document

##Use case
In many applications, deleting all traces of a document is not desired. We often would rather hide them so that they can be recovered later or easily restored. This plugin makes it easier to implement this all at once and to remove the burden of having to remember to filter out deleted documents from every query.

##Running tests
Tests are coded in mocha and chai. Setup a local mongodb server and run `npm install`, then run `npm test`.
