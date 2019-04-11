const Endpoints = require("./Common/Endpoints");
const axios = require('axios');
const adapter = require('axios/lib/adapters/http');
const uuid = require('uuid/v1');

module.exports = class VelocityClient {
    constructor(options) {
        axios.defaults.adapter = adapter;

        this.credentials = {
            MerchantId: options.credentials.MerchantId,
            AccessToken: options.credentials.AccessToken
        };

        if (options.env === 'production')
        {
            this.url = Endpoints.VelocityApiProduction;
        }
        else
        {
            this.url = Endpoints.VelocityApiSandbox;
        }
    }

    async performAnalysis(request, credentials = null) {
        if (typeof request === 'undefined' || request === null)
            throw new Error("Request is null");

        if ((typeof this.credentials === 'undefined' || this.credentials === null) && (typeof credentials === 'undefined' || credentials === null))
            throw new Error("Credentials are null");

        if ((typeof this.credentials.MerchantId === 'undefined' || this.credentials.MerchantId === null) && (typeof credentials.MerchantId === 'undefined' || credentials.MerchantId === null))
            throw new Error("MerchantId is null");

        if ((typeof this.credentials.AccessToken === 'undefined' || this.credentials.AccessToken === null) && (typeof credentials.AccessToken === 'undefined' || credentials.AccessToken === null))
            throw new Error("AccessToken is null");

        let currentCredentials = {
            MerchantId: '',
            AccessToken: ''
        };

        if (credentials !== null) currentCredentials = credentials;
        else currentCredentials = this.credentials;
    
        let headers = {
            'Content-Type': 'application/json',
            'MerchantId': currentCredentials.MerchantId,
            'Authorization': `Bearer ${currentCredentials.AccessToken}`,
            'RequestId': uuid(),
            'cache-control': 'no-cache'
        };

        var response;

        await axios.post(`${this.url}analysis/v2/`, request, {headers})
            .then(res => {
                response = {httpStatus: res.status, ...res.data}
            })
            .catch(error => {
                response = {httpStatus: error.response.status, ...error.response}
            });
            
        return response;
    }
};