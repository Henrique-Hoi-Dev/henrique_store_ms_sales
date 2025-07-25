const salesRouter = require('../api/v1/business/sales/sales_router');

const addRouters = (router) => {
    router.route('/health').get((req, res) => {
        res.setHeader('csrf-token', req.csrfToken());
        return res.status(200).send();
    });

    router.use('/sales', salesRouter);

    return router;
};

module.exports = addRouters;
