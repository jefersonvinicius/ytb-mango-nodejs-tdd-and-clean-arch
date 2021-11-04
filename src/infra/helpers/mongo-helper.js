const { MongoClient } = require('mongodb');

module.exports = {
  client: null,
  uri: '',
  dbName: undefined,
  db: null,

  async connect(uri) {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
    this.db = this.client.db();
  },

  async disconnect() {
    await this.client.close();
    this.db = null;
    this.client = null;
  },

  async getCollection(name) {
    if (!this.client) {
      await this.connect(this.uri);
    }
    return this.db.collection(name);
  },
};
