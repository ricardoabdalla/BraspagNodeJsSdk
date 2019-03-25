const VelocityClient = require("../src/Velocity/VelocityClient");
const BraspagAuthClient = require("../src/BraspagAuth/BraspagAuthClient");
const uuid = require('uuid/v1');

var requestDataSet = () => {
    var request = {
        Customer: {
            Name: 'Bjorn Ironside',
            Identity: '762.502.520-96',
            IpAddress: "127.0.0.1",
            Email: "bjorn.ironside@vikings.com.br",
            BirthDate: "1982-06-30",
            Phones: [
                {
                    Type: "Cellphone",
                    Number: "999999999",
                    DDI: "55",
                    DDD: "11"
                },
            ],
            Billing: {
                Street: "Alameda Xingu",
                Number: "512" ,
                Neighborhood: "Alphaville",
                City: "Barueri",
                State: "SP",
                Country: "BR",
                ZipCode: "06455-030"
            },
        },
        Transaction: {
            OrderId: uuid(),
            Date: new Date().toISOString().slice(0, 10),
            Amount: 1000,
        },
        Card: {
            Number: '1000100010001000',
            Holder: 'BJORN IRONSIDE',
            ExpirationDate: '10/2025',
            Brand: 'Visa'
        },
    };

    return request;
};

describe('VelocityTests', () => {
    //#region createSale

    jest.setTimeout(30000);

    it('performAnalysis_forValidRequest_returnsCreated', async () => {
        const authClient = new BraspagAuthClient({env: 'sandbox'});
        let authResponse = await authClient.createAccessToken({
            clientId: '5d85902e-592a-44a9-80bb-bdda74d51bce',
            clientSecret: 'mddRzd6FqXujNLygC/KxOfhOiVhlUr2kjKPsOoYHwhQ=',
            grantType: 'client_credentials',
            scope: 'VelocityApp'
        });
        expect(authResponse.access_token).not.toBeNull();
        expect(authResponse.httpStatus).toBe(200);

        const client = new VelocityClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '94E5EA52-79B0-7DBA-1867-BE7B081EDD97', 
                    AccessToken: authResponse.access_token
            }});

        let request = requestDataSet();
        
        let response = await client.performAnalysis(request);

        expect(response.httpStatus).toBe(201);
        expect(response.AnalysisResult).not.toBeNull();
        expect(response.AnalysisResult.Status).toBe("Reject");
        expect(response.Transaction).not.toBeNull();
        expect(response.RequestId).not.toBeNull();
        expect(response.ErrorDataCollection).toBeNull();
    });

    it('performAnalysis_forInvalidRequest_returnsBadRequest', async () => {
        const authClient = new BraspagAuthClient({env: 'sandbox'});
        let authResponse = await authClient.createAccessToken({
            clientId: '5d85902e-592a-44a9-80bb-bdda74d51bce',
            clientSecret: 'mddRzd6FqXujNLygC/KxOfhOiVhlUr2kjKPsOoYHwhQ=',
            grantType: 'client_credentials',
            scope: 'VelocityApp'
        });
        expect(authResponse.access_token).not.toBeNull();
        expect(authResponse.httpStatus).toBe(200);

        const client = new VelocityClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '94E5EA52-79B0-7DBA-1867-BE7B081EDD97', 
                    AccessToken: authResponse.access_token
            }});

        let request = requestDataSet();
        request.Transaction = null;
        request.Card = null;
        
        let response = await client.performAnalysis(request);

        expect(response.httpStatus).toBe(400);
        expect(response.AnalysisResult).toBeNull();
        expect(response.Transaction).toBeNull();
        expect(response.RequestId).toBeNull();
        expect(response.ErrorDataCollection).not.toBeNull();
    });

    it('performAnalysis_forInvalidAccessToken_returnsBadRequest', async () => {
        const authClient = new BraspagAuthClient({env: 'sandbox'});
        let authResponse = await authClient.createAccessToken({
            clientId: '5d85902e-592a-44a9-80bb-bdda74d51bce',
            clientSecret: 'mddRzd6FqXujNLygC/KxOfhOiVhlUr2kjKPsOoYHwhQ=',
            grantType: 'client_credentials',
            scope: 'VelocityApp'
        });
        expect(authResponse.access_token).not.toBeNull();
        expect(authResponse.httpStatus).toBe(200);

        const client = new VelocityClient({
            env: 'sandbox',
            credentials: {
                    MerchantId: '94E5EA52-79B0-7DBA-1867-BE7B081EDD97', 
                    AccessToken: authResponse.access_token
            }});

        let request = requestDataSet();
        
        let response = await client.performAnalysis(request);

        expect(response.httpStatus).toBe(201);
        expect(response.AnalysisResult).not.toBeNull();
        expect(response.AnalysisResult.Status).toBe("Reject");
        expect(response.Transaction).not.toBeNull();
        expect(response.RequestId).not.toBeNull();
        expect(response.ErrorDataCollection).toBeNull();
    });
});