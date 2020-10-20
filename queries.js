/* Show all available databases */
show dbs

/* Create admin user */
db.createUser({
  user: 'testuser',
  pwd: 'testpwd',
  roles: [
    {role: "userAdminAnyDatabase", db: "admin"}
  ]
})

/* Create new collection. Collections in MongoDB are analogous to tables in MySQL */
db.createCollection('test')

/* Create user for database */
db.createUser({
  user: 'testapp-user',
  pwd: 'amolaher',
  roles: [{role: 'userAdmin', db: 'testapp'}]
})

/* Create or use existing database 'testapp' */
use testapp

/* This command creates new collection if it doesn't exists else use existing collection and insert data*/
db.admin.insert({name: 'amol', age: 34, })

/* Remove collection 'test' */
db.test.drop()

/* insertMany() command inserts many items to collection inventory. If collection is not available, its created */
db.inventory.insertMany([
  { item: {name: "journal", author: 'b1'}, qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A", tags: [ "A", "B", "C" ], price: 10 },
  { item: {name: "notebook", author: 'a1'}, qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A", tags: [ "P", "Q" ], price: 40 },
  { item: {name: "paper", author: 'x1'}, qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D", tags: [ [ "A", "B" ], "C" ], price: 50 },
  { item: {name: "planner", author: 'c1'}, qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D", tags: [ "P", "Q" ], price: 1.5 },
  { item: {name: "postcard", author: 'd1'}, qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A", tags: [ "X", "Y" ], price: 10.3 },
  { item: {name: "weddingcard", author: 'd1'}, size: { h: 10, w: 15.25, uom: "cm" }, status: "A", tags: [ "X", "Y" ], price: 40 }
])

/* Select all documents in collection */
db.inventory.find({})

/* Fetch by one equality condition. It returns array of documents matching condition */
db.inventory.find( {status: "D"} )

/* Comparison Query Operators */

/* $eq */
/* Matches values that are equal to specified value except when value is regular expression */
db.inventory.find( { qty: { $eq: 25 } } ) OR db.inventory.find({ qty: 25 })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] } */

/* Field in embedded document equals value */
db.inventory.find( { 'size.h': 14 } )
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] } */
      
/* Array element equals value: Below queries inventory collection to select all documents where tags array contains element with value B*/
db.inventory.find( { tags: { $eq: 'B' } } ) OR OR db.inventory.find( { tags: 'B' } )
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] }  */

/* Equals an array value: Below queries inventory collection to select all documents where tags array equals exactly specified array or tags that contains element that equals ['A', 'B'] */
db.inventory.find({ tags: ['A', 'B'] })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D", "tags" : [ [ "A", "B" ], "C" ] } */

/* Regex Matching Behavior */
/* Match on string: String expands to return same values whether implicit match or explicit use of $eq */
db.inventory.find( { 'item.name': "journal" }, {_id: 0 }) OR db.inventory.find( { 'item.name': { $eq: "journal" } }, {_id: 0 })
/* => { "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] } */

/* An explicit query using $eq and a regular expression will only match an object which is also a regular expression. Below example won't return anything since values in item.name are strings */
db.inventory.find( { 'item.name': { $eq: /journal/ } }, {_id: 0 } )

/* A query with an implicit match against regular expression is equivalent to making a query with $regex operator */
db.inventory.find( { 'item.name': /journal/ }, {_id: 0 } ) OR db.inventory.find( { 'item.name': { $regex: /journal/ } }, {_id: 0 } )
/* => { "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] } */


/* $gt & $gte */
/* $gt selects the document where value of field is greater than specified value */
db.inventory.find({ qty: { $gt: 20 } })
/* =>  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] }
    { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "A", "tags" : [ "P", "Q" ] }
    { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D", "tags" : [ [ "A", "B" ], "C" ] }
    { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54d"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "D", "tags" : [ "P", "Q" ] }
    { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54e"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [ "X", "Y" ] } */

/* Below command will update the status to B of the first record found containing qty > 20 */
db.inventory.update({ qty: { $gt: 20 } }, { $set: { status: "B" } })
/* => WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }) */

/* To update all documents whose qty > 20, use multi: true as below */
db.inventory.update({ qty: { $gt: 20 } }, { $set: { status: "B" } }, { multi: true })
/* => WriteResult({ "nMatched" : 5, "nUpserted" : 0, "nModified" : 4 }) */

/* Selects all documents where value of field is greater or equal to (>=) specified value */
db.inventory.find( { qty: { $gte: 100 } } )
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "B", "tags" : [ [ "A", "B" ], "C" ] } */

/* Below query will update all documents whose qty >= 100 */
db.inventory.update({ qty: { $gte: 100 } }, { $set: { status: "C" } })
/* => WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }) */

/* $in */
/* $in operator selects the documents where value of field equals any value in specified array */
db.inventory.find({ qty: { $in: [100, 25] } })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "B", "tags" : [ "A", "B", "C" ] }
      { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "C", "tags" : [ [ "A", "B" ], "C" ] } */

/* Below query will update all documents whose value of field equals any value in specified array. Use {multi: true} if all matched documents are to be updated */
db.inventory.update({ qty: { $in: [100, 25] } }, { $set: { status: 'Updated-New' } }, {multi: true})
/* => WriteResult({ "nMatched" : 2, "nUpserted" : 0, "nModified" : 2 }) */

/* $in operator can specify matching values using regular expressions of the form /pattern/. We cannot use $regex operator expression inside $in. Below query will find all documents where size.uom starts with wither cm or in */
db.inventory.find({ 'size.uom': { $in: [ /^cm/, /^in/ ] } })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "Updated-New", "tags" : [ "A", "B", "C" ] }
    { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "B", "tags" : [ "P", "Q" ] }
    { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "Updated-New", "tags" : [ [ "A", "B" ], "C" ] }
    { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54d"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "B", "tags" : [ "P", "Q" ] }
    { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54e"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "B", "tags" : [ "X", "Y" ] } */

/* $lt & $lte */
/* $lt selects documents where value of field is less than specified value */
db.inventory.find({ qty: { $lt: 50 } })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "Updated-New", "tags" : [ "A", "B", "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54e"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "B", "tags" : [ "X", "Y" ] } */

/* Below query will update status field value to 'Test' in the first document that contain the qty less than 50. Use {multi: true} to update all matched documents */
db.inventory.update({ qty: { $lt: 50 } }, { $set: { status: 'Test' } })
/* => WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }) */

db.inventory.update({ qty: { $lt: 50 } }, { $set: { status: 'Test-Mult' } }, { multi: true })
/* => WriteResult({ "nMatched" : 2, "nUpserted" : 0, "nModified" : 2 }) */

/* $lte selects documents where value of field is less than or equal to specified value */
db.inventory.find({ qty: { $lte: 50 } })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "Test-Mult", "tags" : [ "A", "B", "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "B", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54e"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "Test-Mult", "tags" : [ "X", "Y" ] } */

/* Below query will update status field value to 'Test' in the first document that contain the qty less than 50. Use {multi: true} to update all matched documents */
db.inventory.update({ qty: { $lte: 50 } }, { $set: { status: 'Test-LTE' } })
/* => WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }) */

db.inventory.update({ qty: { $lte: 50 } }, { $set: { status: 'Test-LTE-Mult' } }, { multi: true })
/* => WriteResult({ "nMatched" : 3, "nUpserted" : 0, "nModified" : 3 }) */

/* $ne & $nin */
/* $ne selects the documents where the value of field is not equal to specified value. This also includes the document that do not contain specified field */
db.inventory.find({ qty: { $ne: 20 } })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "Test-LTE-Mult", "tags" : [ "A", "B", "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "Test-LTE-Mult", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "Updated-New", "tags" : [ [ "A", "B" ], "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54d"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "B", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54e"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "Test-LTE-Mult", "tags" : [ "X", "Y" ] } */

/* Below query updates first matched document whose qty is not equal to 20 or document where qty do not exist. Use {multi: true} to update all matched documents */
db.inventory.update({ qty: { $ne: 20 } }, { $set: { status: 'NE-Status' } })
/* => WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }) */

db.inventory.update({ qty: { $ne: 20 } }, { $set: { status: 'NE-Statuses' } }, { multi: true })
/* => WriteResult({ "nMatched" : 5, "nUpserted" : 0, "nModified" : 5 }) */

/* Inequality operator $ne is not very selective since it often matches a large portion of index. As a result, in many cases, a $ne query with an index may perform no better that a $ne query that must scan all documents in collection. */
/* $nin selects the documents where field value is not in specified array or the field does not exists on document. */
/* Below query will select all documents where qty field value does not equals 10 or 20. Selected documents will also contain documents which do not have qty field. */
db.inventory.find({qty: { $nin: [10, 20] } })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "NE-Statuses", "tags" : [ "A", "B", "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NE-Statuses", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NE-Statuses", "tags" : [ [ "A", "B" ], "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54d"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "NE-Statuses", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54e"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "NE-Statuses", "tags" : [ "X", "Y" ] } */

/* If the field holds an array, then $nin operator selects the documents whose field holds an array with no element equal to value specified in the array. */
db.inventory.find({ tags: { $nin: [ 'X', 'Y' ] } })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "NE-Statuses", "tags" : [ "A", "B", "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NE-Statuses", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NE-Statuses", "tags" : [ [ "A", "B" ], "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54d"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "NE-Statuses", "tags" : [ "P", "Q" ] } */

/* Below query will update first document whose tags holds an array with no element equal to X or Y. Use {multi: true} to update all selected documents */
db.inventory.update({ tags: { $nin: [ 'X', 'Y' ] } }, { $set: { status: 'NIN-Status' } })
/* => WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }) */

db.inventory.update({ tags: { $nin: [ 'X', 'Y' ] } }, { $set: { status: 'NIN-Status-Multi' } }, {multi: true})
/* => WriteResult({ "nMatched" : 4, "nUpserted" : 0, "nModified" : 4 }) */

/* Logical Query Operators */

/* $and */
/* $and operator performs logical and operation on array of one or more expressions and selects the document that satisfy all the expressions in array. $and operator uses short-circuit evaluation. If first expression evaluates to false, then MongoDB will not evaluate remaining expressions. MongoDB provides an implicit AND operation when specifying comma seperated list of expressions */  
/* AND Query with multiple expressions specifying same field */
/* Below query will return documents whose qty is not equal to and qty field exists.  */
db.inventory.find({ $and: [ { qty: { $ne: 100 } }, { qty: { $exists: true } } ] })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "NIN-Status-Multi", "tags" : [ "A", "B", "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NIN-Status-Multi", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54d"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "NIN-Status-Multi", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54e"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "NE-Statuses", "tags" : [ "X", "Y" ] } */

/* Above query can also be reconstructed with implicit AND */
db.inventory.find( { qty: { $ne: 100, $exists: true } } )
/* => This will give same results as above */

/* AND query with multiple expressions specifying same operator */
/* Below query will select documents where
  1. qty field value is less than 10 or greater than 50 AND
  2. statis field value is D or qty field value is equal to 100 */
db.inventory.find({
  $and: [
    { $or: [ { qty: { $lt: 10 } }, { qty: { $gt: 50 } } ] },
    { $or: [ { status: 'D' }, { qty: { $eq: 100 } } ] },
  ]
})
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NIN-Status-Multi", "tags" : [ [ "A", "B" ], "C" ] } */
/* Above query cannot be reconstructed using an implicit AND operation because it uses $or operator more than once */

/* $not */
/* $not operator performs logical not operation on specified <operator-expression> and selects documents that do not match the <operator-expression>. This includes the documents that do not contain the specified field */
/* Below query will select documents where
  1. qty field value is less than or equal to 100 OR
  2. qty field does not exists */
db.inventory.find( { qty: { $not: { $gt: 100 } } } )
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "NIN-Status-Multi", "tags" : [ "A", "B", "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NIN-Status-Multi", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NIN-Status-Multi", "tags" : [ [ "A", "B" ], "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54d"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "NIN-Status-Multi", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54e"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "NE-Statuses", "tags" : [ "X", "Y" ] }
  { "_id" : ObjectId("5f8e7efc2aced4f2cefd28e0"), "item" : { "name" : "weddingcard", "author" : "d1" }, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [ "X", "Y" ] } */

/* { $not: { $gt: 100 } is different from $lte operator. { $lte: 1.99 } returns only the documents where field exists and its value is less than or equal to 1.99 */
/* $not operator only affects other operators and cannot check fields and documents independently. So we have to use $not operator for logical disjunctions and $ne to test content of fields directly */
/* $not operator is consistent with behavior with other operators but may yield unexpected results with some data types like Arrays */

/* $not and Regular Expressions */
/* $not operator can perform logical operations on: */

/* 1. regular expression objects (i.e /pattern/) */
/* Below query will fetch documents where item.name field does not start with p */
db.inventory.find({ 'item.name': { $not: /^p.*/ } })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "NIN-Status-Multi", "tags" : [ "A", "B", "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NIN-Status-Multi", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8e7efc2aced4f2cefd28e0"), "item" : { "name" : "weddingcard", "author" : "d1" }, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [ "X", "Y" ] } */

/* 2. $regex operator expression (From MongoDB 4.0.7) */
db.inventory.find( { 'item.name': { $not: { $regex: "^p.*" } } } )
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "NIN-Status-Multi", "tags" : [ "A", "B", "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NIN-Status-Multi", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8e7efc2aced4f2cefd28e0"), "item" : { "name" : "weddingcard", "author" : "d1" }, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [ "X", "Y" ] } */

/* $nor */
/* $nor operator performs logical NOR operation on an array of one or more query expression and selects the document that fail all the query expressions in array. */
/* $nor query with two expressions */
/* Below query will return documents that
  1. contain qty field whose value is not equal to 100 & contain item.name field whose value is not equal to journal OR
  2. contain qty field whose value is not equal to 100 but do not contain item.name field OR
  3. do not contain qty field but contain item.name field whose value is not equal to journal OR
  4. do not contain qty and item.name fields */

db.inventory.find({ $nor: [ { qty: 100 }, { 'item.name': 'journal' } ] })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NIN-Status-Multi", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54d"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "NIN-Status-Multi", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54e"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "NE-Statuses", "tags" : [ "X", "Y" ] }
  { "_id" : ObjectId("5f8e7efc2aced4f2cefd28e0"), "item" : { "name" : "weddingcard", "author" : "d1" }, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [ "X", "Y" ] } */

/* $nor and additional comparisons */
/* Below query returns all documents where
  1. qty field value is not less than 100 AND
  2. item.author value is not a1
  3. includes those documents that do not contain these fields */
  
db.inventory.find({ $nor: [ { qty: { $lt: 100 } }, { 'item.author': 'a1' } ] })
/* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NIN-Status-Multi", "tags" : [ [ "A", "B" ], "C" ] }
  { "_id" : ObjectId("5f8e7efc2aced4f2cefd28e0"), "item" : { "name" : "weddingcard", "author" : "d1" }, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [ "X", "Y" ] } */

/* Exception in returning documents that do not contain fields in $nor expression is when $nor operator is used with $exists operator */

/* $nor & $exists */
/* Below query returns all documents that contain qty field whose value is not equal to 100 */
db.inventory.find({ $nor: [ { qty: 100 }, { qty: { $exists: false } } ] })
  /* => { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "NIN-Status-Multi", "tags" : [ "A", "B", "C" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "NIN-Status-Multi", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54d"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "NIN-Status-Multi", "tags" : [ "P", "Q" ] }
  { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54e"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "NE-Statuses", "tags" : [ "X", "Y" ] } */

/* $or */
/* $or operator performs a logical OR on an array of two or more <expressions> and selects the document that statisfy atleast one of the operation */
/* Below query will select all documents where either qty field value is less than 20 or price field value is 10 */
db.inventory.find({ $or: [ { qty: { $lt: 20 } }, { price: 10 } ] })
/* => { "_id" : ObjectId("5f8e9e8a2aced4f2cefd28e1"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ], "price" : 10 } */

/* $or clauses and indexes */
/* When evaluating clauses in $or expression, MongoDB either performs a collection scan or, if all clauses are supported by indexes, MongoDB performs index scans. i.e for MongoDB to use indexes to evaluate an $or expression, all clauses in $or expression must support indexes. Otherwise, MongoDB will perform collection scan.
When using indexes with $or queries, each clause of an $or expression can use its own index.
To support below query, rather than a compound index, we can create one index on qty and one on price */
db.inventory.find({ $or: [ { qty: { $lt: 25 } }, { price: 10 } ] })

/* $or and text queries */
/* If $or includes text query, all clauses in $or array must be supported by index. This is because, text query must use index, and $or can use indexes if all of its clauses are supported by indexes. If the text query cannot use index, query will return error */

/* $or and GeoSpatial queries */
/* $or supports GeoSpatial clauses with following exception for near clause (near clause includes $nearSphere and $near). $or cannot contain a near clause with any other clause */

/* $or and sort operations */
/* When executing $or queries with sort(), MongoDb can now use indexes that support $or clauses which was not available in previous versions */

/* $or versus $in */
/* When using $or with <expression> that are equality checks for value of the same field, use $in instead of $or operator.  */