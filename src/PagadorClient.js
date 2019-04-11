const Endpoints = require('./Common/Endpoints');
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

        var response = null;

        await axios.post(`${this.url}v2/sales`, request, {headers})
            .then(res => {
                response = {httpStatus: res.status, ...res.data}
            })
            .catch(error => {
                response = {httpStatus: error.response.status, ...error.response}
            });
            
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

        var response = null;

        await axios.put(`${this.url}v2/sales/${request.PaymentId}/capture?amount=${typeof request.Amount === 'undefined' || request.Amount === null ? 0 : request.Amount}`, {}, {headers})
            .then(res => {
                response = {httpStatus: res.status, ...res.data}
            })
            .catch(error => {
                response = {httpStatus: error.response.status, ...error.response}
            });
            
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

        var response = null;

        await axios.put(`${this.url}v2/sales/${request.PaymentId}/void`, {query: request.Amount}, {headers})
            .then(res => {
                response = {httpStatus: res.status, ...res.data}
            })
            .catch(error => {
                response = {httpStatus: error.response.status, ...error.response}
            });
            
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

        var response = null;

        await axios.get(`${this.urlQuery}v2/sales/${paymentId}/`, {headers})
            .then(res => {
                response = {httpStatus: res.status, ...res.data}
            })
            .catch(error => {
                response = {httpStatus: error.response.status, ...error.response}
            });
            
        return response;
    }

    async changeRecurrencyCustomer(recurrentPaymentId, customer, credentials = null){
        if (typeof recurrentPaymentId === 'undefined' || recurrentPaymentId === null)
            throw new Error("RecurrentPaymentId is null");

        if (typeof customer === 'undefined' || customer === null)
            throw new Error("Customer is null");

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

        var response = null;

        await axios.put(`${this.urlQuery}v2/recurrentpayment/${recurrentPaymentId}/customer`, customer, {headers})
            .then(res => {
                response = {httpStatus: res.status}
            })
            .catch(error => {
                response = {httpStatus: error.response.status}
            });

        return response;
    }

    async changeRecurrencyEndDate(recurrentPaymentId, endDate, customer, credentials = null){
        if (typeof recurrentPaymentId === 'undefined' || recurrentPaymentId === null)
            throw new Error("recurrentPaymentId is null");

        if (typeof endDate === 'undefined' || endDate === null)
            throw new Error("endDate is null");

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

        var response = null;

        await axios.put(`${this.url}v2/recurrentpayment/${recurrentPaymentId}/enddate`, JSON.stringify(endDate), {headers})
            .then(res => {
                response = {httpStatus: res.status}
            })
            .catch(error => {
                response = {httpStatus: error.response.status}
            });
            
        return response;
    }

    async changeRecurrencyInterval(recurrentPaymentId, interval, credentials = null){
        if (typeof recurrentPaymentId === 'undefined' || recurrentPaymentId === null)
            throw new Error("recurrentPaymentId is null");

        if (typeof interval === 'undefined' || interval === null)
            throw new Error("endDate is null");

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

        var response = null;

        await axios.put(`${this.url}v2/recurrentpayment/${recurrentPaymentId}/interval`, interval, {headers})
            .then(res => {
                response = {httpStatus: res.status}
            })
            .catch(error => {
                response = {httpStatus: error.response.status}
            });
            
        return response;
    }

    async changeRecurrencyDay(recurrentPaymentId, day, credentials = null){
        if (typeof recurrentPaymentId === 'undefined' || recurrentPaymentId === null)
            throw new Error("recurrentPaymentId is null");

        if (typeof day === 'undefined' || day === null)
            throw new Error("endDate is null");

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

        var response = null;

        await axios.put(`${this.url}v2/recurrentpayment/${recurrentPaymentId}/recurrencyDay`, day, {headers})
            .then(res => {
                response = {httpStatus: res.status}
            })
            .catch(error => {
                response = {httpStatus: error.response.status}
            });
            
        return response;
    }

    async changeRecurrencyAmount(recurrentPaymentId, amount, credentials = null){
        if (typeof recurrentPaymentId === 'undefined' || recurrentPaymentId === null)
            throw new Error("recurrentPaymentId is null");

        if (typeof amount === 'undefined' || amount === null)
            throw new Error("amount is null");

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

        var response = null;

        await axios.put(`${this.url}v2/recurrentpayment/${recurrentPaymentId}/amount`, amount, {headers})
            .then(res => {
                response = {httpStatus: res.status}
            })
            .catch(error => {
                response = {httpStatus: error.response.status}
            });
            
        return response;
    }

    async changeRecurrencyNextPaymentDate(recurrentPaymentId, nextPaymentDate, credentials = null){
        if (typeof recurrentPaymentId === 'undefined' || recurrentPaymentId === null)
            throw new Error("recurrentPaymentId is null");

        if (typeof nextPaymentDate === 'undefined' || nextPaymentDate === null)
            throw new Error("nextPaymentDate is null");

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

        var response = null;

        await axios.put(`${this.url}v2/recurrentpayment/${recurrentPaymentId}/nextPaymentDate`, JSON.stringify(nextPaymentDate), {headers})
            .then(res => {
                response = {httpStatus: res.status}
            })
            .catch(error => {
                response = {httpStatus: error.response.status}
            });
            
        return response;
    }

    async changeRecurrencyPayment(recurrentPaymentId, payment, credentials = null){
        if (typeof recurrentPaymentId === 'undefined' || recurrentPaymentId === null)
            throw new Error("recurrentPaymentId is null");

        if (typeof payment === 'undefined' || payment === null)
            throw new Error("Payment is null");

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

        var response = null;

        await axios.put(`${this.url}v2/recurrentpayment/${recurrentPaymentId}/payment`, payment, {headers})
            .then(res => {
                response = {httpStatus: res.status}
            })
            .catch(error => {
                response = {httpStatus: error.response.status}
            });
            
        return response;
    }

    async deactivateRecurrency(recurrentPaymentId, credentials = null){
        if (typeof recurrentPaymentId === 'undefined' || recurrentPaymentId === null)
            throw new Error("recurrentPaymentId is null");

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

        var response = null;

        await axios.put(`${this.url}v2/recurrentpayment/${recurrentPaymentId}/deactivate`, {}, {headers})
            .then(res => {
                response = {httpStatus: res.status}
            })
            .catch(error => {
                response = {httpStatus: error.response.status}
            });
            
        return response;
    }

    async reactivateRecurrency(recurrentPaymentId, credentials = null){
        if (typeof recurrentPaymentId === 'undefined' || recurrentPaymentId === null)
            throw new Error("recurrentPaymentId is null");

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

        var response = null;

        await axios.put(`${this.url}v2/recurrentpayment/${recurrentPaymentId}/reactivate`, {}, {headers})
            .then(res => {
                response = {httpStatus: res.status}
            })
            .catch(error => {
                response = {httpStatus: error.response.status}
            });
            
        return response;
    }

    async getRecurrency(recurrentPaymentId, credentials = null){
        if (typeof recurrentPaymentId === 'undefined' || recurrentPaymentId === null)
            throw new Error("recurrentPaymentId is null");

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

        var response = null;

        await axios.get(`${this.urlQuery}v2/recurrentpayment/${recurrentPaymentId}`, {headers})
            .then(res => {
                response = {httpStatus: res.status}
            })
            .catch(error => {
                response = {httpStatus: error.response.status}
            });
            
        return response;
    }
};