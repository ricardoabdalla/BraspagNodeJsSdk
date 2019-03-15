const PagadorClient = require('../src/Pagador/PagadorClient');
const TransactionStatus = require('../src/Common/TransactionsStatus');
const uuid = require('uuid/v1');

var requestDataSet = () => {
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

    return request;
};

describe('PagadorTests', () => {

    //#region createSale

    it('createSale_forValidCredentials_returnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
            }});

        let request = requestDataSet();
        
        request.MerchantOrderId = uuid();
            
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
    });

    it('createSale_forValidCreditCardWithAutomaticCapture_returnsPaymentConfirmed', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();
        
        request.MerchantOrderId = uuid();
        request.Payment.Capture = true;
            
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.PaymentConfirmed);
        expect(response.httpStatus).toBe(201);
    });

    it('createSale_withFullCustomerData_returnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

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

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
    });

    it('CreateSaleAsync_WithAvsAnalysis_ReturnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

        request.MerchantOrderId = uuid();

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

    it('CreateSaleAsync_WithExternalAuthentication_ReturnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

        request.MerchantOrderId = uuid();

        request.Payment.ExternalAuthentication = {
            Cavv: 'AABBBlCIIgAAAAARJIgiEL0gDoE=',
            Eci: '5',
            Xid: 'dnFoU3R4amdpWTJJdzJRVHNhNDZ'
        };

        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.ExternalAuthentication).not.toBeNull();
        expect(response.Payment.ExternalAuthentication.Cavv).toBe('AABBBlCIIgAAAAARJIgiEL0gDoE=');
        expect(response.Payment.ExternalAuthentication.Eci).toBe('5');
        expect(response.Payment.ExternalAuthentication.Xid).toBe('dnFoU3R4amdpWTJJdzJRVHNhNDZ');
    });

    it('CreateSaleAsync_WithAuthentication_ReturnsNotFinished', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

        request.MerchantOrderId = uuid();

        request.Payment.Authenticate = true;
        request.Payment.ReturnUrl = "http://www.test.com/redirect";

        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.NotFinished);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.AuthenticationUrl).not.toBeNull();
        expect(response.Payment.ReturnUrl).toBe(request.Payment.ReturnUrl);
    });

    it('CreateSaleAsync_WhenCardSaveIsTrue_ReturnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

        request.MerchantOrderId = uuid();

        request.Payment.CreditCard.SaveCard = true;

        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.CreditCard.CardToken).not.toBeNull();
    });

    it('CreateSaleAsync_UsingCardToken_ReturnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

        request.MerchantOrderId = uuid();

        request.Payment.CreditCard = {
            Holder: null,
            CardNumber: null,
            Brand: null,
            ExpirationDate: null,
            CardToken: "283f90e4-1a90-4bf7-829f-d9e8f14215f1"
        };

        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.CreditCard.CardToken).not.toBeNull();
    });

    it('CreateSaleAsync_UsingDebitCard_ReturnsNotFinished', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

        request.MerchantOrderId = uuid();

        request.Payment.Type = "DebitCard";
        request.Payment.CreditCard = null;
        request.Payment.DebitCard = {
            CardNumber: "4551870000000181",
            Holder: "BJORN IRONSIDE",
            ExpirationDate: "12/2025",
            SecurityCode: "123",
            Brand: "visa"
        };
        request.Payment.Authenticate = true;
        request.Payment.ReturnUrl = "http://www.test.com/redirect";

        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.NotFinished);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.DebitCard).not.toBeNull();
    });

    it('CreateSaleAsync_UsingRegisteredBoleto_ReturnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

        request.MerchantOrderId = uuid();

        request.Payment.Type = "Boleto";
        request.Payment.CreditCard = null;
        request.Payment.BoletoNumber = "2017091101";
        request.Payment.Assignor = "Braspag";
        request.Payment.Demonstrative = "Texto demonstrativo";
        request.Payment.Identification = "11017523000167";
        request.Payment.Instructions = "Aceitar somente até a data de vencimento.";
        request.Payment.ExpirationDate = new Date().toISOString().slice(0, 10)

        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.Assignor).not.toBeNull();
        expect(response.Payment.Address).not.toBeNull();
        expect(response.Payment.BarCodeNumber).not.toBeNull();
        expect(response.Payment.BoletoNumber).not.toBeNull();
        expect(response.Payment.Demonstrative).not.toBeNull();
        expect(response.Payment.DigitableLine).not.toBeNull();
        expect(response.Payment.ExpirationDate).not.toBeNull();
        expect(response.Payment.Identification).not.toBeNull();
        expect(response.Payment.Instructions).not.toBeNull();
        expect(response.Payment.Url).not.toBeNull();
    });

    //#endregion
});
