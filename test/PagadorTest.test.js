const PagadorClient = require('../src/Pagador/PagadorClient');
const TransactionStatus = require('../src/Common/TransactionsStatus');
const uuid = require('uuid/v1');

var request = {
    Customer: {
        Name: 'Bjorn Ironside',
        Identity: '762.502.520-96',
        IdentityType: 'CPF',
        Email: 'bjorn.ironside@vikings.com.br'
    },
    Payment: {
        Provider: 'Simulado',
        Type: 'CreditCard',
        Currency: 'BRL',
        Country: 'BRA',
        Amount: 1000,
        Installments: 1,
        SoftDescriptor: 'Braspag SDK',
        CreditCard: {
            CardNumber: '4485623136297301',
            Holder: 'BJORN IRONSIDE',
            ExpirationDate: '12/2025',
            SecurityCode: '123',
            Brand: 'Visa'
        },
        Capture: false,
        Authenticate: false,
        Recurrent: false,
        Credentials: null,
        Assignor: null,
        DebitCard: null,
        FraudAnalysis: null,
        ExternalAuthentication: null,
        Wallet: null,
        RecurrentPayment: null,
        ExternalAuthentication: null,
        ReturnUrl: null
    }
};

describe('PagadorTests', function() {
    it('createSale_forValidCredentials_returnsAuthorized', async function() {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
            }});
        
        request.MerchantOrderId = uuid();
            
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
    });

    it('createSale_forValidCreditCardWithAutomaticCapture_returnsPaymentConfirmed', async function() {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});
        
        request.MerchantOrderId = uuid();
        request.Payment.Capture = true;
            
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.PaymentConfirmed);
        expect(response.httpStatus).toBe(201);
    });

    it('createSale_withFullCustomerData_returnsAuthorized', async function() {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        request.MerchantOrderId = uuid();

        request.Customer.Address = {
            Street: 'Alameda Xingu',
            Number: '512',
            Complement: '27 andar',
            District: 'Alphaville',
            City: 'Barueri',
            State: 'SP',
            Country: 'Brasil',
            ZipCode: '06455-030'
        };

        request.Customer.DeliveryAddress = {
            Street: 'Av. Marechal Camara',
            Number: '160',
            Complement: 'sala 934',
            District: 'Centro',
            City: 'Rio de Janeiro',
            State: 'RJ',
            Country: 'Brasil',
            ZipCode: '20020-080'
        };

        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.PaymentConfirmed);
        expect(response.httpStatus).toBe(201);
    });

    it('CreateSaleAsync_WithAvsAnalysis_ReturnsAuthorized', async function() {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        request.MerchantOrderId = uuid();
        request.Payment.Capture = false;

        request.Payment.CreditCard.Avs = {
            Street: 'Alameda Xingu',
            Number: '512',
            Complement: '27 andar',
            District: 'Alphaville',
            ZipCode: '04604007',
            Cpf: '76250252096'
        };

        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.CreditCard.Avs).not.toBeNull();
        expect(response.Payment.CreditCard.Avs.ReturnCode).toBe('S');
        expect(response.Payment.CreditCard.Avs.Status).toBe(3);
    });
});