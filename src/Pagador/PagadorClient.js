const Endpoints = require('../Common/Endpoints');
const axios = require('axios');
const uuid = require('uuid/v1');

module.exports = class PagadorClient {
    constructor(options) {
        this.credentials = {
            MerchantId: options.credentials.MerchantId,
            MerchantKey: options.credentials.MerchantKey
        };

        if (options.env == 'production')
            this.url = Endpoints.PagadorApiProduction;
        else
            this.url = Endpoints.PagadorApiSandbox;
    }

    async createSale(request, credentials = null) {
        if (typeof request === 'undefined' || request === null)
            throw new Error("Sale request is null");

        if ((typeof this.credentials === 'undefined' || this.credentials === null) && (typeof credentials === 'undefined' || credentials === null))
            throw new Error("Credentials are null");

        if ((typeof this.credentials.MerchantId === 'undefined' || this.credentials.MerchantId === null) && (typeof credentials.MerchantId === 'undefined' || credentials.MerchantId === null))
            throw new Error("MerchantId is null");

        if ((typeof this.credentials.MerchantKey === 'undefined' || this.credentials.MerchantKey === null) && (typeof credentials.MerchantKey === 'undefined' || credentials.MerchantKey === null))
            throw new Error("MerchantId is null");

        let currentCredentials = {
            MerchantId: '',
            MerchantKey: ''
        };

        if (credentials !== null) currentCredentials = credentials;
        else currentCredentials = this.credentials;

        let headers = {
            'Content-Type': 'application/json',
            'MerchantId': currentCredentials.MerchantId,
            'MerchantKey': currentCredentials.MerchantKey,
            'RequestId': uuid(),
            'cache-control': 'no-cache'
        };

        var response;

        await axios.post(`${this.url}v2/sales`, request, {headers})
            .then(res => {
                response = res.data;
                response.httpStatus = res.status;
            })
            .catch(error => {
                response = error.response.data;
                response.httpStatus = error.response.status;
            })
            
        return response;
    }
}