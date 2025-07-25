const SalesService = require('./sales_service');
const BaseController = require('../../base/base_controller');
const HttpStatus = require('http-status');

class SalesController extends BaseController {
    constructor() {
        super();
        this._salesService = new SalesService();
    }

    async list(req, res, next) {
        try {
            const { 
                page, 
                limit, 
                status, 
                payment_status, 
                customer_id, 
                source, 
                integration_source, 
                is_active 
            } = req.query;
            
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
}

module.exports = SalesController; 