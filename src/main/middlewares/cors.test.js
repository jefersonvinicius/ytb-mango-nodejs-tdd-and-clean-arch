const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

describe('CORS middleware', () => {
  it('should enable CORS header', async () => {
    app.get('/test', (req, res) => res.send(''));

    const response = await request.get('/test').send();
    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-methods']).toBe('*');
    expect(response.headers['access-control-allow-headers']).toBe('*');
  });
});
