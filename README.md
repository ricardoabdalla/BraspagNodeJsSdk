# Braspag SDK para Node.js

SDK para integração simplificada nos serviços da plataforma [Braspag](http://www.braspag.com.br/#solucoes)

> Para documentação completa das APIs e manuais, acesse [http://braspag.github.io/](http://braspag.github.io/)

## Índice

- [Features](#features)
- [Dependências](#dependências)
- [Instalação](#instalação)
- [Exemplos de Uso](#exemplos-de-uso)
    - [Pagador](#pagador)
    - [Cartão Protegido](#cartao-protegido)
    - [Velocity](#velocity)
    
## Features

* Instalação simplificada utilizando [NPM](https://www.npmjs.com//), sem necessidade de arquivos de configuração
* Endpoints Braspag já configurados no pacote
* Seleção de ambientes Sandbox ou Production
* Client para a API Braspag Auth (Obtenção de tokens de acesso)
* Client para a API de pagamentos Recorrentes
* Client para a API do Pagador (Autorização, Captura, Cancelamento/Estorno, Consulta)
* Client para a API do Cartão Protegido (Salvar cartão, Recuperar cartão, Invalidar cartão)
* Client para a API de análises do Velocity

## Dependências

* axios

## Instalação

Caso já possua um arquivo `package.json`, adicione a seguinte dependência ao seu projeto:

```
"dependencies": {
    "braspag-nodejs-sdk": "*"
}
```

Com a dependência adicionada ao `package.json`, execute o comando:

```
npm i
```

De forma alternativa, a instalação pode ser realizada executando o comando abaixo diretamente em seu terminal:

```
npm i braspag-nodejs-sdk --save
```

## Exemplos de Uso

### Pagador

Para criar uma transação utilizando cartão de crédito:

```javascript
/* Criação do Cliente Pagador */
const PagadorClient = require('braspag-nodejs-sdk').PagadorClient;

const pagadorClient = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: 'ID_DA_LOJA', 
                MerchantKey: 'CHAVE_DA_LOJA'
        }});

/* Preenchimento dos dados da venda */
var request = {
        MerchantOrderId: '123456789',
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
            Amount: 150000,
            Installments: 1,
            SoftDescriptor: 'Braspag SDK',
            CreditCard: {
                CardNumber: '4485623136297301',
                Holder: 'BJORN IRONSIDE',
                ExpirationDate: '12/2025',
                SecurityCode: '123',
                Brand: 'Visa'
            }
        }
    };

/* Obtenção do resultado da operação */
var response = await pagadorClient.createSale(request);
```

Para criar uma transação utilizando cartão de débito:

```javascript
/* Criação do Cliente Pagador */
const PagadorClient = require('braspag-nodejs-sdk').PagadorClient;

const pagadorClient = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: 'ID_DA_LOJA', 
                MerchantKey: 'CHAVE_DA_LOJA'
        }});

/* Preenchimento dos dados da venda */
var request = {
        MerchantOrderId: '123456789',
        Customer: {
            Name: 'Bjorn Ironside',
            Identity: '762.502.520-96',
            IdentityType: 'CPF',
            Email: 'bjorn.ironside@vikings.com.br'
        },
        Payment: {
            Provider: 'Simulado',
            Type: 'DebitCard',
            Currency: 'BRL',
            Country: 'BRA',
            Amount: 150000,
            Installments: 1,
            SoftDescriptor: 'Braspag SDK',
            ReturnUrl: 'http://www.sualoja.com/url-de-retorno',
            Authenticate: true,
            DebitCard: {
                CardNumber: '4485623136297301',
                Holder: 'BJORN IRONSIDE',
                ExpirationDate: '12/2025',
                SecurityCode: '123',
                Brand: 'Visa'
            }
        }
    };

/* Obtenção do resultado da operação */
var response = await pagadorClient.createSale(request);
```

Para criar uma transação utilizando boleto registrado:

```javascript
/* Criação do Cliente Pagador */
const PagadorClient = require('braspag-nodejs-sdk').PagadorClient;

const pagadorClient = new PagadorClient({
            env: 'sandbox',
            credentials: {
                MerchantId: 'ID_DA_LOJA', 
                MerchantKey: 'CHAVE_DA_LOJA'
        }});

/* Preenchimento dos dados da venda */
var request = {
        MerchantOrderId: '123456789',
        Customer: {
            Name: 'Bjorn Ironside',
            Identity: '762.502.520-96',
            IdentityType: 'CPF',
            Email: 'bjorn.ironside@vikings.com.br'
        },
        Payment: {
            Provider: 'Simulado',
            Type: 'Boleto',
            Currency: 'BRL',
            Country: 'BRA',
            Amount: 150000,
            BoletoNumber: '2017091101',
            Assignor: 'Braspag',
            Demonstrative: 'Texto demonstrativo',
            ExpirationDate: '2019-03-20',
            Identification: '11017523000167',
            Instructions: 'Aceitar somente até a data de vencimento.'
        }
    };

/* Obtenção do resultado da operação */
var response = await pagadorClient.createSale(request);
```

### Cartão Protegido

Para salvar um cartão de crédito em um cofre PCI:

```javascript
/* Criação do Cliente Cartão Protegido */
const CartaoProtegidoClient = require('braspag-nodejs-sdk').CartaoProtegidoClient;

const cartaoProtegidoClient = new CartaoProtegidoClient({
            env: 'sandbox',
            credentials: {
                MerchantKey: 'CHAVE_DA_LOJA'
            }
        });

/* Preenchimento dos dados do cartão a ser salvo */
var request = {
    CustomerName: 'Bjorn Ironside',
    CustomerIdentification: '762.502.520-96',
    CardHolder: "BJORN IRONSIDE",
    CardExpiration: "10/2025",
    CardNumber: "1000100010001000"
};

/* Obtenção do resultado da operação */
var response = await cartaoProtegidoClient.saveCreditCard(request);
```

Para obter os dados de um cartão de crédito previamente salvo em cofre PCI:

```javascript
/* Criação do Cliente Cartão Protegido */
const CartaoProtegidoClient = require('braspag-nodejs-sdk').CartaoProtegidoClient;

const cartaoProtegidoClient = new CartaoProtegidoClient({
            env: 'sandbox',
            credentials: {
                MerchantKey: 'CHAVE_DA_LOJA'
            }
        });

/* Preenchimento do objeto GetCreditCardRequest */
$request = new GetCreditCardRequest();
$request->JustClickKey = "CREDITCARD_TOKEN";

/* Obtenção do resultado da operação */
let response = await client.getCreditCard({
            JustClickKey: 'CREDITCARD_TOKEN'
        });
```

### Velocity

Análise de uma transação com o Velocity:

```javascript
/* Criação do Token de Acesso OAUTH via Braspag Auth */
const authClient = new BraspagAuthClient({env: 'sandbox'});
let authResponse = await authClient.createAccessToken({
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    grantType: 'client_credentials',
    scope: 'VelocityApp'
});

/* Criação do Cliente Velocity */
const VelocityClient = require('braspag-nodejs-sdk').VelocityClient;

const client = new VelocityClient({
    env: 'sandbox',
    credentials: {
            MerchantId: '94E5EA52-79B0-7DBA-1867-BE7B081EDD97', 
            AccessToken: authResponse.access_token
    }
});

/* Obtenção do resultado da operação */
let response = await client.performAnalysis({
    Customer: {
        Name: 'Bjorn Ironside',
        Identity: '76250252096',
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
        Date: 'YYYY-MM-DD hh:mm:ss',
        Amount: 1000,
    },
    Card: {
        Number: '1000100010001000',
        Holder: 'BJORN IRONSIDE',
        ExpirationDate: '10/2025',
        Brand: 'Visa'
    },
});
```