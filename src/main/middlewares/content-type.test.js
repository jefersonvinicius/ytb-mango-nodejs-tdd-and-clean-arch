const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

describe('CORS middleware', () => {
  it('should returns content type with json as default', async () => {
    app.get('/test', (req, res) => res.send(''));

    const response = await request.get('/test').send();
    expect(response.headers['content-type']).toMatch(/json/);
  });
});
