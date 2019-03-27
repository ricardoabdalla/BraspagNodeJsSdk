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

    it('getCreditCard_forInvalidToken_returnsErrorMessage', async () => {
        const client = new CartaoProtegidoClient({
            env: 'sandbox',
            credentials: {
                MerchantKey: '106c8a0c-89a4-4063-bf50-9e6c8530593b'
            }
        });

        let requestId = uuid();

        let response = await client.getCreditCard({
            JustClickKey: '1ff03ed9-0000-0000-0000-23b700000000',
            RequestId: requestId
        });

        expect(response.httpStatus).toBe(200);
        expect(response.ErrorDataCollection).not.toBeNull();
    });

    it('getCreditCard_forNullToken_returnsInternalServerError', async () => {
        const client = new CartaoProtegidoClient({
            env: 'sandbox',
            credentials: {
                MerchantKey: '106c8a0c-89a4-4063-bf50-9e6c8530593b'
            }
        });

        let requestId = uuid();

        let response = await client.getCreditCard({
            JustClickKey: null,
            RequestId: requestId
        });

        expect(response.httpStatus).toBe(500);
    });

    it('getMaskedCreditCard_forValidToken_returnsCardData', async () => {
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
        expect(response.MaskedCardNumber).toBe('453932******3671');
        expect(response.CardExpiration).toBe('06/2020');
        expect(response.CardHolder).toBe('TESTE TESTETESTE');
        expect(response.CorrelationId).toBe(requestId);
    });

    it('getMaskedCreditCard_forInvalidToken_returnsErrorMessage', async () => {
        const client = new CartaoProtegidoClient({
            env: 'sandbox',
            credentials: {
                MerchantKey: '106c8a0c-89a4-4063-bf50-9e6c8530593b'
            }
        });

        let requestId = uuid();

        let response = await client.getCreditCard({
            JustClickKey: '1ff03ed9-0000-0000-0000-23b700000000',
            RequestId: requestId
        });

        expect(response.httpStatus).toBe(200);
        expect(response.ErrorDataCollection).not.toBeNull();
    });

    it('getMaskedCreditCard_forNullToken_returnsInternalServerError', async () => {
        const client = new CartaoProtegidoClient({
            env: 'sandbox',
            credentials: {
                MerchantKey: '106c8a0c-89a4-4063-bf50-9e6c8530593b'
            }
        });

        let requestId = uuid();

        let response = await client.getCreditCard({
            JustClickKey: null,
            RequestId: uuid()
        });

        expect(response.httpStatus).toBe(500);
    });

    it('saveCreditCard_returnsJustClickToken', async () => {
        const client = new CartaoProtegidoClient({
            env: 'sandbox',
            credentials: {
                MerchantKey: '106c8a0c-89a4-4063-bf50-9e6c8530593b'
            }
        });

        let requestId = uuid();

        let response = await client.saveCreditCard({
            RequestId: requestId,
            CustomerName: 'Bjorn Ironside',
            CustomerIdentification: '762.502.520-96',
            CardHolder: "BJORN IRONSIDE",
            CardExpiration: "10/2025",
            CardNumber: "1000100010001000",
            JustClickAlias: uuid(),
        });

        expect(response.httpStatus).toBe(200);
        expect(typeof response.ErrorDataCollection).toBe('undefined');
    });

    it('invalidateCreditCard_forValidToken_returnsOK', async () => {
        const client = new CartaoProtegidoClient({
            env: 'sandbox',
            credentials: {
                MerchantKey: '106c8a0c-89a4-4063-bf50-9e6c8530593b'
            }
        });

        let requestIdSave = uuid();

        let saveResponse = await client.saveCreditCard({
            RequestId: requestIdSave,
            CustomerName: 'Bjorn Ironside',
            CustomerIdentification: '762.502.520-96',
            CardHolder: "BJORN IRONSIDE",
            CardExpiration: "10/2025",
            CardNumber: "1000100010001000",
            JustClickAlias: uuid(),
        });

        expect(saveResponse.httpStatus).toBe(200);
        expect(saveResponse.JustClickKey).not.toBeNull();
        expect(typeof saveResponse.ErrorDataCollection).toBe('undefined');

        let invalidateRequestId = uuid();

        let invalidateResponse = await client.invalidateCreditCard({
            JustClickKey: saveResponse.JustClickKey,
            RequestId: invalidateRequestId
        });

        expect(invalidateResponse.httpStatus).toBe(200);
        expect(invalidateResponse.CorrelationId).toBe(invalidateRequestId);
    });

    it('invalidateCreditCard_forInvalidToken_returnsErrorMessage', async () => {
        const client = new CartaoProtegidoClient({
            env: 'sandbox',
            credentials: {
                MerchantKey: '106c8a0c-89a4-4063-bf50-9e6c8530593b'
            }
        });

        let requestId = uuid();

        let response = await client.invalidateCreditCard({
            JustClickKey: uuid(),
            RequestId: requestId
        });

        expect(response.httpStatus).toBe(200);
        expect(typeof response.ErrorDataCollection).not.toBe('undefined');
    });
});