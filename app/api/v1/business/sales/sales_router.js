const express = require('express');
const router = express.Router();
const SalesController = require('./sales_controller');
const validation = require('./sales_validation');
const validator = require('../../../../utils/validator');
const { ensureAuthorization, verifyToken } = require('../../../../main/middleware');

const salesController = new SalesController();

// Rotas principais de vendas
router.get('/', ensureAuthorization, verifyToken, validator(validation.list), salesController.list);
router.get(
    '/summary',
    ensureAuthorization,
    verifyToken,
    validator(validation.getSalesSummary),
    salesController.getSalesSummary
);
router.get('/:id', ensureAuthorization, verifyToken, validator(validation.getById), salesController.getById);
router.get(
    '/order/:orderNumber',
    ensureAuthorization,
    verifyToken,
    validator(validation.getByOrderNumber),
    salesController.getByOrderNumber
);
router.post('/', ensureAuthorization, verifyToken, validator(validation.create), salesController.create);
router.put('/:id', ensureAuthorization, verifyToken, validator(validation.update), salesController.update);
router.delete('/:id', ensureAuthorization, verifyToken, validator(validation.softDelete), salesController.softDelete);

// Rotas de status e pagamento
router.patch(
    '/:id/status',
    ensureAuthorization,
    verifyToken,
    validator(validation.updateStatus),
    salesController.updateStatus
);
router.patch(
    '/:id/payment',
    ensureAuthorization,
    verifyToken,
    validator(validation.updatePaymentStatus),
    salesController.updatePaymentStatus
);

// Rotas de consulta por cliente
router.get(
    '/customer/:customerId',
    ensureAuthorization,
    verifyToken,
    validator(validation.getSalesByCustomer),
    salesController.getSalesByCustomer
);

module.exports = router;
