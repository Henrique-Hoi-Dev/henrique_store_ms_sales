// Arquivo de índice para exportar todas as integrações
const SalesPaymentIntegration = require('./sales_payment_integration');

// Exportar integrações individuais
module.exports = {
    SalesPaymentIntegration
};

// Exportar todas as integrações como um objeto
module.exports.integrations = {
    payment: SalesPaymentIntegration
};

// Função utilitária para criar instâncias de integração
module.exports.createIntegration = (type, gateway = null) => {
    switch (type) {
        case 'payment':
            return new SalesPaymentIntegration(gateway);
        default:
            throw new Error(`Integration type '${type}' not supported`);
    }
};

// Função para verificar a saúde de todas as integrações
module.exports.checkAllIntegrationsHealth = async () => {
    const healthResults = [];

    try {
        // Verificar integração de pagamento
        const paymentIntegration = new SalesPaymentIntegration();
        const paymentHealth = await paymentIntegration.checkAllGatewaysHealth();
        healthResults.push(...paymentHealth);
    } catch (error) {
        healthResults.push({
            service: 'payment',
            status: 'unhealthy',
            error: error.message
        });
    }

    return healthResults;
};
