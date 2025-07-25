'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Sales', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            order_number: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            customer_id: {
                type: Sequelize.UUID,
                allowNull: false
            },
            customer_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            customer_email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            customer_phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            customer_document: {
                type: Sequelize.STRING,
                allowNull: true
            },
            total_amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Amount in cents'
            },
            subtotal_amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Amount in cents'
            },
            tax_amount: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Amount in cents'
            },
            discount_amount: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Amount in cents'
            },
            shipping_amount: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                comment: 'Amount in cents'
            },
            currency: {
                type: Sequelize.STRING,
                defaultValue: 'BRL'
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED', 'SHIPPED', 'DELIVERED'),
                defaultValue: 'PENDING'
            },
            payment_status: {
                type: Sequelize.ENUM('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED'),
                defaultValue: 'PENDING'
            },
            payment_method: {
                type: Sequelize.STRING,
                allowNull: true
            },
            payment_gateway: {
                type: Sequelize.STRING,
                allowNull: true
            },
            payment_transaction_id: {
                type: Sequelize.STRING,
                allowNull: true
            },
            shipping_address: {
                type: Sequelize.JSONB,
                allowNull: true
            },
            billing_address: {
                type: Sequelize.JSONB,
                allowNull: true
            },
            items: {
                type: Sequelize.JSONB,
                allowNull: false,
                comment: 'Array of products with quantity, price, etc.'
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            source: {
                type: Sequelize.ENUM('WEB', 'MOBILE', 'API', 'PHONE'),
                defaultValue: 'WEB'
            },
            integration_source: {
                type: Sequelize.STRING,
                allowNull: true
            },
            external_id: {
                type: Sequelize.STRING,
                allowNull: true
            },
            metadata: {
                type: Sequelize.JSONB,
                allowNull: true,
                comment: 'Additional data for integrations (tracking, custom fields, etc.)'
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Criar índices para melhor performance
        await queryInterface.addIndex('Sales', ['customer_id']);
        await queryInterface.addIndex('Sales', ['order_number']);
        await queryInterface.addIndex('Sales', ['status']);
        await queryInterface.addIndex('Sales', ['payment_status']);
        await queryInterface.addIndex('Sales', ['created_at']);
        await queryInterface.addIndex('Sales', ['integration_source']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Sales');
    }
};
