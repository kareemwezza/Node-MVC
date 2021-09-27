const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
let _db;
// wezza:xiAS24snARCNOODK

const mongoConnect = (cb) => {
  MongoClient.connect("uri")
    .then((client) => {
      console.log("Database connected successfully");
      _db = client.db();
      cb(client);
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
