const ev = require('express-validation');
const _ = require('lodash');
const ValidationsErrorHandler = require('./validations_error_handler');
const validationsErrorHandler = new ValidationsErrorHandler();
const keys = require('../../app/utils/error_mapping');
const { validVerifyToken } = require('../../app/utils/jwt');
const jwt = require('jsonwebtoken');

const logger = require('../utils/logger');

function logError(err, req, res, next) {
    try {
        if (err) {
            logger.error('logError');
            logger.error(err);
            logger.error(JSON.stringify(err, null, 2));
            return next(err);
        } else {
            return next();
        }
    } catch (error) {
        logger.error('logError catch');
        logger.error(error);

        if (err) {
            return next(err);
        } else {
            return next();
        }
    }
}

function handleError(err, req, res, next) {
    if (err) {
        if (err.response) res.status(err.response.status).json(err.response.data);
        err.key = err.key ? err.key : err.message;
        err.errorCode = keys[err.key];
        err.message = res.__(err.message);

        if (err instanceof ev.ValidationError || err.error === 'Unprocessable Entity') {
            err = validationsErrorHandler.errorResponse(err);
        } else if (err instanceof Error) {
            err = _.pick(err, [
                'message',
                'status',
                'key',
                'errorCode',
                'local',
                'field',
                'reasons',
                'registered',
                'rejected'
            ]);
        }

        const status = err.status || 422;
        delete err.status;
        res.status(status).json(err);
    } else {
        next();
    }
}

function throw404(req, res, next) {
    let err = new Error();
    err.status = 404;
    err.message = 'API_ENDPOINT_NOT_FOUND';
    next(err);
}

async function verifyToken(req, res, next) {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            const error = new Error('TOKEN_REQUIRED');
            error.status = 401;
            error.key = 'TOKEN_REQUIRED';
            return next(error);
        }

        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            const error = new Error('INVALID_TOKEN_FORMAT');
            error.status = 401;
            error.key = 'INVALID_TOKEN_FORMAT';
            return next(error);
        }

        try {
            const decodedToken = validVerifyToken(token);
            req.locals = { ...req.locals, user: decodedToken };
            next();
        } catch (jwtError) {
            logger.error('JWT Verification Error:', jwtError);

            let errorMessage = 'INVALID_TOKEN';
            let errorKey = 'INVALID_TOKEN';

            if (jwtError instanceof jwt.TokenExpiredError) {
                errorMessage = 'TOKEN_EXPIRED';
                errorKey = 'TOKEN_EXPIRED';
            } else if (jwtError instanceof jwt.JsonWebTokenError) {
                errorMessage = 'INVALID_TOKEN_SIGNATURE';
                errorKey = 'INVALID_TOKEN_SIGNATURE';
            } else if (jwtError instanceof jwt.NotBeforeError) {
                errorMessage = 'TOKEN_NOT_ACTIVE';
                errorKey = 'TOKEN_NOT_ACTIVE';
            }

            const error = new Error(errorMessage);
            error.status = 401;
            error.key = errorKey;
            next(error);
        }
    } catch (err) {
        logger.error('Token verification error:', err);
        const error = new Error('INVALID_TOKEN');
        error.status = 401;
        error.key = 'INVALID_TOKEN';
        next(error);
    }
}

async function ensureAuthorization(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        const err = new Error('TOKEN_REQUIRED');
        err.status = 401;
        err.key = 'TOKEN_REQUIRED';
        return next(err);
    }

    if (!authHeader.startsWith('Bearer ')) {
        const err = new Error('INVALID_TOKEN_FORMAT');
        err.status = 401;
        err.key = 'INVALID_TOKEN_FORMAT';
        return next(err);
    }

    next();
}

function errorHandler(err, req, res, next) {
    console.error(err);

    // Handle specific JWT errors
    if (err.key === 'TOKEN_EXPIRED') {
        return res.status(401).json({
            error: {
                message: 'Token expirado. Faça login novamente.',
                status: 401,
                key: 'TOKEN_EXPIRED',
                errorCode: keys['TOKEN_EXPIRED'] || 401
            }
        });
    }

    if (err.key === 'TOKEN_REQUIRED') {
        return res.status(401).json({
            error: {
                message: 'Token de autenticação é obrigatório.',
                status: 401,
                key: 'TOKEN_REQUIRED',
                errorCode: keys['TOKEN_REQUIRED'] || 401
            }
        });
    }

    if (err.key === 'INVALID_TOKEN_FORMAT') {
        return res.status(401).json({
            error: {
                message: 'Formato de token inválido. Use: Bearer <token>',
                status: 401,
                key: 'INVALID_TOKEN_FORMAT',
                errorCode: keys['INVALID_TOKEN_FORMAT'] || 401
            }
        });
    }

    if (err.key === 'INVALID_TOKEN_SIGNATURE') {
        return res.status(401).json({
            error: {
                message: 'Assinatura do token inválida.',
                status: 401,
                key: 'INVALID_TOKEN_SIGNATURE',
                errorCode: keys['INVALID_TOKEN_SIGNATURE'] || 401
            }
        });
    }

    if (err.key === 'TOKEN_NOT_ACTIVE') {
        return res.status(401).json({
            error: {
                message: 'Token ainda não está ativo.',
                status: 401,
                key: 'TOKEN_NOT_ACTIVE',
                errorCode: keys['TOKEN_NOT_ACTIVE'] || 401
            }
        });
    }

    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Erro interno do servidor',
            status: err.status || 500,
            key: err.key || 'INTERNAL_SERVER_ERROR',
            errorCode: keys[err.key] || 500
        }
    });
}

module.exports = {
    errorHandler,
    logError,
    handleError,
    throw404,
    verifyToken,
    ensureAuthorization
};
