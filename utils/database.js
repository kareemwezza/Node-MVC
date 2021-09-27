const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
let _db;
// wezza:xiAS24snARCNOODK

const mongoConnect = (cb) => {
  MongoClient.connect(
    "mongodb+srv://wezza:xiAS24snARCNOODK@cluster0.t3cuq.mongodb.net/shop?retryWrites=true&w=majority"
  )
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
