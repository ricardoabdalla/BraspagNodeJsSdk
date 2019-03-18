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
        {
            this.url = Endpoints.PagadorApiProduction;
            this.urlQuery = Endpoints.PagadorQueryApiProduction;
        }
        else
        {
            this.url = Endpoints.PagadorApiSandbox;
            this.urlQuery = Endpoints.PagadorQueryApiSandbox;
        }
    }

    async createSale(request, credentials = null) {
        if (typeof request === 'undefined' || request === null)
            throw new Error("Sale request is null");

        if ((typeof this.credentials === 'undefined' || this.credentials === null) && (typeof credentials === 'undefined' || credentials === null))
            throw new Error("Credentials are null");

        if ((typeof this.credentials.MerchantId === 'undefined' || this.credentials.MerchantId === null) && (typeof credentials.MerchantId === 'undefined' || credentials.MerchantId === null))
            throw new Error("MerchantId is null");

        if ((typeof this.credentials.MerchantKey === 'undefined' || this.credentials.MerchantKey === null) && (typeof credentials.MerchantKey === 'undefined' || credentials.MerchantKey === null))
            throw new Error("MerchantKey is null");

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
                response = {httpStatus: res.status, ...res.data}
            })
            .catch(error => {
                response = {httpStatus: error.response.status, ...error.response}
            })
            
        return response;
    }

    async capture(request, credentials = null) {
        if (typeof request === 'undefined' || request === null)
            throw new Error("Capture request is null");

        if ((typeof this.credentials === 'undefined' || this.credentials === null) && (typeof credentials === 'undefined' || credentials === null))
            throw new Error("Credentials are null");

        if ((typeof this.credentials.MerchantId === 'undefined' || this.credentials.MerchantId === null) && (typeof credentials.MerchantId === 'undefined' || credentials.MerchantId === null))
            throw new Error("MerchantId is null");

        if ((typeof this.credentials.MerchantKey === 'undefined' || this.credentials.MerchantKey === null) && (typeof credentials.MerchantKey === 'undefined' || credentials.MerchantKey === null))
            throw new Error("MerchantKey is null");

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

        await axios.put(`${this.url}v2/sales/${request.PaymentId}/capture?amount=${typeof request.Amount === 'undefined' || request.Amount === null ? 0 : request.Amount}`, {}, {headers})
            .then(res => {
                response = {httpStatus: res.status, ...res.data}
            })
            .catch(error => {
                console.log(error);
                response = {httpStatus: error.response.status, ...error.response}
            })
            
        return response;
    }

    async void(request, credentials = null) {
        if (typeof request === 'undefined' || request === null)
            throw new Error("Void request is null");

        if ((typeof this.credentials === 'undefined' || this.credentials === null) && (typeof credentials === 'undefined' || credentials === null))
            throw new Error("Credentials are null");

        if ((typeof this.credentials.MerchantId === 'undefined' || this.credentials.MerchantId === null) && (typeof credentials.MerchantId === 'undefined' || credentials.MerchantId === null))
            throw new Error("MerchantId is null");

        if ((typeof this.credentials.MerchantKey === 'undefined' || this.credentials.MerchantKey === null) && (typeof credentials.MerchantKey === 'undefined' || credentials.MerchantKey === null))
            throw new Error("MerchantKey is null");

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

        await axios.put(`${this.url}v2/sales/${request.PaymentId}/void`, {query: request.Amount}, {headers})
            .then(res => {
                response = {httpStatus: res.status, ...res.data}
            })
            .catch(error => {
                response = {httpStatus: error.response.status, ...error.response}
            })
            
        return response;
    }

    async getOrderById(paymentId, credentials = null) {
        if (typeof paymentId === 'undefined' || paymentId === null)
            throw new Error("PaymentId is null");

        if ((typeof this.credentials === 'undefined' || this.credentials === null) && (typeof credentials === 'undefined' || credentials === null))
            throw new Error("Credentials are null");

        if ((typeof this.credentials.MerchantId === 'undefined' || this.credentials.MerchantId === null) && (typeof credentials.MerchantId === 'undefined' || credentials.MerchantId === null))
            throw new Error("MerchantId is null");

        if ((typeof this.credentials.MerchantKey === 'undefined' || this.credentials.MerchantKey === null) && (typeof credentials.MerchantKey === 'undefined' || credentials.MerchantKey === null))
            throw new Error("MerchantKey is null");

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

        await axios.get(`${this.urlQuery}v2/sales/${paymentId}/`, {headers})
            .then(res => {
                response = {httpStatus: res.status, ...res.data}
            })
            .catch(error => {
                response = {httpStatus: error.response.status, ...error.response}
            })
            
        return response;
    }
}