/* Show all available databases */
show dbs

/* Create admin user */
db.createUser({
  user: 'amolaher',
  pwd: 'amolaher',
  roles: [{role: 'userAdminAnyDatabase', db: 'admin'}]
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
  { item: {name: "journal", author: 'b1'}, qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A", tags: [ "A", "B", "C" ] },
  { item: {name: "notebook", author: 'a1'}, qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A", tags: [ "P", "Q" ] },
  { item: {name: "paper", author: 'x1'}, qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D", tags: [ [ "A", "B" ], "C" ] },
  { item: {name: "planner", author: 'c1'}, qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D", tags: [ "P", "Q" ] },
  { item: {name: "postcard", author: 'd1'}, qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A", tags: [ "X", "Y" ] }
])

/* Query Selectors 
$eq:
Matches values that are equal to specified value except when value is regular expression
db.inventory.find( { qty: { $eq: 25 } } ) OR db.inventory.find({ qty: 25 })
=> { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] }

Field in embedded document equals value:
db.inventory.find( { 'size.h': 14 } )
=> { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] }
    
Array element equals value: Below queries inventory collection to select all documents where tags array contains element with value B
db.inventory.find( { tags: { $eq: 'B' } } ) OR OR db.inventory.find( { tags: 'B' } )
=> { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] } 

Equals an array value: Below queries inventory collection to select all documents where tags array equals exactly specified array or tags that contains element that equals ['A', 'B']
db.inventory.find({ tags: ['A', 'B'] })
=> { "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D", "tags" : [ [ "A", "B" ], "C" ] }

Regex Matching Behavior
Match on string: String expands to return same values whether implicit match or explicit use of $eq
db.inventory.find( { 'item.name': "journal" }, {_id: 0 }) OR db.inventory.find( { 'item.name': { $eq: "journal" } }, {_id: 0 })
=> { "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] }

An explicit query using $eq and a regular expression will only match an object which is also a regular expression. Below example won't return anything since values in item.name are strings
db.inventory.find( { 'item.name': { $eq: /journal/ } }, {_id: 0 } )

A query with an implicit match against regular expression is equivalent to making a query with $regex operator
db.inventory.find( { 'item.name': /journal/ }, {_id: 0 } ) OR db.inventory.find( { 'item.name': { $regex: /journal/ } }, {_id: 0 } )
=> { "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] }
*/

/* Query Selectors 
$gt:
$gt selectes the document where value of field is greater than specified value
db.inventory.find({ qty: { $gt: 20 } })
{ "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54a"), "item" : { "name" : "journal", "author" : "b1" }, "qty" : 25, "size" : { "h" : 14, "w" : 21, "uom" : "cm" }, "status" : "A", "tags" : [ "A", "B", "C" ] }
{ "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54b"), "item" : { "name" : "notebook", "author" : "a1" }, "qty" : 50, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "A", "tags" : [ "P", "Q" ] }
{ "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54c"), "item" : { "name" : "paper", "author" : "x1" }, "qty" : 100, "size" : { "h" : 8.5, "w" : 11, "uom" : "in" }, "status" : "D", "tags" : [ [ "A", "B" ], "C" ] }
{ "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54d"), "item" : { "name" : "planner", "author" : "c1" }, "qty" : 75, "size" : { "h" : 22.85, "w" : 30, "uom" : "cm" }, "status" : "D", "tags" : [ "P", "Q" ] }
{ "_id" : ObjectId("5f8d52034e3ef1b6ed6bb54e"), "item" : { "name" : "postcard", "author" : "d1" }, "qty" : 45, "size" : { "h" : 10, "w" : 15.25, "uom" : "cm" }, "status" : "A", "tags" : [ "X", "Y" ] }

*/

/* Select all documents in collection */
db.inventory.find({})

/* Fetch by one equality condition. It returns array of records matching condition  */
db.inventory.find( {status: "D"} )

/* Fetch conditions with query operators */
