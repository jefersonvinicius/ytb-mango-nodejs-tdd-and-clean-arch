const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

describe('App setup', () => {
  it('should disable x-powered-by header', async () => {
    app.get('/test', (req, res) => res.send('test'));

    const response = await request.get('/test').send();
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('should enable CORS header', async () => {
    app.get('/test', (req, res) => res.send('test'));

    const response = await request.get('/test').send();
    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-methods']).toBe('*');
    expect(response.headers['access-control-allow-headers']).toBe('*');
  });
});
