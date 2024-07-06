declare module 'node-mocks-http' {
  import { IncomingHttpHeaders } from 'http';
  import { NextApiRequest, NextApiResponse } from 'next';

  interface MockRequest extends NextApiRequest {
    method: string;
    url: string;
    originalUrl: string;
    path: string;
    params: Record<string, any>;
    query: Record<string, any>;
    body: any;
    headers: IncomingHttpHeaders;
    cookies: Record<string, any>;
    signedCookies: Record<string, any>;
    [key: string]: any;
  }

  interface MockResponse extends NextApiResponse {
    statusCode: number;
    statusMessage: string;
    locals: Record<string, any>;
    _isEndCalled: boolean;
    _isJSON: boolean;
    _isUTF8: boolean;
    _headers: Record<string, any>;
    _data: any;
    _endData: any;
    [key: string]: any;
    _getJSONData: () => any;
    _getStatusCode: () => number;
    _getData: () => any;
    _isEndCalled: () => boolean;
  }

  function createRequest(): MockRequest;
  function createResponse(): MockResponse;

  export {
    createRequest,
    createResponse
  };
}
