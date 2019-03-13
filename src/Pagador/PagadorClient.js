const Endpoints = require('../Common/Endpoints');
const isEmpty = require('../Common/Utilities').isEmpty;
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

    async createSale(request, credentials = {}) {
        if (isEmpty(request))
            throw new Error("Sale request is null");

        if (isEmpty(credentials) && isEmpty(this.credentials))
            throw new Error("Credentials are null");

        if (isEmpty(credentials.MerchantId) && isEmpty(this.credentials.MerchantId))
            throw new Error("Invalid credentials: MerchantId is null");

        if (isEmpty(credentials.MerchantKey) && isEmpty(this.credentials.MerchantKey))
            throw new Error("Invalid credentials: MerchantKey is null");

        let currentCredentials = {
            MerchantId: '',
            MerchantKey: ''
        };

        if (!isEmpty(credentials)) currentCredentials = credentials;
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
                response.status = res.status;
            })
            .catch(error => {
                response = error.response.data;
                response.status = error.response.status;
            })
            
        return response;
    }
}