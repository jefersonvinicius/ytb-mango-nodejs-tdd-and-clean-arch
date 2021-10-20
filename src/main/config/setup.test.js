const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

describe('App setup', () => {
  it('should disable x-powered-by header', async () => {
    app.get('/test', (req, res) => res.send('test'));

    const response = await request.get('/test').send();
    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});
