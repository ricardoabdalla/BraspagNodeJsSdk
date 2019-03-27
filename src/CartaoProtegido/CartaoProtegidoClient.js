const Endpoints = require("../Common/Endpoints");
const axios = require('axios');
const adapter = require('axios/lib/adapters/http');
var parseString = require('xml2js').parseString;
const uuid = require('uuid/v1');

module.exports = class VelocityClient {
    constructor(options) {
        axios.defaults.adapter = adapter;

        this.credentials = {
            MerchantKey: options.credentials.MerchantKey,
        };

        if (options.env === 'production')
        {
            this.url = Endpoints.CartaoProtegidoProduction;
        }
        else
        {
            this.url = Endpoints.CartaoProtegidoSandbox;
        }
    }

    async getCreditCard(request, credentials = null) {
        if (typeof request === 'undefined' || request === null)
            throw new Error("Request is null");

        if ((typeof this.credentials === 'undefined' || this.credentials === null) && (typeof credentials === 'undefined' || credentials === null))
            throw new Error("Credentials are null");

        if ((typeof this.credentials.MerchantKey === 'undefined' || this.credentials.MerchantKey === null) && (typeof credentials.MerchantKey === 'undefined' || credentials.MerchantKey === null))
            throw new Error("MerchantKey is null");

        let currentCredentials = {
            MerchantKey: ''
        };

        if (credentials !== null) currentCredentials = credentials;
        else currentCredentials = this.credentials;

        let body = 
            `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <GetCreditCard xmlns="http://www.cartaoprotegido.com.br/WebService/">
                        <getCreditCardRequestWS>
                            <RequestId>${request.RequestId ? request.RequestId : uuid()}</RequestId>
                            <MerchantKey>${currentCredentials.MerchantKey}</MerchantKey>
                            <JustClickKey>${request.JustClickKey ? request.JustClickKey : ''}</JustClickKey>
                            <JustClickAlias>${request.JustClickAlias ? request.JustClickAlias : ''}</JustClickAlias>
                        </getCreditCardRequestWS>
                    </GetCreditCard>
                </soap:Body>
            </soap:Envelope>`;

        var response;

        await axios.post(`${this.url}v2/cartaoprotegido.asmx`, body, {headers: {'Content-Type': 'text/xml'}})
            .then(res => {
                parseString(res.data, function (err, result) {
                    let json = {...result['soap:Envelope']['soap:Body'][0]['GetCreditCardResponse'][0]['GetCreditCardResult']}[0];

                    if (json.Success[0] === "true")
                        response = {httpStatus: res.status,  Success: json.Success[0], CorrelationId: json.CorrelationId[0], CardHolder: json.CardHolder[0], CardNumber: json.CardNumber[0], CardExpiration: json.CardExpiration[0], MaskedCardNumber: json.MaskedCardNumber[0]};
                    else
                        response = {httpStatus: res.status,  Success: json.Success[0], CorrelationId: json.CorrelationId[0], ErrorDataCollection: {...json.ErrorReportCollection}};
                });
            })
            .catch(error => {
                console.log(error);
                response = {httpStatus: error.response.status, ...error.response}
            });

        return response;
    };

    async saveCreditCard(request, credentials = null) {
        if (typeof request === 'undefined' || request === null)
            throw new Error("Request is null");

        if ((typeof this.credentials === 'undefined' || this.credentials === null) && (typeof credentials === 'undefined' || credentials === null))
            throw new Error("Credentials are null");

        if ((typeof this.credentials.MerchantKey === 'undefined' || this.credentials.MerchantKey === null) && (typeof credentials.MerchantKey === 'undefined' || credentials.MerchantKey === null))
            throw new Error("MerchantKey is null");

        let currentCredentials = {
            MerchantKey: ''
        };

        if (credentials !== null) currentCredentials = credentials;
        else currentCredentials = this.credentials;

        let body =
            `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <SaveCreditCard xmlns="http://www.cartaoprotegido.com.br/WebService/">
                        <saveCreditCardRequestWS>
                            <RequestId>${request.RequestId ? request.RequestId : uuid()}</RequestId>
                            <MerchantKey>${currentCredentials.MerchantKey}</MerchantKey>
                            <CustomerIdentification>${request.CustomerIdentification}</CustomerIdentification>
                            <CustomerName>${request.CustomerName}</CustomerName>
                            <CardHolder>${request.CardHolder}</CardHolder>
                            <CardNumber>${request.CardNumber}</CardNumber>
                            <CardExpiration>${request.CardExpiration}</CardExpiration>
                            <JustClickAlias>${request.JustClickAlias}</JustClickAlias>
                            <DataCollection />
                        </saveCreditCardRequestWS>
                    </SaveCreditCard>
                </soap:Body>
            </soap:Envelope>`;

        var response;

        await axios.post(`${this.url}v2/cartaoprotegido.asmx`, body, {headers: {'Content-Type': 'text/xml'}})
            .then(res => {
                parseString(res.data, function (err, result) {
                    let json = {...result['soap:Envelope']['soap:Body'][0]['SaveCreditCardResponse'][0]['SaveCreditCardResult']}[0];

                    if (json.Success[0] === "true")
                        response = {httpStatus: res.status,  Success: json.Success[0], CorrelationId: json.CorrelationId[0], JustClickKey: json.JustClickKey[0]};
                    else
                        response = {httpStatus: res.status,  Success: json.Success[0], CorrelationId: json.CorrelationId[0], ErrorDataCollection: {...json.ErrorReportCollection}};
                });
            })
            .catch(error => {
                console.log(error);
                response = {httpStatus: error.response.status, ...error.response}
            });

        return response;
    };

    async invalidateCreditCard(request, credentials = null) {
        if (typeof request === 'undefined' || request === null)
            throw new Error("Request is null");

        if ((typeof this.credentials === 'undefined' || this.credentials === null) && (typeof credentials === 'undefined' || credentials === null))
            throw new Error("Credentials are null");

        if ((typeof this.credentials.MerchantKey === 'undefined' || this.credentials.MerchantKey === null) && (typeof credentials.MerchantKey === 'undefined' || credentials.MerchantKey === null))
            throw new Error("MerchantKey is null");

        let currentCredentials = {
            MerchantKey: ''
        };

        if (credentials !== null) currentCredentials = credentials;
        else currentCredentials = this.credentials;

        let body =
            `<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <InvalidateCreditCard xmlns="http://www.cartaoprotegido.com.br/WebService/">
                        <invalidateCreditCardRequestWS>
                            <RequestId>${request.RequestId ? request.RequestId : uuid()}</RequestId>
                            <MerchantKey>${currentCredentials.MerchantKey}</MerchantKey>
                            <JustClickKey>${request.JustClickKey ? request.JustClickKey : ''}</JustClickKey>
                            <JustClickAlias>${request.JustClickAlias ? request.JustClickAlias : ''}</JustClickAlias>
                        </invalidateCreditCardRequestWS>
                    </InvalidateCreditCard>
                </soap:Body>
            </soap:Envelope>`;

        var response;

        await axios.post(`${this.url}v2/cartaoprotegido.asmx`, body, {headers: {'Content-Type': 'text/xml'}})
            .then(res => {
                parseString(res.data, function (err, result) {
                    let json = {...result['soap:Envelope']['soap:Body'][0]['InvalidateCreditCardResponse'][0]['InvalidateCreditCardResult']}[0];

                    if (json.Success[0] === "true")
                        response = {httpStatus: res.status,  Success: json.Success[0], CorrelationId: json.CorrelationId[0]};
                    else
                        response = {httpStatus: res.status,  Success: json.Success[0], CorrelationId: json.CorrelationId[0], ErrorDataCollection: {...json.ErrorReportCollection}};
                });
            })
            .catch(error => {
                console.log(error);
                response = {httpStatus: error.response.status, ...error.response}
            });

        return response;
    };
};