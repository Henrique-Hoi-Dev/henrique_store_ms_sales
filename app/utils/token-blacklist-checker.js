const axios = require('axios');
const logger = require('./logger');

/**
 * Verificador de Blacklist de Tokens para Microserviços
 * Comunica com o microserviço de usuário para verificar se um token está na blacklist
 */
class TokenBlacklistChecker {
    constructor() {
        this.userServiceUrl = process.env.CUSTOMER_SERVICE_URL || 'http://users-ms:3001';
        this.userServiceToken = process.env.CUSTOMER_SERVICE_TOKEN;
    }

    /**
     * Verifica se um token está na blacklist através da API do microserviço de usuário
     * @param {string} token - Token JWT a ser verificado
     * @returns {Promise<Object>} Resultado da verificação
     */
    async checkTokenBlacklist(token) {
        try {
            const response = await axios.post(
                `${this.userServiceUrl}/api/v1/user/verify-token-status`,
                { token },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(this.userServiceToken && { Authorization: `Bearer ${this.userServiceToken}` })
                    },
                    timeout: 5000 // 5 segundos de timeout
                }
            );

            return {
                success: true,
                isBlacklisted: response.data.data.isBlacklisted,
                isValidToken: response.data.data.isValidToken,
                tokenId: response.data.data.tokenId,
                tokenExp: response.data.data.tokenExp,
                tokenIat: response.data.data.tokenIat
            };
        } catch (error) {
            logger.error('Erro ao verificar blacklist de token:', error.message);
            
            // Em caso de erro na comunicação, permitir que o token seja usado
            // mas logar o erro para monitoramento
            return {
                success: false,
                isBlacklisted: false, // Por segurança, não bloquear em caso de erro
                isValidToken: null,
                error: error.message
            };
        }
    }

    /**
     * Middleware para verificar blacklist de token
     * @returns {Function} Middleware Express
     */
    checkTokenBlacklistMiddleware() {
        return async (req, res, next) => {
            try {
                const authHeader = req.header('Authorization');
                if (!authHeader) {
                    return next(); // Deixar outros middlewares lidarem com token ausente
                }

                const token = authHeader.replace('Bearer ', '');
                if (!token) {
                    return next(); // Deixar outros middlewares lidarem com formato inválido
                }

                // Verificar se token está na blacklist
                const blacklistResult = await this.checkTokenBlacklist(token);
                
                if (blacklistResult.success && blacklistResult.isBlacklisted) {
                    const error = new Error('TOKEN_BLACKLISTED');
                    error.status = 401;
                    error.key = 'TOKEN_BLACKLISTED';
                    return next(error);
                }

                next();
            } catch (error) {
                logger.error('Erro no middleware de verificação de blacklist:', error);
                next(); // Em caso de erro, permitir que continue
            }
        };
    }
}

// Instância global do verificador
const globalTokenBlacklistChecker = new TokenBlacklistChecker();

module.exports = {
    TokenBlacklistChecker,
    globalTokenBlacklistChecker,
    checkTokenBlacklistMiddleware: () => globalTokenBlacklistChecker.checkTokenBlacklistMiddleware()
}; 