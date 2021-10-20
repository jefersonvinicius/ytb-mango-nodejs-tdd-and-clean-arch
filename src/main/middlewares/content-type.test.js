const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

describe('ContentType middleware', () => {
  it('should returns content type with json as default', async () => {
    app.get('/test', (req, res) => res.send(''));

    const response = await request.get('/test').send();
    expect(response.headers['content-type']).toMatch(/json/);
  });

  it('should return xml content-type if forced', async () => {
    app.get('/test_xml', (req, res) => {
      res.set('content-type', 'text/xml');
      return res.send('');
    });

    const response = await request.get('/test_xml').send();
    expect(response.headers['content-type']).toMatch(/xml/);
  });
});
