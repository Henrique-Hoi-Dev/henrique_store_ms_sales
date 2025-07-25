const Joi = require('joi');

const list = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        status: Joi.string().valid('PENDING', 'PAID', 'CANCELLED', 'REFUNDED', 'SHIPPED', 'DELIVERED'),
        payment_status: Joi.string().valid('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED'),
        customer_id: Joi.string().uuid(),
        source: Joi.string().valid('WEB', 'MOBILE', 'API', 'PHONE'),
        integration_source: Joi.string(),
        is_active: Joi.boolean()
    })
};

const getById = {
    params: Joi.object({
        id: Joi.string().uuid().required()
    })
};

const getByOrderNumber = {
    params: Joi.object({
        orderNumber: Joi.string().required()
    })
};

const create = {
    body: Joi.object({
        customer_id: Joi.string().uuid().required(),
        customer_name: Joi.string().min(2).max(100).required(),
        customer_email: Joi.string().email().required(),
        customer_phone: Joi.string().optional(),
        customer_document: Joi.string().optional(),
        items: Joi.array()
            .items(
                Joi.object({
                    product_id: Joi.string().uuid().required(),
                    name: Joi.string().required(),
                    sku: Joi.string().optional(),
                    price: Joi.number().integer().min(0).required(),
                    quantity: Joi.number().integer().min(1).default(1),
                    discount: Joi.number().integer().min(0).default(0)
                })
            )
            .min(1)
            .required(),
        shipping_address: Joi.object({
            street: Joi.string().required(),
            number: Joi.string().required(),
            complement: Joi.string().optional(),
            neighborhood: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zip_code: Joi.string().required(),
            country: Joi.string().default('Brasil')
        }).optional(),
        billing_address: Joi.object({
            street: Joi.string().required(),
            number: Joi.string().required(),
            complement: Joi.string().optional(),
            neighborhood: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zip_code: Joi.string().required(),
            country: Joi.string().default('Brasil')
        }).optional(),
        discount_amount: Joi.number().integer().min(0).default(0),
        shipping_amount: Joi.number().integer().min(0).default(0),
        currency: Joi.string().default('BRL'),
        payment_method: Joi.string().optional(),
        source: Joi.string().valid('WEB', 'MOBILE', 'API', 'PHONE').default('WEB'),
        integration_source: Joi.string().optional(),
        external_id: Joi.string().optional(),
        notes: Joi.string().optional(),
        metadata: Joi.object().optional()
    })
};

const update = {
    params: Joi.object({
        id: Joi.string().uuid().required()
    }),
    body: Joi.object({
        customer_name: Joi.string().min(2).max(100).optional(),
        customer_email: Joi.string().email().optional(),
        customer_phone: Joi.string().optional(),
        customer_document: Joi.string().optional(),
        items: Joi.array()
            .items(
                Joi.object({
                    product_id: Joi.string().uuid().required(),
                    name: Joi.string().required(),
                    sku: Joi.string().optional(),
                    price: Joi.number().integer().min(0).required(),
                    quantity: Joi.number().integer().min(1).default(1),
                    discount: Joi.number().integer().min(0).default(0)
                })
            )
            .min(1)
            .optional(),
        shipping_address: Joi.object({
            street: Joi.string().required(),
            number: Joi.string().required(),
            complement: Joi.string().optional(),
            neighborhood: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zip_code: Joi.string().required(),
            country: Joi.string().default('Brasil')
        }).optional(),
        billing_address: Joi.object({
            street: Joi.string().required(),
            number: Joi.string().required(),
            complement: Joi.string().optional(),
            neighborhood: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zip_code: Joi.string().required(),
            country: Joi.string().default('Brasil')
        }).optional(),
        discount_amount: Joi.number().integer().min(0).optional(),
        shipping_amount: Joi.number().integer().min(0).optional(),
        notes: Joi.string().optional(),
        metadata: Joi.object().optional()
    })
};

const updateStatus = {
    params: Joi.object({
        id: Joi.string().uuid().required()
    }),
    body: Joi.object({
        status: Joi.string().valid('PENDING', 'PAID', 'CANCELLED', 'REFUNDED', 'SHIPPED', 'DELIVERED').required(),
        payment_status: Joi.string().valid('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED').optional()
    })
};

const updatePaymentStatus = {
    params: Joi.object({
        id: Joi.string().uuid().required()
    }),
    body: Joi.object({
        payment_status: Joi.string().valid('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED').required(),
        payment_method: Joi.string().optional(),
        payment_gateway: Joi.string().optional(),
        payment_transaction_id: Joi.string().optional()
    })
};

const softDelete = {
    params: Joi.object({
        id: Joi.string().uuid().required()
    })
};

const getSalesByCustomer = {
    params: Joi.object({
        customerId: Joi.string().uuid().required()
    }),
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20)
    })
};

const getSalesSummary = {
    query: Joi.object({
        start_date: Joi.date().iso().optional(),
        end_date: Joi.date().iso().optional(),
        status: Joi.string().valid('PENDING', 'PAID', 'CANCELLED', 'REFUNDED', 'SHIPPED', 'DELIVERED').optional(),
        payment_status: Joi.string().valid('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED').optional()
    })
};

const processPayment = {
    body: Joi.object({
        sale_id: Joi.string().uuid().required(),
        gateway: Joi.string().valid('stripe', 'mercadopago', 'pagseguro').default('stripe'),
        payment_method: Joi.string().valid('CREDIT_CARD', 'PIX', 'BANK_TRANSFER', 'BOLETO').required()
    })
};

const refundPayment = {
    body: Joi.object({
        sale_id: Joi.string().uuid().required(),
        gateway: Joi.string().valid('stripe', 'mercadopago', 'pagseguro').default('stripe'),
        amount: Joi.number().integer().min(1).optional()
    })
};

const getPaymentStatus = {
    query: Joi.object({
        sale_id: Joi.string().uuid().required(),
        gateway: Joi.string().valid('stripe', 'mercadopago', 'pagseguro').default('stripe')
    })
};

const getIntegrationsHealth = {
    // Sem validação específica, apenas verificação de saúde
};

module.exports = {
    list,
    getById,
    getByOrderNumber,
    create,
    update,
    updateStatus,
    updatePaymentStatus,
    softDelete,
    getSalesByCustomer,
    getSalesSummary,
    processPayment,
    refundPayment,
    getPaymentStatus,
    getIntegrationsHealth
};
