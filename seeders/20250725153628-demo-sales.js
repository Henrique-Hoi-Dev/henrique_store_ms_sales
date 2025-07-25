'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const demoSales = [
            {
                id: '550e8400-e29b-41d4-a716-446655440001',
                order_number: 'ORD-1704067200000-001',
                customer_id: '550e8400-e29b-41d4-a716-446655440010',
                customer_name: 'João Silva',
                customer_email: 'joao.silva@email.com',
                customer_phone: '(11) 99999-9999',
                customer_document: '123.456.789-00',
                total_amount: 15990, // R$ 159,90
                subtotal_amount: 14990, // R$ 149,90
                tax_amount: 1499, // R$ 14,99 (10%)
                discount_amount: 0,
                shipping_amount: 1000, // R$ 10,00
                currency: 'BRL',
                status: 'PAID',
                payment_status: 'PAID',
                payment_method: 'CREDIT_CARD',
                payment_gateway: 'stripe',
                payment_transaction_id: 'txn_123456789',
                shipping_address: {
                    street: 'Rua das Flores',
                    number: '123',
                    complement: 'Apto 45',
                    neighborhood: 'Centro',
                    city: 'São Paulo',
                    state: 'SP',
                    zip_code: '01234-567',
                    country: 'Brasil'
                },
                billing_address: {
                    street: 'Rua das Flores',
                    number: '123',
                    complement: 'Apto 45',
                    neighborhood: 'Centro',
                    city: 'São Paulo',
                    state: 'SP',
                    zip_code: '01234-567',
                    country: 'Brasil'
                },
                items: [
                    {
                        product_id: '550e8400-e29b-41d4-a716-446655440100',
                        name: 'Smartphone Galaxy S21',
                        sku: 'GAL-S21-128GB',
                        price: 14990, // R$ 149,90
                        quantity: 1,
                        discount: 0
                    }
                ],
                notes: 'Entrega preferencialmente no período da tarde',
                source: 'WEB',
                integration_source: 'ecommerce',
                external_id: 'ext_001',
                metadata: {
                    tracking_code: 'BR123456789BR',
                    shipping_company: 'Correios',
                    estimated_delivery: '2024-01-05'
                },
                is_active: true,
                created_at: new Date('2024-01-01T10:00:00Z'),
                updated_at: new Date('2024-01-01T10:00:00Z')
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440002',
                order_number: 'ORD-1704153600000-002',
                customer_id: '550e8400-e29b-41d4-a716-446655440011',
                customer_name: 'Maria Santos',
                customer_email: 'maria.santos@email.com',
                customer_phone: '(11) 88888-8888',
                customer_document: '987.654.321-00',
                total_amount: 8990, // R$ 89,90
                subtotal_amount: 7990, // R$ 79,90
                tax_amount: 799, // R$ 7,99 (10%)
                discount_amount: 500, // R$ 5,00
                shipping_amount: 700, // R$ 7,00
                currency: 'BRL',
                status: 'PENDING',
                payment_status: 'PENDING',
                payment_method: 'PIX',
                payment_gateway: 'mercadopago',
                payment_transaction_id: null,
                shipping_address: {
                    street: 'Avenida Paulista',
                    number: '1000',
                    complement: 'Sala 200',
                    neighborhood: 'Bela Vista',
                    city: 'São Paulo',
                    state: 'SP',
                    zip_code: '01310-100',
                    country: 'Brasil'
                },
                billing_address: {
                    street: 'Avenida Paulista',
                    number: '1000',
                    complement: 'Sala 200',
                    neighborhood: 'Bela Vista',
                    city: 'São Paulo',
                    state: 'SP',
                    zip_code: '01310-100',
                    country: 'Brasil'
                },
                items: [
                    {
                        product_id: '550e8400-e29b-41d4-a716-446655440101',
                        name: 'Fone de Ouvido Bluetooth',
                        sku: 'FONE-BT-001',
                        price: 3995, // R$ 39,95
                        quantity: 2,
                        discount: 500
                    }
                ],
                notes: 'Presente para aniversário',
                source: 'MOBILE',
                integration_source: 'app_mobile',
                external_id: 'ext_002',
                metadata: {
                    gift_wrapping: true,
                    gift_message: 'Feliz aniversário!'
                },
                is_active: true,
                created_at: new Date('2024-01-02T15:30:00Z'),
                updated_at: new Date('2024-01-02T15:30:00Z')
            },
            {
                id: '550e8400-e29b-41d4-a716-446655440003',
                order_number: 'ORD-1704240000000-003',
                customer_id: '550e8400-e29b-41d4-a716-446655440012',
                customer_name: 'Pedro Oliveira',
                customer_email: 'pedro.oliveira@email.com',
                customer_phone: '(11) 77777-7777',
                customer_document: '456.789.123-00',
                total_amount: 29990, // R$ 299,90
                subtotal_amount: 29990, // R$ 299,90
                tax_amount: 2999, // R$ 29,99 (10%)
                discount_amount: 0,
                shipping_amount: 0, // Frete grátis
                currency: 'BRL',
                status: 'SHIPPED',
                payment_status: 'PAID',
                payment_method: 'BANK_TRANSFER',
                payment_gateway: 'pagseguro',
                payment_transaction_id: 'txn_987654321',
                shipping_address: {
                    street: 'Rua Augusta',
                    number: '500',
                    complement: 'Loja 10',
                    neighborhood: 'Consolação',
                    city: 'São Paulo',
                    state: 'SP',
                    zip_code: '01212-000',
                    country: 'Brasil'
                },
                billing_address: {
                    street: 'Rua Augusta',
                    number: '500',
                    complement: 'Loja 10',
                    neighborhood: 'Consolação',
                    city: 'São Paulo',
                    state: 'SP',
                    zip_code: '01212-000',
                    country: 'Brasil'
                },
                items: [
                    {
                        product_id: '550e8400-e29b-41d4-a716-446655440102',
                        name: 'Notebook Dell Inspiron',
                        sku: 'NOTE-DELL-001',
                        price: 29990, // R$ 299,90
                        quantity: 1,
                        discount: 0
                    }
                ],
                notes: 'Para uso profissional',
                source: 'API',
                integration_source: 'erp_system',
                external_id: 'ext_003',
                metadata: {
                    tracking_code: 'BR987654321BR',
                    shipping_company: 'FedEx',
                    estimated_delivery: '2024-01-08',
                    business_purchase: true
                },
                is_active: true,
                created_at: new Date('2024-01-03T09:15:00Z'),
                updated_at: new Date('2024-01-03T09:15:00Z')
            }
        ];

        await queryInterface.bulkInsert('Sales', demoSales, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Sales', null, {});
    }
};
