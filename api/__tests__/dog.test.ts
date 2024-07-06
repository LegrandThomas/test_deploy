import handler from '../pages/api/dogs';
import { createRequest, createResponse } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';

describe('API Route /api/dogs', () => {
  test('GET /api/dogs returns a list of dogs', async () => {
    const req = createRequest<NextApiRequest>();
    req.method = 'GET';

    const res = createResponse<NextApiResponse>();

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toBeInstanceOf(Array);
  });

  test('POST /api/dogs creates a new dog', async () => {
    const req = createRequest<NextApiRequest>();
    req.method = 'POST';
    req.body = {
      name: 'Rex',
      breed: 'Golden Retriever',
    };

    const res = createResponse<NextApiResponse>();

    await handler(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(
      expect.objectContaining({
        name: 'Rex',
        breed: 'Golden Retriever',
      })
    );
  });
});
