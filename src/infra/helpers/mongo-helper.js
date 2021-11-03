const { MongoClient } = require('mongodb');

module.exports = {
  client: null,
  uri: '',
  dbName: undefined,
  db: null,

  async connect(uri, dbName) {
    this.uri = uri;
    this.dbName = dbName;
    this.client = await MongoClient.connect(uri);
    this.db = this.client.db(dbName);
  },

  async disconnect() {
    await this.client.close();
    this.db = null;
    this.client = null;
  },

  async getCollection(name) {
    if (!this.client) {
      await this.connect(this.uri, this.dbName);
    }
    return this.db.collection(name);
  },
};
