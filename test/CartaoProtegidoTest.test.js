const CartaoProtegidoClient = require('../src/CartaoProtegido/CartaoProtegidoClient');
const uuid = require('uuid/v1');

describe('CartaoProtegidoTests', () => {
    jest.setTimeout(10000);

    it('getCreditCard_forValidToken_returnsCardData', async () => {
        const client = new CartaoProtegidoClient({
            env: 'sandbox',
            credentials: {
                MerchantKey: '106c8a0c-89a4-4063-bf50-9e6c8530593b'
            }
        });

        let requestId = uuid();

        let response = await client.getCreditCard({
            JustClickKey: '1ff03ed9-5f56-4ac6-bfb8-23b7a1aa55a7',
            RequestId: requestId
        });

        expect(response.httpStatus).toBe(200);
        expect(response.CardNumber).toBe('4539321573193671');
        expect(response.MaskedCardNumber).toBe('453932******3671');
        expect(response.CardExpiration).toBe('06/2020');
        expect(response.CardHolder).toBe('TESTE TESTETESTE');
        expect(response.CorrelationId).toBe(requestId);
    });
});