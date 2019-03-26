const PagadorClient = require('../src/Pagador/PagadorClient');
const TransactionStatus = require('../src/Common/TransactionsStatus');
const RecurrencyInterval = require('../src/Common/RecurrencyInterval');
const uuid = require('uuid/v1');

var requestDataSet = () => {
    var request = {
        MerchantOrderId: uuid(),
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

    jest.setTimeout(30000);

    it('createSale_forValidCredentials_returnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
            }});

        let request = requestDataSet();
        
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
    });

    it('createSale_InvalidCredentials_returns401', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '99999999-9999-9999-9999-999999999999', 
                    MerchantKey: '9999999999999999999999999999999999999999'
            }});

        let request = requestDataSet();
        
        let response = await client.createSale(request);

        expect(response.httpStatus).toBe(401);
    });

    it('createSale_forValidCreditCardWithAutomaticCapture_returnsPaymentConfirmed', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();
        
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

    it('CreateSale_WithAvsAnalysis_ReturnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

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

    it('CreateSale_WithExternalAuthentication_ReturnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

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

    it('CreateSale_WithAuthentication_ReturnsNotFinished', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

        request.Payment.Authenticate = true;
        request.Payment.ReturnUrl = "http://www.test.com/redirect";

        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.NotFinished);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.AuthenticationUrl).not.toBeNull();
        expect(response.Payment.ReturnUrl).toBe(request.Payment.ReturnUrl);
    });

    it('CreateSale_WhenCardSaveIsTrue_ReturnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

        request.Payment.CreditCard.SaveCard = true;

        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.CreditCard.CardToken).not.toBeNull();
    });

    it('CreateSale_UsingCardToken_ReturnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

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

    it('CreateSale_UsingDebitCard_ReturnsNotFinished', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

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

    it('CreateSale_UsingRegisteredBoleto_ReturnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

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

    it('CreateSale_UsingRecurrentPayment_ReturnsAuthorized', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
        }});

        let request = requestDataSet();

        var threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        request.Payment.RecurrentPayment = {
            AuthorizeNow: true,
            EndDate: threeMonthsLater.toISOString().slice(0, 10),
            Interval: 'Monthly'
        };

        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.DebitCard).not.toBeNull();
    });

    //#endregion

    //#region MultiStep_Tests

    it('createSale_ThenCapture_ThenVoid_ThenGet', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
            }});

        let request = requestDataSet();
        
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);

        let captureRequest = {
            PaymentId: response.Payment.PaymentId,
            Amount: response.Payment.Amount
        };

        let captureResponse = await client.capture(captureRequest);

        expect(captureResponse.Status).toBe(TransactionStatus.PaymentConfirmed);
        expect(captureResponse.httpStatus).toBe(200);

        let voidRequest = {
            PaymentId: response.Payment.PaymentId,
            Amount: response.Payment.Amount
        };

        let voidResponse = await client.void(voidRequest);

        expect(voidResponse.Status).toBe(TransactionStatus.Voided);
        expect(voidResponse.httpStatus).toBe(200);

        let getResponse = await client.getOrderById(response.Payment.PaymentId);

        expect(getResponse.Payment.Status).toBe(TransactionStatus.Voided);
        expect(getResponse.httpStatus).toBe(200);
        expect(getResponse.MerchantOrderId).not.toBeNull();
        expect(getResponse.Customer).not.toBeNull();
        expect(getResponse.Payment).not.toBeNull();
    });

    it('createSale_ThenCapture_ThenVoid_ThenGet', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
            }});

        let request = requestDataSet();
        
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);

        let getResponse = await client.getOrderById(response.Payment.PaymentId);

        expect(getResponse.httpStatus).toBe(200);
        expect(getResponse.Payment).not.toBeNull();
        expect(getResponse.Payment.PaymentId).not.toBeNull();

    });

    //#endregion

    //#region Recurrent

    it('ChangeRecurrencyCustomer_ReturnsOk', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
            }});

        let request = requestDataSet();
        
        var threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        request.Payment.RecurrentPayment = {
            AuthorizeNow: true,
            EndDate: threeMonthsLater.toISOString().slice(0, 10),
            Interval: 'Monthly'
        };
          
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.RecurrentPayment).not.toBeNull();
        expect(response.Payment.RecurrentPayment.RecurrentPaymentId).not.toBeNull();
        expect(response.Payment.RecurrentPayment.NextRecurrency).not.toBeNull();
        expect(response.Payment.RecurrentPayment.Interval).not.toBeNull();
        expect(response.Payment.RecurrentPayment.EndDate).not.toBeNull();
    });

    it('ChangeRecurrencyEndDate_ReturnsOk', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
            }});

        let request = requestDataSet();
        
        var threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        request.Payment.RecurrentPayment = {
            AuthorizeNow: true,
            EndDate: threeMonthsLater.toISOString().slice(0, 10),
            Interval: 'Monthly'
        };
          
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.RecurrentPayment).not.toBeNull();
        expect(response.Payment.RecurrentPayment.RecurrentPaymentId).not.toBeNull();
        expect(response.Payment.RecurrentPayment.NextRecurrency).not.toBeNull();
        expect(response.Payment.RecurrentPayment.Interval).not.toBeNull();
        expect(response.Payment.RecurrentPayment.EndDate).not.toBeNull();

        let endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3);

        let recurrentResponse = await client.changeRecurrencyEndDate(response.Payment.RecurrentPayment.RecurrentPaymentId, endDate.toISOString().slice(0, 10));

        expect(recurrentResponse.httpStatus).toBe(200);
    });

    it('ChangeRecurrencyInterval_ReturnsOk', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
            }});

        let request = requestDataSet();
        
        var threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        request.Payment.RecurrentPayment = {
            AuthorizeNow: true,
            EndDate: threeMonthsLater.toISOString().slice(0, 10),
            Interval: 'Monthly'
        };
          
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.RecurrentPayment).not.toBeNull();
        expect(response.Payment.RecurrentPayment.RecurrentPaymentId).not.toBeNull();
        expect(response.Payment.RecurrentPayment.NextRecurrency).not.toBeNull();
        expect(response.Payment.RecurrentPayment.Interval).not.toBeNull();
        expect(response.Payment.RecurrentPayment.EndDate).not.toBeNull();

        let recurrentResponse = await client.changeRecurrencyInterval(response.Payment.RecurrentPayment.RecurrentPaymentId, RecurrencyInterval.Quarterly);

        expect(recurrentResponse.httpStatus).toBe(200);
    });

    it('ChangeRecurrencyDay_ReturnsOk', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
            }});

        let request = requestDataSet();
        
        var threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        request.Payment.RecurrentPayment = {
            AuthorizeNow: true,
            EndDate: threeMonthsLater.toISOString().slice(0, 10),
            Interval: 'Monthly'
        };
          
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.RecurrentPayment).not.toBeNull();
        expect(response.Payment.RecurrentPayment.RecurrentPaymentId).not.toBeNull();
        expect(response.Payment.RecurrentPayment.NextRecurrency).not.toBeNull();
        expect(response.Payment.RecurrentPayment.Interval).not.toBeNull();
        expect(response.Payment.RecurrentPayment.EndDate).not.toBeNull();

        let recurrentResponse = await client.changeRecurrencyInterval(response.Payment.RecurrentPayment.RecurrentPaymentId, 10);

        expect(recurrentResponse.httpStatus).toBe(200);
    });

    it('ChangeRecurrencyAmount_ReturnsOk', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
            }});

        let request = requestDataSet();
        
        var threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        request.Payment.RecurrentPayment = {
            AuthorizeNow: true,
            EndDate: threeMonthsLater.toISOString().slice(0, 10),
            Interval: 'Monthly'
        };
          
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.RecurrentPayment).not.toBeNull();
        expect(response.Payment.RecurrentPayment.RecurrentPaymentId).not.toBeNull();
        expect(response.Payment.RecurrentPayment.NextRecurrency).not.toBeNull();
        expect(response.Payment.RecurrentPayment.Interval).not.toBeNull();
        expect(response.Payment.RecurrentPayment.EndDate).not.toBeNull();

        let recurrentResponse = await client.changeRecurrencyInterval(response.Payment.RecurrentPayment.RecurrentPaymentId, 15000);

        expect(recurrentResponse.httpStatus).toBe(200);
    });

    it('ChangeRecurrencyNextPaymentDate_ReturnsOk', async () => {
        const client = new PagadorClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '33B6AC07-C48D-4F13-A5B9-D3516A378A0C', 
                    MerchantKey: 'd6Rb3OParKvLfzNrURzwcT0f1lzNazS1o19yP6Y8'
            }});

        let request = requestDataSet();
        
        var threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

        request.Payment.RecurrentPayment = {
            AuthorizeNow: true,
            EndDate: threeMonthsLater.toISOString().slice(0, 10),
            Interval: 'Monthly'
        };
          
        let response = await client.createSale(request);

        expect(response.Payment.Status).toBe(TransactionStatus.Authorized);
        expect(response.httpStatus).toBe(201);
        expect(response.Payment.RecurrentPayment).not.toBeNull();
        expect(response.Payment.RecurrentPayment.RecurrentPaymentId).not.toBeNull();
        expect(response.Payment.RecurrentPayment.NextRecurrency).not.toBeNull();
        expect(response.Payment.RecurrentPayment.Interval).not.toBeNull();
        expect(response.Payment.RecurrentPayment.EndDate).not.toBeNull();

        let nextPaymentDate = new Date();
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);

        let recurrentResponse = await client.changeRecurrencyEndDate(response.Payment.RecurrentPayment.RecurrentPaymentId, nextPaymentDate.toISOString().slice(0, 10));

        expect(recurrentResponse.httpStatus).toBe(200);
    });

    //#endregion
});
