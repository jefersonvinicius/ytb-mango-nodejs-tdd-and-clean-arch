const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

describe('JSON parser middleware', () => {
  it('should parse body as JSON', async () => {
    app.post('/test', (req, res) => res.send(req.body));

    await request
      .post('/test')
      .send({
        name: 'Jeferson',
      })
      .expect({ name: 'Jeferson' });
  });
});
