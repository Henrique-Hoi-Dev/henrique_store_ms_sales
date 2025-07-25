const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../../config/database');

const Sales = sequelize.define(
    'Sales',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        order_number: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        customer_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        customer_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customer_email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        customer_phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        customer_document: {
            type: DataTypes.STRING,
            allowNull: true
        },
        total_amount: {
            type: DataTypes.INTEGER, // Em centavos
            allowNull: false
        },
        subtotal_amount: {
            type: DataTypes.INTEGER, // Em centavos
            allowNull: false
        },
        tax_amount: {
            type: DataTypes.INTEGER, // Em centavos
            defaultValue: 0
        },
        discount_amount: {
            type: DataTypes.INTEGER, // Em centavos
            defaultValue: 0
        },
        shipping_amount: {
            type: DataTypes.INTEGER, // Em centavos
            defaultValue: 0
        },
        currency: {
            type: DataTypes.STRING,
            defaultValue: 'BRL'
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED', 'SHIPPED', 'DELIVERED'),
            defaultValue: 'PENDING'
        },
        payment_status: {
            type: DataTypes.ENUM('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'REFUNDED'),
            defaultValue: 'PENDING'
        },
        payment_method: {
            type: DataTypes.STRING,
            allowNull: true
        },
        payment_gateway: {
            type: DataTypes.STRING,
            allowNull: true
        },
        payment_transaction_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        shipping_address: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        billing_address: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        items: {
            type: DataTypes.JSONB,
            allowNull: false,
            comment: 'Array of products with quantity, price, etc.'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        source: {
            type: DataTypes.ENUM('WEB', 'MOBILE', 'API', 'PHONE'),
            defaultValue: 'WEB'
        },
        integration_source: {
            type: DataTypes.STRING,
            allowNull: true
        },
        external_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional data for integrations (tracking, custom fields, etc.)'
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        tableName: 'Sales',
        underscored: true,
        timestamps: true
    }
);

module.exports = Sales; 