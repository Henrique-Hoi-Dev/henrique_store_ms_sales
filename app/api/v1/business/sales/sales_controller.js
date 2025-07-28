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
            const data = await this._salesService.list(req.query);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getById(req, res, next) {
        try {
            const data = await this._salesService.getById(req.params.id);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getByOrderNumber(req, res, next) {
        try {
            const data = await this._salesService.getByOrderNumber(req.params);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async create(req, res, next) {
        try {
            const data = await this._salesService.create(req.body);
            res.status(HttpStatus.status.CREATED).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async update(req, res, next) {
        try {
            const data = await this._salesService.update(req.params.id, req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async updateStatus(req, res, next) {
        try {
            const data = await this._salesService.updateStatus(req.params.id, req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async updatePaymentStatus(req, res, next) {
        try {
            const data = await this._salesService.updatePaymentStatus(req.params, req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async softDelete(req, res, next) {
        try {
            const data = await this._salesService.softDelete(req.params);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getSalesByCustomer(req, res, next) {
        try {
            const data = await this._salesService.getSalesByCustomer(req.params, req.query);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getSalesSummary(req, res, next) {
        try {
            const data = await this._salesService.getSalesSummary(req.query);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async processPayment(req, res, next) {
        try {
            const data = await this._salesService.processPayment(req.params, req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async refundPayment(req, res, next) {
        try {
            const data = await this._salesService.refundPayment(req.params, req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getPaymentStatus(req, res, next) {
        try {
            const data = await this._salesService.getPaymentStatus(req.params, req.query);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getIntegrationsHealth(req, res, next) {
        try {
            const data = await this._salesService.getIntegrationsHealth();
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }
}

module.exports = SalesController;
