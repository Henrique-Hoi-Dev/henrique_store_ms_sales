# Documentação de Integrações - Henrique Store Sales API

## Visão Geral

Este documento descreve as integrações externas implementadas no microserviço de vendas da Henrique Store. O sistema
utiliza uma arquitetura modular de integrações centralizada no `base_integration.js` e organizada na pasta
`Integration`.

## Estrutura de Integrações

### Pasta Integration

```
app/api/v1/Integration/
├── index.js                           # Exportações e utilitários
├── sales_payment_integration.js       # Integração com gateways de pagamento
└── [outras integrações futuras]
```

### Base Integration

O arquivo `app/api/v1/base/base_integration.js` centraliza:

- Configurações de todos os serviços externos
- Cliente HTTP com interceptors para logging
- Tratamento de erros padronizado
- Sistema de retry com backoff exponencial
- Health checks para monitoramento

## Serviços Integrados

### 1. Payment Gateways

#### Stripe

- **URL**: `https://api.stripe.com/v1`
- **Autenticação**: Bearer Token
- **Métodos**: Cartão de crédito, PIX
- **Configuração**:
    ```javascript
    stripe: {
        baseURL: process.env.STRIPE_API_URL,
        headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    ```

#### MercadoPago

- **URL**: `https://api.mercadopago.com`
- **Autenticação**: Bearer Token
- **Métodos**: PIX, Boleto, Cartão de crédito
- **Configuração**:
    ```javascript
    mercadopago: {
        baseURL: process.env.MERCADOPAGO_API_URL,
        headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    }
    ```

#### PagSeguro

- **URL**: `https://ws.pagseguro.uol.com.br`
- **Autenticação**: Email + Token
- **Métodos**: Cartão de crédito, Boleto, Transferência bancária
- **Configuração**:
    ```javascript
    pagseguro: {
        baseURL: process.env.PAGSEGURO_API_URL,
        headers: {
            'Content-Type': 'application/xml'
        }
    }
    ```

### 2. Microserviços

#### Inventory Service

- **URL**: `http://localhost:3001`
- **Propósito**: Gerenciamento de estoque e produtos
- **Endpoints**: `/products`, `/inventory`, `/categories`

#### Customer Service

- **URL**: `http://localhost:3002`
- **Propósito**: Gerenciamento de clientes e perfis
- **Endpoints**: `/customers`, `/profiles`, `/addresses`

#### Notification Service

- **URL**: `http://localhost:3003`
- **Propósito**: Envio de notificações e emails
- **Endpoints**: `/notifications`, `/emails`, `/sms`

### 3. Shipping Services

#### Correios

- **URL**: `https://viacep.com.br/ws`
- **Propósito**: Cálculo de frete e CEP
- **Endpoints**: `/cep/{cep}/json`

#### FedEx

- **URL**: `https://apis-sandbox.fedex.com`
- **Propósito**: Frete internacional
- **Autenticação**: Bearer Token

### 4. Analytics Service

- **URL**: `http://localhost:3004`
- **Propósito**: Métricas e relatórios
- **Endpoints**: `/analytics`, `/reports`, `/metrics`

## Uso das Integrações

### Instanciando uma Integração

```javascript
const { SalesPaymentIntegration } = require('./app/api/v1/Integration');

// Integração com gateway específico
const stripeIntegration = new SalesPaymentIntegration('stripe');
const mercadopagoIntegration = new SalesPaymentIntegration('mercadopago');

// Usando função utilitária
const { createIntegration } = require('./app/api/v1/Integration');
const paymentIntegration = createIntegration('payment', 'stripe');
```

### Processando Pagamentos

```javascript
const paymentIntegration = new SalesPaymentIntegration('stripe');

const saleData = {
    order_number: 'ORD-123456',
    customer_id: '550e8400-e29b-41d4-a716-446655440010',
    customer_name: 'João Silva',
    customer_email: 'joao@email.com',
    total_amount: 15990, // R$ 159,90 em centavos
    currency: 'BRL'
};

try {
    const result = await paymentIntegration.processPayment(saleData, 'stripe');
    console.log('Pagamento processado:', result);
} catch (error) {
    console.error('Erro no pagamento:', error.message);
}
```

### Verificando Saúde dos Serviços

```javascript
const { checkAllIntegrationsHealth } = require('./app/api/v1/Integration');

const healthResults = await checkAllIntegrationsHealth();
console.log('Status dos serviços:', healthResults);
```

### Obtendo Estatísticas

```javascript
const paymentIntegration = new SalesPaymentIntegration('stripe');

const statistics = await paymentIntegration.getPaymentStatistics('stripe', '30d');
console.log('Estatísticas do Stripe:', statistics);
```

## Tratamento de Erros

### Tipos de Erro

- `INTEGRATION_ERROR`: Erro geral de integração
- `PAYMENT_PROCESSING_FAILED`: Falha no processamento de pagamento
- `REFUND_PROCESSING_FAILED`: Falha no processamento de reembolso
- `PAYMENT_STATUS_CHECK_FAILED`: Falha na consulta de status

### Retry Automático

O sistema implementa retry automático com backoff exponencial:

- Máximo de 3 tentativas
- Delay: 1s, 2s, 4s entre tentativas
- Logs detalhados de cada tentativa

### Logging

Todas as integrações incluem logging estruturado:

```javascript
{
    service: 'payment',
    gateway: 'stripe',
    method: 'POST',
    url: '/payments',
    status: 200,
    responseTime: '150ms'
}
```

## Configuração de Ambiente

### Variáveis de Ambiente Obrigatórias

#### Payment Gateways

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_API_URL=https://api.stripe.com/v1

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=TEST-your_mercadopago_access_token
MERCADOPAGO_API_URL=https://api.mercadopago.com

# PagSeguro
PAGSEGURO_API_URL=https://ws.pagseguro.uol.com.br
PAGSEGURO_EMAIL=your_pagseguro_email
PAGSEGURO_TOKEN=your_pagseguro_token
```

#### Microserviços

```bash
INVENTORY_SERVICE_URL=http://localhost:3001
INVENTORY_SERVICE_TOKEN=your_inventory_service_token
CUSTOMER_SERVICE_URL=http://localhost:3002
CUSTOMER_SERVICE_TOKEN=your_customer_service_token
NOTIFICATION_SERVICE_URL=http://localhost:3003
NOTIFICATION_SERVICE_TOKEN=your_notification_service_token
```

#### URLs do Sistema

```bash
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3000
```

## Monitoramento e Observabilidade

### Health Checks

Cada integração implementa health checks:

```javascript
const health = await paymentIntegration.healthCheck();
// Retorna: { service: 'payment', gateway: 'stripe', status: 'healthy' }
```

### Métricas

- Tempo de resposta por serviço
- Taxa de sucesso por gateway
- Número de tentativas de retry
- Erros por tipo de integração

### Alertas

- Serviços indisponíveis
- Taxa de erro alta
- Tempo de resposta anormal
- Falhas consecutivas

## Extensibilidade

### Adicionando Novos Gateways

1. Adicionar configuração no `EXTERNAL_SERVICES`
2. Implementar formatação específica no `formatPaymentData`
3. Adicionar validações no `validatePaymentMethod`

### Adicionando Novos Serviços

1. Criar nova classe de integração
2. Estender `BaseIntegration`
3. Adicionar ao arquivo `index.js`
4. Configurar variáveis de ambiente

## Boas Práticas

### Segurança

- Nunca logar dados sensíveis (tokens, números de cartão)
- Usar HTTPS para todas as comunicações
- Implementar rate limiting
- Validar todas as entradas

### Performance

- Usar timeouts apropriados (30s padrão)
- Implementar circuit breakers para serviços críticos
- Cachear respostas quando apropriado
- Monitorar latência

### Manutenibilidade

- Logs estruturados e consistentes
- Tratamento de erros padronizado
- Documentação atualizada
- Testes de integração

## Troubleshooting

### Problemas Comuns

#### Gateway Indisponível

```javascript
// Verificar saúde do gateway
const health = await paymentIntegration.healthCheck();
if (health.status === 'unhealthy') {
    // Implementar fallback ou notificar
}
```

#### Timeout de Requisição

```javascript
// Aumentar timeout para operações específicas
const response = await paymentIntegration.httpClient.post('/payments', data, {
    timeout: 60000 // 60 segundos
});
```

#### Erro de Autenticação

```javascript
// Verificar variáveis de ambiente
console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not Set');
```

### Logs de Debug

```javascript
// Habilitar logs detalhados
const logger = require('./app/utils/logger');
logger.level = 'debug';
```

## Conclusão

O sistema de integrações da Henrique Store Sales API oferece uma base sólida e extensível para comunicação com serviços
externos. A arquitetura modular permite fácil manutenção e adição de novos serviços, enquanto o tratamento robusto de
erros e logging estruturado garantem observabilidade e confiabilidade.
