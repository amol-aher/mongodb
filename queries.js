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


/* Element Query Operators */

/* $exists */
/* When <boolean> is true, $exists matches the documents that contain the field, including documents where field value is null. If <boolean> is false, query return only those documents that do not contain that field */ 
/* $exists and Not Equal To */
/* Below query will return documents where qty field exists and its value does not equal 5 or 15 */
db.inventory.find( { qty: { $exists: true, $nin: [5, 15] }} )
/* => { "_id" : ObjectId("5f8fa81bd2c948ad7d81e78f"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [   
  "A", "B", "C" ], "price" : 10 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e790"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "A", "tags" : [ "P", "Q" ], "price" : 40 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e791"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D", "tags" : [ [ "A", "B" ], "C" ], "price" : 50 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e792"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "D", "tags" : [ "P", "Q" ], "price" : 1.5 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e793"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [   "X", "Y" ], "price" : 10.3 } */

/* Null Values */
/* Below query results in those documents which have qty field including documents whose field qty contains null value */
db.inventory.find({ qty: { $exists: true } })
/* => { "_id" : ObjectId("5f8fa81bd2c948ad7d81e78f"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ 
  "A", "B", "C" ], "price" : 10 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e790"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "A", "tags" : [ "P", "Q" ], "price" : 40 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e791"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D", "tags" : [ [ "A", "B" ], "C" ], "price" : 50 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e792"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "D", "tags" : [ "P", "Q" ], "price" : 1.5 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e793"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [ "X", "Y" ], "price" : 10.3 } */  

/* $exists: false */
/* Below query will return documents that do not have qty field */
db.inventory.find({ qty: { $exists: false } })
/* => { "_id" : ObjectId("5f8fa81bd2c948ad7d81e794"), "item" : { "name" : "weddingcard", "author" : "d1" }, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [ "X", "Y" ], "price" : 40 } */

Evaluation query operators

$expr: Allows use of aggregation expressions within the query language
$expr can build query expressions that compare fields from same document in $match stage
  1. If $match stage is part of $lookup stage, $expr can compare fields using let variables
  2. $expr only uses indexes on the from collection for equality matches in $match stage
  3. $expr does not support multikey indexes

Dataset:
db.monthlyBudget.insertMany([
  { "category" : "food", "budget": 400, "spent": 450 },
  { "category" : "drinks", "budget": 100, "spent": 150 },
  { "category" : "clothes", "budget": 100, "spent": 50 },
  { "category" : "misc", "budget": 500, "spent": 300 },
  { "category" : "travel", "budget": 200, "spent": 650 }
])

Compare two fields from single document
Below query results containg the documents where spent amount exceeds budget 
db.monthlyBudget.find( { $expr: { $gt: ['$spent', '$budget'] } } )
=> { "_id" : ObjectId("5f8fad0ed2c948ad7d81e795"), "category" : "food", "budget" : 400, "spent" : 450 }
  { "_id" : ObjectId("5f8fad0ed2c948ad7d81e796"), "category" : "drinks", "budget" : 100, "spent" : 150 }
  { "_id" : ObjectId("5f8fad0ed2c948ad7d81e799"), "category" : "travel", "budget" : 200, "spent" : 650 }

Using $expr with conditional statements
Some queries require ability to execute conditional logic when defining a query filter. The aggregation framework provides the $cond operator to express conditional statements. By using $expr with $cond operator, we can specify conditional filter for our query statement.

Dataset: 
db.supplies.insertMany([
   { "item" : "binder", "qty" : NumberInt("100"), "price" : NumberDecimal("12") },
   { "item" : "notebook", "qty" : NumberInt("200"), "price" : NumberDecimal("8") },
   { "item" : "pencil", "qty" : NumberInt("50"), "price" : NumberDecimal("6") },
   { "item" : "eraser", "qty" : NumberInt("150"), "price" : NumberDecimal("3") },
   { "item" : "legal pad", "qty" : NumberInt("42"), "price" : NumberDecimal("10") }
])

Assume that for upcoming sale next month, we want to discount the prices such that,
1. If qty is >= 100, discounted price will be 0.5 of the price
2. If qty < 100, discounted price will be 0.75 of price
Before applying discounts, we want to know which items in supplies collection have a discounted price of less than 5

Below example uses $expr with $cond to calcualte discounted price based on qty and $lt to return documents whose calculated discounted price is less than NumberDecimal('5')
let discountedPrice = {
  $cond: {
    if: { $gte: [ '$qty', 100 ] },
    then: { $multiply: [ '$price', NumberDecimal('0.50') ] },
    else: { $multiply: [ '$price', NumberDecimal('0.75') ] }
  }
}
db.supplies.find( { $expr: { $lt: [ discountedPrice, NumberDecimal('5') ] } } )
=> { "_id" : ObjectId("5f8fae3ed2c948ad7d81e79b"), "item" : "notebook", "qty" : 200, "price" : NumberDecimal("8") }
  { "_id" : ObjectId("5f8fae3ed2c948ad7d81e79c"), "item" : "pencil", "qty" : 50, "price" : NumberDecimal("6") }
  { "_id" : ObjectId("5f8fae3ed2c948ad7d81e79d"), "item" : "eraser", "qty" : 150, "price" : NumberDecimal("3") }

Note: Even though $cond calculates effective discounted price, that price is not reflected in the returned documents. Instead, the returned documents represent the matching documents in theor original state. Query didnot return binder & legal pad documents as their discounted price was greater than 5

$jsonSchema
$jsonSchema operator matches documents that satisfy the specified JSON schema

Schema Validations
db.createCollection('students', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'year', 'major', 'address'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be string and is required'
        },
        year: {
          bsonType: 'int',
          minimum: 2017,
          maximum: 3017,
          description: 'must be an integer in [2017, 3017] and is required'
        },
        major: {
          enum: ['Math', 'English', 'History', null],
          description: 'can only be one of the enum value and is required'
        },
        gpa: {
          bsonType: 'double',
          description: 'must be double if field exists'
        },
        address: {
          bsonType: 'object',
          required: ['city'],
          properties: {
            street: {
              bsonType: 'string',
              description: 'must be string if field exists'
            },
            city: {
              bsonType: 'string',
              description: 'must be string and is requried'
            }
          }
        }
      }
    }
  }
})

As per the given validation schema, below query will fail because gps needs to be double and we are passing integer
db.students.insert({
  name: 'Alice',
  year: NumberInt(2019),
  major: 'History',
  gpa: NumberInt(10),
  address: {
    city: 'NYC',
    street: '33rd Street'
  }
})
=> WriteResult({
    "nInserted" : 0,
    "writeError" : {
      "code" : 121,
      "errmsg" : "Document failed validation"
    }
  })

Query Conditions
We can use $jsonSchema in query conditions for read and write operations to find documents in the collection that satisfy specified schema
Dataset:
db.inventory.insertMany([
   { item: "journal", qty: NumberInt(25), size: { h: 14, w: 21, uom: "cm" }, instock: true },
   { item: "notebook", qty: NumberInt(50), size: { h: 8.5, w: 11, uom: "in" }, instock: true },
   { item: "paper", qty: NumberInt(100), size: { h: 8.5, w: 11, uom: "in" }, instock: 1 },
   { item: "planner", qty: NumberInt(75), size: { h: 22.85, w: 30, uom: "cm" }, instock: 1 },
   { item: "postcard", qty: NumberInt(45), size: { h: 10, w: 15.25, uom: "cm" }, instock: true },
   { item: "apple", qty: NumberInt(45), status: "A", instock: true },
   { item: "pears", qty: NumberInt(50), status: "A", instock: true }
])

let mySchema = {
  required: ['item', 'qty', 'instock', 'size'],
  properties: {
    item: { bsonType: 'string' },
    qty: { bsonType: 'int' },
    size: {
      bsonType: 'object',
      required: ['uom'],
      properties: {
        uom: { bsonType: 'string' },
        h: { bsonType: 'double' },
        w: { bsonType: 'double' }
      }
    },
    instock: { bsonType: 'bool' }
  }
}

We can use above schema to find all documents that satisfy mySchema
db.inventory.find( { $jsonSchema: mySchema } ) OR db.inventory.aggregate( [ { $match: { $jsonSchema: mySchema } } ] )
=> { "_id" : ObjectId("5f8fb617d2c948ad7d81e7a7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "instock" : true }
  { "_id" : ObjectId("5f8fb617d2c948ad7d81e7a8"), "item" : "notebook", "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "instock" : true }
  { "_id" : ObjectId("5f8fb617d2c948ad7d81e7ab"), "item" : "postcard", "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "instock" : true }

We can use $jsonSchema with $nor to find all documents that do not satisfy schema
db.inventory.find( { $nor: [{ $jsonSchema: mySchema }] } )
=> { "_id" : ObjectId("5f8fa81bd2c948ad7d81e78f"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ], "price" : 10 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e790"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "A", "tags" : [ "P", "Q" ], "price" : 40 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e791"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D", "tags" : [ [ "A", "B" ], "C" ], "price" : 50 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e792"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "D", "tags" : [ "P", "Q" ], "price" : 1.5 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e793"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [ "X", "Y" ], "price" : 10.3 }
  { "_id" : ObjectId("5f8fa81bd2c948ad7d81e794"), "item" : { "name" : "weddingcard", "author" : "d1" }, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [ "X", "Y" ], "price" : 40 }
  { "_id" : ObjectId("5f8fb617d2c948ad7d81e7a9"), "item" : "paper", "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "instock" : 1 }
  { "_id" : ObjectId("5f8fb617d2c948ad7d81e7aa"), "item" : "planner", "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "instock" : 1 }

We can also modify documents that do not satisfy the schema
db.inventory.updateMany( { $nor: [ { $jsonSchema: mySchema } ] }, { $set: { isValid: false } } )
=> { "acknowledged" : true, "matchedCount" : 8, "modifiedCount" : 8 }

We can also delete documents that do not satisfy schema
db.inventory.deleteMany( { $nor: [ { $jsonSchema: mySchema } ] } )
=> { "acknowledged" : true, "deletedCount" : 8 }

$mod
Select documents where value of field divided by divisor has a specified remainder(i.e perform a modulo operation to select documents)

use $mod to select documents
Following query selects those documents in inventory collection where value of qty field modulo 5 is 0
db.inventory.find({ qty: { $mod: [5, 0] } })
=> { "_id" : ObjectId("5f8fb617d2c948ad7d81e7a7"), "item" : "journal", "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "instock" : true }
  { "_id" : ObjectId("5f8fb617d2c948ad7d81e7a8"), "item" : "notebook", "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "instock" : true }
  { "_id" : ObjectId("5f8fb617d2c948ad7d81e7ab"), "item" : "postcard", "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "instock" : true }
  { "_id" : ObjectId("5f8fb617d2c948ad7d81e7ac"), "item" : "apple", "qty" : 45, "status" : "A", "instock" : true }
  { "_id" : ObjectId("5f8fb617d2c948ad7d81e7ad"), "item" : "pears", "qty" : 50, "status" : "A", "instock" : true }


$regex
$regex provides Regular Expression capabilities for pattern matching strings in queries. MongoDB uses Perl Compatible Regular Expressions (PCRE) with UTF-8 support
Syntaxes:
1. { <field>: { $regex: /pattern/, $options: '<options>' } }
2. { <field>: { $regex: 'pattern', $options: '<options>' } }
3. { <field>: { $regex: /pattern/<options>' } }

Below are the <options> available
1. i => case insensitivity to match upper & lower cases
2. m => for patterns that include anchor (i.e ^ for start & $ for end) match at beginning or end of each line for strings with multiline values. Without this option, these anchors match at beginning or end of the strings.
   If pattern contains no anchors or if the string value has no new line characters, m option has no effect
3. x => 'Extended' capability to ignore white space characters in $regex, It requires $regex with $options syntax
4. s => Allows dot character to match all characters including new line. It requires $regex with $options syntax

$text
$text performs a text search on the content of field indexed with a text index
Syntax: 
{
  $text: {
    $search: <string>,
    $language: <string>,
    $caseSensitive: <boolean>,
    $diacriticSensitive: <boolean>
  }
}

$search: String of terms that MongoDb parses and uses to query text index. MongoDB performs a logical OR search of terms unless specified as a phrase
$language: This determines list of stop words for the search and rules for the stemmer and tokenizer. If not specified, search uses default language of index. If you specify language value as 'none', text search uses simple tokenization with no list of stop words and no stemming
$caseSensitive: Boolean flag to enable/disable case sensitive search. Defaults to false i.e search defers to case insensitivity of text index
$diacriticSensitive: Boolean flag to enable/disable diacritic sensitive search against v3 text indexes. Defaults to false i.e search defers to diacritic insensitivity of text index

Dataset:
db.articles.createIndex( { subject: "text" } )
=> {
    "createdCollectionAutomatically" : true,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1
  }

db.articles.insert([
  { _id: 1, subject: "coffee", author: "xyz", views: 50 },
  { _id: 2, subject: "Coffee Shopping", author: "efg", views: 5 },
  { _id: 3, subject: "Baking a cake", author: "abc", views: 90  },
  { _id: 4, subject: "baking", author: "xyz", views: 100 },
  { _id: 5, subject: "Café Con Leche", author: "abc", views: 200 },
  { _id: 6, subject: "Сырники", author: "jkl", views: 80 },
  { _id: 7, subject: "coffee and cream", author: "efg", views: 10 },
  { _id: 8, subject: "Cafe con Leche", author: "xyz", views: 10 }
])

Search for single word
Below query returns documents that contains term coffee in indexed subject field or more precisely, stemmed version of word
db.articles.find({ $text: { $search: 'coffee' } })
=> { "_id" : 1, "subject" : "coffee", "author" : "xyz", "views" : 50 }
  { "_id" : 7, "subject" : "coffee and cream", "author" : "efg", "views" : 10 }
  { "_id" : 2, "subject" : "Coffee Shopping", "author" : "efg", "views" : 5 }

Match any of search terms
Below query returns documents that contain either bake or coffee or cake in indexed subject field or more precisely, stemmed version of word
If search string is a space-delimited string, $text operator performs logical OR search on each term and returns documents whose field contain any of the term
db.articles.find({ $text: { $search: 'bake coffee cake' } })
=> { "_id" : 4, "subject" : "baking", "author" : "xyz", "views" : 100 }
  { "_id" : 3, "subject" : "Baking a cake", "author" : "abc", "views" : 90 }
  { "_id" : 1, "subject" : "coffee", "author" : "xyz", "views" : 50 }
  { "_id" : 7, "subject" : "coffee and cream", "author" : "efg", "views" : 10 }
  { "_id" : 2, "subject" : "Coffee Shopping", "author" : "efg", "views" : 5 }

Search for phrase
Following query searches for phrase 'coffee shop'
db.articles.find({ $text: { $search: "\"coffee shop\"" } })
=> { "_id" : 2, "subject" : "Coffee Shopping", "author" : "efg", "views" : 5 }

Exclude documents that contains a term
A negated term is a term that is prefixed with - sign. If we negate a term, $text operator will exclude the documents that contain the term from results.
Below query searches for documents that contain the word coffee but do not contain word shop
db.articles.find({ $text: { $search: 'coffee -shop' } })
=> { "_id" : 1, "subject" : "coffee", "author" : "xyz", "views" : 50 }
  { "_id" : 7, "subject" : "coffee and cream", "author" : "efg", "views" : 10 }

$where
$where operator can be used to pass either a string containing JavaScript expression or a full JavaScript function to query system. $where operator provides greater flexibility but requires that the database processes the JavaScript expression or function for each document in collection
Dataset:
db.players.insertMany([
   { name: "Steve", username: "steveisawesome", first_login: "2017-01-01" },
   { name: "Anya", username: "anya", first_login: "2001-02-02" }
])

Below query uses $where and hex_md5() JavaScript function to compare value of name field to an MD5 hash and returns matching document
db.players.find({ $where: function(){
  return hex_md5(this.name) == '9b53e667f30cd329dca1ec9e6a83e994'
} })
=> { "_id" : ObjectId("5f8fcd97d2c948ad7d81e7af"), "name" : "Anya", "username" : "anya", "first_login" : "2001-02-02" }

As an alternative, above query can be written with $expr and $function. Starting with MongoDB 4.4, we can define custom aggregation expression in JavaScript with aggregation operator $function. To access $function and other aggregation operators, use $expr
db.players.find( { $expr: {
  $function: {
    body: function(name) {
      return hex_md5(name) == '9b53e667f30cd329dca1ec9e6a83e994'
    },
    args: ['$name'],
    lang: 'js'
  }
} } )
=> { "_id" : ObjectId("5f8fcd97d2c948ad7d81e7af"), "name" : "Anya", "username" : "anya", "first_login" : "2001-02-02" }

If we must create custom expressions, $function is preferred over $where

Array Query Operators

$all: Matches arrays that contains all elements specified in query
$all operator selects the documents where value of field is in an array that contains all specified elements.

Equivalent to $and
{ tags: { $all: ['ssl', 'security'] } } is equivalent to { $and: [ { $tags: 'ssl' }, { $tags: 'security' } ] }

Dataset:
db.inventory.insertMany([
  { code: "xyz", tags: [ "school", "book", "bag", "headphone", "appliance" ], qty: [ { size: "S", num: 10, color: "blue" }, { size: "M", num: 45, color: "blue" }, { size: "L", num: 100, color: "green" } ] },
  { code: "abc", tags: [ "appliance", "school", "book" ], qty: [ { size: "6", num: 100, color: "green" }, { size: "6", num: 50, color: "blue" }, { size: "8", num: 100, color: "brown" } ] },
  { code: "efg", tags: [ "school", "book" ], qty: [ { size: "S", num: 10, color: "blue" }, { size: "M", num: 100, color: "blue" }, { size: "L", num: 100, color: "green" } ] },
  { code: "ijk", tags: [ "electronics", "school" ], qty: [ { size: "M", num: 100, color: "green" } ] }
])

$all to match values
Below operation uses $all operator to query the inventory collection for documents where value of tags field is an array whose elements include appliance, school and book
db.inventory.find({ tags: { $all: ['appliance', 'school', 'book'] } })
=> { "_id" : ObjectId("5f8fd30cd2c948ad7d81e7b0"), "code" : "xyz", "tags" : [ "school", "book", "bag", "headphone", "appliance" ], "qty" : [ { "size" : "S", "num" : 10, "color" : "blue" }, { "size" : "M", "num" : 45, 
  "color" : "blue" }, { "size" : "L", "num" : 100, "color" : "green" } ] }
  { "_id" : ObjectId("5f8fd30cd2c948ad7d81e7b1"), "code" : "abc", "tags" : [ "appliance", "school", "book" ], "qty" : [ { "size" : "6", "num" : 100, "color" : "green" }, { "size" : "6", "num" : 50, "color" : "blue" }, { "size" : "8", "num" : 100, "color" : "brown" } ] }

$elemMatch
$elemmatch operator matches documents that contain an array field with atleast one element that matches all specified query criteria
1. We cannot specify $where expression in an $elemMatch
2. We cannot specify $text expression in an $elemMatch

Dataset
db.scores.insertMany([
  { results: [ 82, 85, 88 ] },
  { results: [ 75, 88, 89 ] }
])

Below query matches only those documents where results array contain at least one element that is both greater than 80 & less than 85
db.scores.find({
  results: {
    $elemMatch: {
      $gte: 80,
      $lt: 85
    }
  }
})
=> { "_id" : ObjectId("5f8fd5f7d2c948ad7d81e7b4"), "results" : [ 82, 85, 88 ] }
Above document is returned because element 82 is both greater than 80 & less than 85

Array of embedded documents
Dataset
db.survey.insertMany( [
  { "results": [ { "product": "abc", "score": 10 }, { "product": "xyz", "score": 5 } ] },
  { "results": [ { "product": "abc", "score": 8 }, { "product": "xyz", "score": 7 } ] },
  { "results": [ { "product": "abc", "score": 7 }, { "product": "xyz", "score": 8 } ] },
  { "results": [ { "product": "abc", "score": 7 }, { "product": "def", "score": 8 } ] }
])

Below query matches only those documents where results array contain at least one element with product equal to 'xyz' and score is greater than or equal to 8
db.survey.find({
  results: {
    $elemMatch: {
      product: 'xyz',
      score: { $gte: 8 }
    }
  }
})
=> { "_id" : ObjectId("5f8fd6e4d2c948ad7d81e7b8"), "results" : [ { "product" : "abc", "score" : 7 }, { "product" : "xyz", "score" : 8 } ] }

$size
$size operator matches any array with number of elements specified by argument
db.collection.find( { field: { $size: 1 } } )
$size does not accept range of values

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Aggregation
Aggregation operations process data records and return computed results. Aggregation operations group values from multiple documents together and can perform variety of operations on grouped data to return single result. MongoDB provides three ways to perform aggregation.
1. Aggregation Pipelines: 
  MongoDB's aggregation framework is modeled on concept of data processing pipelines. Document enters a multi stage pipeline that transforms it to an aggregated result.
  Eg. db.orders.aggregate([
        { $match: { status: 'A' } },
        { $group: { _id: '$cust_id', total: { $sum: '$amount' } } }
      ])
  First stage: The $match stage filters documents by status field and passes documents whose status is 'A'  to next stage
  Second Stage: The $group stage groups the documents by cust_id field to calculate the sum of amount for each unique cust_id

  1. Most basic pipeline stages provide filters that operate like queries and document transformations that modify the form of output document
  2. Other pipeline operations provide tools for grouping and sorting documents by specific field or fields as well as tools for aggregating the content of arrays, including arrays of documents. 
  3. In addition, pipeline stages can use operators for tasks like calculating averages or concatenating strings
  4. Pipeline provides efficient data aggregation using native operations withing MongoDB and is preferred method for data aggregation
  5. Aggregation pipelines can use indexes to improve its performance during some of its stages. In addition, the aggregation pipeline has an internal optimization phase.

2. Map-Reduce function
  MongoDb also provides map-reduce operations to perform aggregation. Map-Reduce use custom JavaScript functions to perform map & reduce operations as well as optional finalize operation
  Eg. db.orders.mapReduce(
        function() {
          emit(this.cust_id, this.amount)
        }, function(key, values) {
          return Array.sum(values)
        }, {
          query: { status: 'A' },
          out: 'order_details'
        }
      )

3. Single purpose aggregation methods
  MongoDB also provides db.collection.estimatedDocumentCount(), db.collection.count() & db.collection.distinct(). All these operations aggregate documents from single collection. While these operations provide simple access to common aggregation processes, they lack flexbility & capabilities of aggregation pipelines and map-reduce
  Eg. db.orders.distinct('cust_id')

Aggregation pipeline: 
MongoDB Pipeline consist of stages. Each stage transforms the documents as they pass through pipeline. Pipeline stages do not need to produce one output document for every input document eg. some stages may generate new documents or filter out existing documents.
MongoDB provides db.collection.aggregate() method in mongo shell and aggregate command to run aggregation pipeline
Starting with MongoDB 4.2, we can use aggregation pipeline for updates in findAndModify & update 