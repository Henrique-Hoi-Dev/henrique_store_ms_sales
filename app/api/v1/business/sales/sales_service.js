const SalesModel = require('./sales_model');
const SalesPayment = require('../../../../providers/sales_payment');
const BaseService = require('../../base/base_service');
const { v4: uuidv4 } = require('uuid');

class SalesService extends BaseService {
    constructor() {
        super();
        this._salesModel = SalesModel;
        this._salesPayment = new SalesPayment();
    }

    async list({ page = 1, limit = 20, status, payment_status, customer_id, source, integration_source, is_active }) {
        const where = {};
        if (status) where.status = status;
        if (payment_status) where.payment_status = payment_status;
        if (customer_id) where.customer_id = customer_id;
        if (source) where.source = source;
        if (integration_source) where.integration_source = integration_source;
        if (typeof is_active !== 'undefined') where.is_active = is_active;

        const offset = (page - 1) * limit;
        const { rows, count } = await this._salesModel.findAndCountAll({
            where,
            offset,
            limit: parseInt(limit, 10),
            order: [['created_at', 'DESC']]
        });

        return {
            data: rows,
            meta: {
                total: count,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            }
        };
    }

    async getById(id) {
        return this._salesModel.findByPk(id);
    }

    async getByOrderNumber(orderNumber) {
        return this._salesModel.findOne({
            where: { order_number: orderNumber }
        });
    }

    async create(data) {
        // Gerar número do pedido único
        const orderNumber = this.generateOrderNumber();

        // Calcular valores
        const calculatedData = this.calculateAmounts(data);

        const saleData = {
            ...data,
            order_number: orderNumber,
            ...calculatedData
        };

        return this._salesModel.create(saleData);
    }

    async update(id, data) {
        const sale = await this._salesModel.findByPk(id);
        if (!sale) return null;

        // Recalcular valores se os itens mudaram
        if (data.items) {
            const calculatedData = this.calculateAmounts(data);
            data = { ...data, ...calculatedData };
        }

        await sale.update(data);
        return sale;
    }

    async updateStatus(id, status, payment_status = null) {
        const sale = await this._salesModel.findByPk(id);
        if (!sale) return null;

        const updateData = { status };
        if (payment_status) updateData.payment_status = payment_status;

        await sale.update(updateData);
        return sale;
    }

    async updatePaymentStatus(id, payment_status, payment_data = {}) {
        const sale = await this._salesModel.findByPk(id);
        if (!sale) return null;

        const updateData = { payment_status };

        if (payment_data.payment_method) updateData.payment_method = payment_data.payment_method;
        if (payment_data.payment_gateway) updateData.payment_gateway = payment_data.payment_gateway;
        if (payment_data.payment_transaction_id)
            updateData.payment_transaction_id = payment_data.payment_transaction_id;

        await sale.update(updateData);
        return sale;
    }

    async softDelete(id) {
        const sale = await this._salesModel.findByPk(id);
        if (!sale) return null;
        await sale.update({ is_active: false });
        return sale;
    }

    async getSalesByCustomer(customerId, { page = 1, limit = 20 } = {}) {
        const offset = (page - 1) * limit;
        const { rows, count } = await this._salesModel.findAndCountAll({
            where: { customer_id: customerId, is_active: true },
            offset,
            limit: parseInt(limit, 10),
            order: [['created_at', 'DESC']]
        });

        return {
            data: rows,
            meta: {
                total: count,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10)
            }
        };
    }

    async getSalesSummary({ startDate, endDate, status, payment_status } = {}) {
        const where = { is_active: true };

        if (startDate && endDate) {
            where.created_at = {
                [require('sequelize').Op.between]: [startDate, endDate]
            };
        }

        if (status) where.status = status;
        if (payment_status) where.payment_status = payment_status;

        const sales = await this._salesModel.findAll({ where });

        const summary = {
            total_sales: sales.length,
            total_amount: 0,
            total_paid: 0,
            total_pending: 0,
            total_cancelled: 0
        };

        sales.forEach((sale) => {
            summary.total_amount += sale.total_amount;

            if (sale.payment_status === 'PAID') {
                summary.total_paid += sale.total_amount;
            } else if (sale.payment_status === 'PENDING') {
                summary.total_pending += sale.total_amount;
            } else if (sale.status === 'CANCELLED') {
                summary.total_cancelled += sale.total_amount;
            }
        });

        return summary;
    }

    generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0');
        return `ORD-${timestamp}-${random}`;
    }

    calculateAmounts(data) {
        const items = data.items || [];
        let subtotal = 0;
        let tax = 0;
        let discount = data.discount_amount || 0;
        let shipping = data.shipping_amount || 0;

        // Calcular subtotal dos itens
        items.forEach((item) => {
            const itemTotal = (item.price || 0) * (item.quantity || 1);
            subtotal += itemTotal;
        });

        // Calcular impostos (exemplo: 10% de ICMS)
        tax = Math.round(subtotal * 0.1);

        // Calcular total
        const total = subtotal + tax + shipping - discount;

        return {
            subtotal_amount: subtotal,
            tax_amount: tax,
            discount_amount: discount,
            shipping_amount: shipping,
            total_amount: total
        };
    }
}

module.exports = SalesService;
