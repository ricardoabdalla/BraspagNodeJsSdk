const Endpoints = require('../Common/Endpoints');
const isEmpty = require('../Common/Utilities').isEmpty;
const axios = require('axios');

module.exports = class BraspagAuthClient {
    constructor(options) {
        if (options.env == 'production')
            this.url = Endpoints.BraspagAuthProduction;
        else
            this.url = Endpoints.BraspagAuthSandbox;
    }

    async createAccessToken(request) {
    console.log("isEmpty " + isEmpty);

        if (isEmpty(request))
            throw new Error("Request is null");

        if (isEmpty(request.clientId))
            throw new Error("Invalid credentials: ClientId is null");

        if (isEmpty(request.clientSecret))
            throw new Error("Invalid credentials: ClientSecret is null");

        let headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'cache-control': 'no-cache'
        };

        let auth = {
            username: request.clientId,
            password: request.clientSecret
        };

        var response;

        await axios.post(`${this.url}oauth2/token`, 'grant_type=client_credentials', {headers, auth})
            .then(res => {
                response = res.data;
                response.status = res.status;
            })
            .catch(error => {
                response = error.response.data;
                response.status = error.response.status;
            })

        return response;
    };
}