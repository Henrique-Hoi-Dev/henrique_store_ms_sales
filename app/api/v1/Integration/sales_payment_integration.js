const BaseIntegration = require('../base/base_integration');
const logger = require('../../../utils/logger');

class SalesPaymentIntegration extends BaseIntegration {
    constructor(gateway = 'stripe') {
        super('payment', gateway);
        this.paymentGateways = ['stripe', 'mercadopago', 'pagseguro'];
    }

    async processPayment(saleData, gateway = null) {
        const targetGateway = gateway || this.gateway;

        try {
            if (!this.paymentGateways.includes(targetGateway)) {
                throw new Error(`Payment gateway ${targetGateway} not supported`);
            }

            const paymentData = this.formatPaymentData(saleData, targetGateway);

            logger.info(`Processing payment for sale ${saleData.order_number} via ${targetGateway}`);

            // Criar uma nova instância com o gateway específico
            const paymentIntegration = new SalesPaymentIntegration(targetGateway);

            // Simular processamento de pagamento
            const response = await paymentIntegration.httpClient.post('/payments', paymentData);

            return {
                success: true,
                transaction_id: response.data.id || `txn_${Date.now()}`,
                status: 'authorized',
                gateway: targetGateway,
                amount: saleData.total_amount,
                currency: saleData.currency || 'BRL'
            };
        } catch (error) {
            logger.error(`Payment processing failed for sale ${saleData.order_number}: ${error.message}`);
            throw new Error(`PAYMENT_PROCESSING_FAILED: ${error.message}`);
        }
    }

    async refundPayment(transactionId, amount, gateway = null) {
        const targetGateway = gateway || this.gateway;

        try {
            if (!this.paymentGateways.includes(targetGateway)) {
                throw new Error(`Payment gateway ${targetGateway} not supported`);
            }

            logger.info(`Processing refund for transaction ${transactionId} via ${targetGateway}`);

            // Criar uma nova instância com o gateway específico
            const paymentIntegration = new SalesPaymentIntegration(targetGateway);

            // Simular reembolso
            const refundData = {
                amount: amount,
                reason: 'requested_by_customer'
            };

            const response = await paymentIntegration.httpClient.post(`/refunds`, refundData);

            return {
                success: true,
                refund_id: response.data.id || `ref_${Date.now()}`,
                status: 'succeeded',
                amount: amount,
                gateway: targetGateway
            };
        } catch (error) {
            logger.error(`Refund processing failed for transaction ${transactionId}: ${error.message}`);
            throw new Error(`REFUND_PROCESSING_FAILED: ${error.message}`);
        }
    }

    async getPaymentStatus(transactionId, gateway = null) {
        const targetGateway = gateway || this.gateway;

        try {
            if (!this.paymentGateways.includes(targetGateway)) {
                throw new Error(`Payment gateway ${targetGateway} not supported`);
            }

            logger.info(`Getting payment status for transaction ${transactionId} via ${targetGateway}`);

            // Criar uma nova instância com o gateway específico
            const paymentIntegration = new SalesPaymentIntegration(targetGateway);

            // Simular consulta de status
            const response = await paymentIntegration.httpClient.get(`/payments/${transactionId}`);

            return {
                transaction_id: transactionId,
                status: response.data.status || 'pending',
                amount: response.data.amount,
                currency: response.data.currency || 'BRL',
                gateway: targetGateway
            };
        } catch (error) {
            logger.error(`Failed to get payment status for transaction ${transactionId}: ${error.message}`);
            throw new Error(`PAYMENT_STATUS_CHECK_FAILED: ${error.message}`);
        }
    }

    formatPaymentData(saleData, gateway) {
        const baseData = {
            amount: saleData.total_amount,
            currency: (saleData.currency || 'BRL').toLowerCase(),
            description: `Order ${saleData.order_number}`,
            metadata: {
                order_number: saleData.order_number,
                customer_id: saleData.customer_id,
                customer_email: saleData.customer_email
            }
        };

        switch (gateway) {
            case 'stripe':
                return {
                    ...baseData,
                    payment_method_types: ['card'],
                    confirm: true,
                    return_url: `${process.env.FRONTEND_URL}/payment/return`
                };

            case 'mercadopago':
                return {
                    transaction_amount: baseData.amount / 100, // MercadoPago usa reais, não centavos
                    description: baseData.description,
                    payment_method_id: 'pix',
                    payer: {
                        email: saleData.customer_email,
                        first_name: saleData.customer_name.split(' ')[0],
                        last_name: saleData.customer_name.split(' ').slice(1).join(' ')
                    }
                };

            case 'pagseguro':
                return {
                    payment: {
                        mode: 'default',
                        method: 'creditCard',
                        amount: baseData.amount / 100,
                        currency: baseData.currency.toUpperCase(),
                        description: baseData.description,
                        notificationURL: `${process.env.API_URL}/webhooks/pagseguro`
                    }
                };

            default:
                return baseData;
        }
    }

    async validatePaymentMethod(paymentMethod, amount) {
        const supportedMethods = {
            CREDIT_CARD: ['stripe', 'pagseguro'],
            PIX: ['mercadopago'],
            BANK_TRANSFER: ['pagseguro'],
            BOLETO: ['mercadopago', 'pagseguro']
        };

        const supportedGateways = supportedMethods[paymentMethod] || [];

        if (supportedGateways.length === 0) {
            throw new Error(`Payment method ${paymentMethod} not supported`);
        }

        // Validações específicas por método
        switch (paymentMethod) {
            case 'CREDIT_CARD':
                if (amount < 100) {
                    // R$ 1,00 mínimo
                    throw new Error('Minimum amount for credit card payment is R$ 1,00');
                }
                break;

            case 'PIX':
                if (amount > 1000000) {
                    // R$ 10.000,00 máximo
                    throw new Error('Maximum amount for PIX payment is R$ 10.000,00');
                }
                break;
        }

        return {
            valid: true,
            supported_gateways: supportedGateways,
            payment_method: paymentMethod
        };
    }

    // Método para verificar a saúde de todos os gateways de pagamento
    async checkAllGatewaysHealth() {
        const healthResults = [];

        for (const gateway of this.paymentGateways) {
            try {
                const paymentIntegration = new SalesPaymentIntegration(gateway);
                const health = await paymentIntegration.healthCheck();
                healthResults.push(health);
            } catch (error) {
                healthResults.push({
                    service: 'payment',
                    gateway: gateway,
                    status: 'unhealthy',
                    error: error.message
                });
            }
        }

        return healthResults;
    }

    // Método para obter estatísticas de pagamento por gateway
    async getPaymentStatistics(gateway = null, period = '30d') {
        const targetGateway = gateway || this.gateway;

        try {
            const paymentIntegration = new SalesPaymentIntegration(targetGateway);

            // Simular consulta de estatísticas
            const response = await paymentIntegration.httpClient.get(`/statistics?period=${period}`);

            return {
                gateway: targetGateway,
                period: period,
                total_transactions: response.data.total_transactions || 0,
                total_amount: response.data.total_amount || 0,
                success_rate: response.data.success_rate || 0,
                average_transaction_value: response.data.average_transaction_value || 0
            };
        } catch (error) {
            logger.error(`Failed to get payment statistics for gateway ${targetGateway}: ${error.message}`);
            throw new Error(`PAYMENT_STATISTICS_FAILED: ${error.message}`);
        }
    }
}

module.exports = SalesPaymentIntegration;
