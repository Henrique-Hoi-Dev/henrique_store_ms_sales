const SalesService = require('./sales_service');
const BaseController = require('../../base/base_controller');
const { SalesPaymentIntegration } = require('../../Integration');
const HttpStatus = require('http-status');

class SalesController extends BaseController {
    constructor() {
        super();
        this._salesService = new SalesService();
    }

    async list(req, res, next) {
        try {
            const { page, limit, status, payment_status, customer_id, source, integration_source, is_active } =
                req.query;

            const result = await this._salesService.list({
                page,
                limit,
                status,
                payment_status,
                customer_id,
                source,
                integration_source,
                is_active
            });

            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(result));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getById(req, res, next) {
        try {
            const sale = await this._salesService.getById(req.params.id);
            if (!sale) return next(this.notFound('SALE_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(sale));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getByOrderNumber(req, res, next) {
        try {
            const sale = await this._salesService.getByOrderNumber(req.params.orderNumber);
            if (!sale) return next(this.notFound('SALE_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(sale));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async create(req, res, next) {
        try {
            const sale = await this._salesService.create(req.body);
            res.status(HttpStatus.CREATED).json(this.parseKeysToCamelcase(sale));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async update(req, res, next) {
        try {
            const sale = await this._salesService.update(req.params.id, req.body);
            if (!sale) return next(this.notFound('SALE_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(sale));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async updateStatus(req, res, next) {
        try {
            const { status, payment_status } = req.body;
            const sale = await this._salesService.updateStatus(req.params.id, status, payment_status);
            if (!sale) return next(this.notFound('SALE_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(sale));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async updatePaymentStatus(req, res, next) {
        try {
            const { payment_status, payment_method, payment_gateway, payment_transaction_id } = req.body;
            const paymentData = { payment_method, payment_gateway, payment_transaction_id };

            const sale = await this._salesService.updatePaymentStatus(req.params.id, payment_status, paymentData);
            if (!sale) return next(this.notFound('SALE_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(sale));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async softDelete(req, res, next) {
        try {
            const sale = await this._salesService.softDelete(req.params.id);
            if (!sale) return next(this.notFound('SALE_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(sale));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getSalesByCustomer(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await this._salesService.getSalesByCustomer(req.params.customerId, { page, limit });
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(result));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getSalesSummary(req, res, next) {
        try {
            const { start_date, end_date, status, payment_status } = req.query;
            const summary = await this._salesService.getSalesSummary({
                startDate: start_date,
                endDate: end_date,
                status,
                payment_status
            });
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(summary));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async processPayment(req, res, next) {
        try {
            const { sale_id, gateway = 'stripe', payment_method } = req.body;

            // Buscar a venda
            const sale = await this._salesService.getById(sale_id);
            if (!sale) return next(this.notFound('SALE_NOT_FOUND'));

            // Validar se a venda pode ser paga
            if (sale.payment_status === 'PAID') {
                return next(this.badRequest('PAYMENT_ALREADY_PROCESSED'));
            }

            // Criar integração de pagamento
            const paymentIntegration = new SalesPaymentIntegration(gateway);

            // Validar método de pagamento
            const validation = await paymentIntegration.validatePaymentMethod(payment_method, sale.total_amount);
            if (!validation.valid) {
                return next(this.badRequest('INVALID_PAYMENT_METHOD'));
            }

            // Processar pagamento
            const paymentResult = await paymentIntegration.processPayment(
                {
                    order_number: sale.order_number,
                    customer_id: sale.customer_id,
                    customer_name: sale.customer_name,
                    customer_email: sale.customer_email,
                    total_amount: sale.total_amount,
                    currency: 'BRL'
                },
                gateway
            );

            // Atualizar status da venda
            const updatedSale = await this._salesService.updatePaymentStatus(sale_id, 'PAID', {
                payment_method: payment_method,
                payment_gateway: gateway,
                payment_transaction_id: paymentResult.transaction_id
            });

            res.status(HttpStatus.OK).json({
                success: true,
                sale: this.parseKeysToCamelcase(updatedSale),
                payment: paymentResult
            });
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async refundPayment(req, res, next) {
        try {
            const { sale_id, gateway = 'stripe', amount } = req.body;

            // Buscar a venda
            const sale = await this._salesService.getById(sale_id);
            if (!sale) return next(this.notFound('SALE_NOT_FOUND'));

            // Validar se a venda pode ser reembolsada
            if (sale.payment_status !== 'PAID') {
                return next(this.badRequest('PAYMENT_NOT_PROCESSED'));
            }

            // Criar integração de pagamento
            const paymentIntegration = new SalesPaymentIntegration(gateway);

            // Processar reembolso
            const refundResult = await paymentIntegration.refundPayment(
                sale.payment_transaction_id,
                amount || sale.total_amount,
                gateway
            );

            // Atualizar status da venda
            const updatedSale = await this._salesService.updatePaymentStatus(sale_id, 'REFUNDED');

            res.status(HttpStatus.OK).json({
                success: true,
                sale: this.parseKeysToCamelcase(updatedSale),
                refund: refundResult
            });
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getPaymentStatus(req, res, next) {
        try {
            const { sale_id, gateway = 'stripe' } = req.query;

            // Buscar a venda
            const sale = await this._salesService.getById(sale_id);
            if (!sale) return next(this.notFound('SALE_NOT_FOUND'));

            if (!sale.payment_transaction_id) {
                return next(this.badRequest('NO_PAYMENT_TRANSACTION'));
            }

            // Criar integração de pagamento
            const paymentIntegration = new SalesPaymentIntegration(gateway);

            // Consultar status do pagamento
            const statusResult = await paymentIntegration.getPaymentStatus(sale.payment_transaction_id, gateway);

            res.status(HttpStatus.OK).json({
                sale_id: sale_id,
                payment_status: statusResult
            });
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getIntegrationsHealth(req, res, next) {
        try {
            const { checkAllIntegrationsHealth } = require('../../Integration');
            const healthResults = await checkAllIntegrationsHealth();

            res.status(HttpStatus.OK).json({
                timestamp: new Date().toISOString(),
                services: healthResults
            });
        } catch (err) {
            next(this.handleError(err));
        }
    }
}

module.exports = SalesController;
