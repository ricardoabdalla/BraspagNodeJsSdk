const BraspagAuthClient = require('../src/BraspagAuth/BraspagAuthClient');

describe('BraspagAuthTests', function() {
    it('createAccessToken_forValidCredentials_returnsAccessToken', async function() {
      const client = new BraspagAuthClient({env: 'sandbox'});
      let response = await client.createAccessToken({
        clientId: '5d85902e-592a-44a9-80bb-bdda74d51bce',
        clientSecret: 'mddRzd6FqXujNLygC/KxOfhOiVhlUr2kjKPsOoYHwhQ=',
        grantType: 'client_credentials',
        scope: 'VelocityApp'
      });
      expect(response.access_token).not.toBeNull();
      expect(response.httpStatus).toBe(200);
    });

    it('createAccessTokenAsync_whenClientIdIsInvalid_returnsInvalidClientError', async function() {
      const client = new BraspagAuthClient({env: 'sandbox'});
      let response = await client.createAccessToken({
        clientId: '99999999-9999-9999-9999-999999999999',
        clientSecret: 'mddRzd6FqXujNLygC/KxOfhOiVhlUr2kjKPsOoYHwhQ=',
        grantType: 'client_credentials',
        scope: 'VelocityApp'
      });
      expect(response.error).toBe('invalid_client');
      expect(response.httpStatus).toBe(400);
    });

    it('createAccessTokenAsync_whenClientSecretIsInvalid_returnsInvalidClientError', async function() {
      const client = new BraspagAuthClient({env: 'sandbox'});
      let response = await client.createAccessToken({
        clientId: '5d85902e-592a-44a9-80bb-bdda74d51bce',
        clientSecret: '9999999999999999999999999999999999999999999',
        grantType: 'client_credentials',
        scope: 'VelocityApp'
      });
      expect(response.error).toBe('invalid_client');
      expect(response.httpStatus).toBe(400);
    });
  });