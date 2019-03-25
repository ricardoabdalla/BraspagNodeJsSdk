const Endpoints = require("../Common/Endpoints");
const axios = require('axios');
const uuid = require('uuid/v1');

// for postman copy method
var request = require("request");

module.exports = class VelocityClient {
    constructor(options) {
        this.credentials = {
            MerchantKey: options.credentials.MerchantKey,
        };

        if (options.env == 'production')
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
    
        let headers = {
            'Content-Type': 'text/xml',
            'cache-control': 'no-cache',
            'X-Requested-With': 'XMLHttpRequest'
        };

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

        await axios.post(`${this.url}v2/cartaoprotegido.asmx`, body, {headers})
            .then(res => {
                console.log(res);
                response = {httpStatus: res.status, ...res.data}
            })
            .catch(error => {
                console.log(error);
                response = {httpStatus: error.response.status, ...error.response}
            })
            
        return response;
    }
}