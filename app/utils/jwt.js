const jwt = require('jsonwebtoken');

const generateToken = (payload = {}) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('MISSING_JWT_SECRET');
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: process.env.JWT_ISSUER || 'henrique-store-api',
        audience: process.env.JWT_AUDIENCE || 'henrique-store-users'
    });
    return token;
};

const validVerifyToken = (token = '') => {
    if (!token) {
        throw new Error('TOKEN_REQUIRED');
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('MISSING_JWT_SECRET');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: process.env.JWT_ISSUER || 'henrique-store-api',
            audience: process.env.JWT_AUDIENCE || 'henrique-store-users'
        });

        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('TOKEN_EXPIRED');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('INVALID_TOKEN_SIGNATURE');
        } else if (error instanceof jwt.NotBeforeError) {
            throw new Error('TOKEN_NOT_ACTIVE');
        } else {
            throw new Error('INVALID_TOKEN');
        }
    }
};

const decodeToken = (token = '') => {
    if (!token) {
        return null;
    }

    try {
        return jwt.decode(token);
    } catch (error) {
        return null;
    }
};

const isTokenExpired = (token = '') => {
    try {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) {
            return true;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

module.exports = {
    generateToken,
    validVerifyToken,
    decodeToken,
    isTokenExpired
};
