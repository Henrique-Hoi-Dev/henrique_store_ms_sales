const axios = require('axios');
const logger = require('../../../utils/logger');

// Configuração centralizada dos serviços externos
const EXTERNAL_SERVICES = {
    // Payment Gateways
    payment: {
        stripe: {
            baseURL: process.env.STRIPE_API_URL || 'https://api.stripe.com/v1',
            headers: {
                Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        },
        mercadopago: {
            baseURL: process.env.MERCADOPAGO_API_URL || 'https://api.mercadopago.com',
            headers: {
                Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        },
        pagseguro: {
            baseURL: process.env.PAGSEGURO_API_URL || 'https://ws.pagseguro.uol.com.br',
            headers: {
                'Content-Type': 'application/xml'
            }
        }
    },

    // E-commerce Services
    inventory: {
        baseURL: process.env.INVENTORY_SERVICE_URL || 'http://products-ms:3002',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.INVENTORY_SERVICE_TOKEN}`
        }
    },

    customer: {
        baseURL: process.env.CUSTOMER_SERVICE_URL || 'http://users-ms:3001',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CUSTOMER_SERVICE_TOKEN}`
        }
    },

    notification: {
        baseURL: process.env.NOTIFICATION_SERVICE_URL || 'http://notifications-ms:3003',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NOTIFICATION_SERVICE_TOKEN}`
        }
    },

    // Shipping Services
    shipping: {
        correios: {
            baseURL: process.env.CORREIOS_API_URL || 'https://viacep.com.br/ws',
            headers: {
                'Content-Type': 'application/json'
            }
        },
        fedex: {
            baseURL: process.env.FEDEX_API_URL || 'https://apis-sandbox.fedex.com',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.FEDEX_ACCESS_TOKEN}`
            }
        }
    },

    // Analytics and Monitoring
    analytics: {
        baseURL: process.env.ANALYTICS_SERVICE_URL || 'http://sales-ms:3004',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.ANALYTICS_SERVICE_TOKEN}`
        }
    }
};

class BaseIntegration {
    constructor(serviceName, gateway = null) {
        this.serviceName = serviceName;
        this.gateway = gateway;
        this.externalServices = EXTERNAL_SERVICES;
        this.logger = logger;

        // Configurar cliente HTTP baseado no serviço e gateway
        const serviceConfig = this.getServiceConfig();

        this.httpClient = axios.create({
            baseURL: serviceConfig.baseURL,
            headers: serviceConfig.headers,
            timeout: 30000 // 30 segundos timeout
        });

        this.setupInterceptors();
    }

    getServiceConfig() {
        const service = this.externalServices[this.serviceName];

        if (!service) {
            throw new Error(`Service ${this.serviceName} not configured`);
        }

        // Se há um gateway específico, retorna a configuração do gateway
        if (this.gateway && service[this.gateway]) {
            return service[this.gateway];
        }

        // Caso contrário, retorna a configuração padrão do serviço
        return service;
    }

    setupInterceptors() {
        // Interceptor de requisição para logging
        this.httpClient.interceptors.request.use(
            (config) => {
                this.logger.info(`Making ${config.method?.toUpperCase()} request to ${config.baseURL}${config.url}`, {
                    service: this.serviceName,
                    gateway: this.gateway,
                    method: config.method,
                    url: config.url
                });
                return config;
            },
            (error) => {
                this.logger.error('Request interceptor error', error);
                return Promise.reject(error);
            }
        );

        // Interceptor de resposta para logging e tratamento de erros
        this.httpClient.interceptors.response.use(
            (response) => {
                this.logger.info(`Response received from ${this.serviceName}`, {
                    service: this.serviceName,
                    gateway: this.gateway,
                    status: response.status,
                    statusText: response.statusText
                });
                return response;
            },
            (error) => {
                this.logger.error(`Integration error with ${this.serviceName}`, {
                    service: this.serviceName,
                    gateway: this.gateway,
                    status: error?.response?.status,
                    message: error.message,
                    url: error?.config?.url
                });

                const err = new Error(`INTEGRATION_ERROR`);
                err.key = 'INTEGRATION_ERROR';
                err.status = error?.response?.status ?? 400;
                err.errors = error.response;
                err.response = error.response;
                err.config = error.config;
                err.service = this.serviceName;
                err.gateway = this.gateway;

                return Promise.reject(err);
            }
        );
    }

    // Método utilitário para fazer requisições com retry
    async makeRequest(config, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                return await this.httpClient(config);
            } catch (error) {
                if (i === retries - 1) {
                    throw error;
                }

                // Aguarda antes de tentar novamente (backoff exponencial)
                const delay = Math.pow(2, i) * 1000;
                this.logger.warn(`Retrying request to ${this.serviceName} in ${delay}ms`, {
                    attempt: i + 1,
                    maxRetries: retries
                });

                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    // Método para validar se o serviço está disponível
    async healthCheck() {
        try {
            const response = await this.httpClient.get('/health');
            return {
                service: this.serviceName,
                gateway: this.gateway,
                status: 'healthy',
                responseTime: response.headers['x-response-time'] || 'unknown'
            };
        } catch (error) {
            return {
                service: this.serviceName,
                gateway: this.gateway,
                status: 'unhealthy',
                error: error.message
            };
        }
    }
}

module.exports = BaseIntegration;
