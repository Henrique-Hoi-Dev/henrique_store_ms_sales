# API Documentation - Microserviço de Vendas

## Base URL

```
http://localhost:3000/v1
```

## Autenticação

Todas as requisições requerem autenticação JWT no header:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Listar Vendas

```http
GET /sales
```

**Query Parameters:**

- `page` (number, default: 1): Página atual
- `limit` (number, default: 20, max: 100): Itens por página
- `status` (string): Filtrar por status (PENDING, PAID, CANCELLED, REFUNDED, SHIPPED, DELIVERED)
- `payment_status` (string): Filtrar por status de pagamento (PENDING, AUTHORIZED, PAID, FAILED, REFUNDED)
- `customer_id` (string): Filtrar por ID do cliente
- `source` (string): Filtrar por origem (WEB, MOBILE, API, PHONE)
- `integration_source` (string): Filtrar por fonte de integração
- `is_active` (boolean): Filtrar por vendas ativas

**Response:**

```json
{
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "orderNumber": "ORD-1704067200000-001",
            "customerId": "550e8400-e29b-41d4-a716-446655440010",
            "customerName": "João Silva",
            "customerEmail": "joao.silva@email.com",
            "customerPhone": "(11) 99999-9999",
            "customerDocument": "123.456.789-00",
            "totalAmount": 15990,
            "subtotalAmount": 14990,
            "taxAmount": 1499,
            "discountAmount": 0,
            "shippingAmount": 1000,
            "currency": "BRL",
            "status": "PAID",
            "paymentStatus": "PAID",
            "paymentMethod": "CREDIT_CARD",
            "paymentGateway": "stripe",
            "paymentTransactionId": "txn_123456789",
            "shippingAddress": {
                "street": "Rua das Flores",
                "number": "123",
                "complement": "Apto 45",
                "neighborhood": "Centro",
                "city": "São Paulo",
                "state": "SP",
                "zipCode": "01234-567",
                "country": "Brasil"
            },
            "billingAddress": {
                "street": "Rua das Flores",
                "number": "123",
                "complement": "Apto 45",
                "neighborhood": "Centro",
                "city": "São Paulo",
                "state": "SP",
                "zipCode": "01234-567",
                "country": "Brasil"
            },
            "items": [
                {
                    "productId": "550e8400-e29b-41d4-a716-446655440100",
                    "name": "Smartphone Galaxy S21",
                    "sku": "GAL-S21-128GB",
                    "price": 14990,
                    "quantity": 1,
                    "discount": 0
                }
            ],
            "notes": "Entrega preferencialmente no período da tarde",
            "source": "WEB",
            "integrationSource": "ecommerce",
            "externalId": "ext_001",
            "metadata": {
                "trackingCode": "BR123456789BR",
                "shippingCompany": "Correios",
                "estimatedDelivery": "2024-01-05"
            },
            "isActive": true,
            "createdAt": "2024-01-01T10:00:00.000Z",
            "updatedAt": "2024-01-01T10:00:00.000Z"
        }
    ],
    "meta": {
        "total": 1,
        "page": 1,
        "limit": 20
    }
}
```

### 2. Resumo de Vendas

```http
GET /sales/summary
```

**Query Parameters:**

- `start_date` (string, ISO date): Data inicial
- `end_date` (string, ISO date): Data final
- `status` (string): Filtrar por status
- `payment_status` (string): Filtrar por status de pagamento

**Response:**

```json
{
    "totalSales": 3,
    "totalAmount": 54970,
    "totalPaid": 45980,
    "totalPending": 8990,
    "totalCancelled": 0
}
```

### 3. Buscar Venda por ID

```http
GET /sales/:id
```

**Response:** Mesmo formato da venda individual

### 4. Buscar Venda por Número do Pedido

```http
GET /sales/order/:orderNumber
```

**Response:** Mesmo formato da venda individual

### 5. Criar Nova Venda

```http
POST /sales
```

**Request Body:**

```json
{
    "customerId": "550e8400-e29b-41d4-a716-446655440010",
    "customerName": "João Silva",
    "customerEmail": "joao.silva@email.com",
    "customerPhone": "(11) 99999-9999",
    "customerDocument": "123.456.789-00",
    "items": [
        {
            "productId": "550e8400-e29b-41d4-a716-446655440100",
            "name": "Smartphone Galaxy S21",
            "sku": "GAL-S21-128GB",
            "price": 14990,
            "quantity": 1,
            "discount": 0
        }
    ],
    "shippingAddress": {
        "street": "Rua das Flores",
        "number": "123",
        "complement": "Apto 45",
        "neighborhood": "Centro",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01234-567",
        "country": "Brasil"
    },
    "billingAddress": {
        "street": "Rua das Flores",
        "number": "123",
        "complement": "Apto 45",
        "neighborhood": "Centro",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01234-567",
        "country": "Brasil"
    },
    "discountAmount": 0,
    "shippingAmount": 1000,
    "currency": "BRL",
    "paymentMethod": "CREDIT_CARD",
    "source": "WEB",
    "integrationSource": "ecommerce",
    "externalId": "ext_001",
    "notes": "Entrega preferencialmente no período da tarde",
    "metadata": {
        "giftWrapping": false
    }
}
```

**Response:** Venda criada com número do pedido gerado automaticamente

### 6. Atualizar Venda

```http
PUT /sales/:id
```

**Request Body:** Mesmo formato do POST, mas todos os campos são opcionais

### 7. Atualizar Status da Venda

```http
PATCH /sales/:id/status
```

**Request Body:**

```json
{
    "status": "PAID",
    "payment_status": "PAID"
}
```

**Status disponíveis:**

- `PENDING`: Aguardando pagamento
- `PAID`: Pago
- `CANCELLED`: Cancelado
- `REFUNDED`: Reembolsado
- `SHIPPED`: Enviado
- `DELIVERED`: Entregue

### 8. Atualizar Status do Pagamento

```http
PATCH /sales/:id/payment
```

**Request Body:**

```json
{
    "payment_status": "PAID",
    "payment_method": "CREDIT_CARD",
    "payment_gateway": "stripe",
    "payment_transaction_id": "txn_123456789"
}
```

**Status de pagamento disponíveis:**

- `PENDING`: Aguardando
- `AUTHORIZED`: Autorizado
- `PAID`: Pago
- `FAILED`: Falhou
- `REFUNDED`: Reembolsado

### 9. Excluir Venda (Soft Delete)

```http
DELETE /sales/:id
```

**Response:** Venda marcada como inativa

### 10. Vendas por Cliente

```http
GET /sales/customer/:customerId
```

**Query Parameters:**

- `page` (number, default: 1): Página atual
- `limit` (number, default: 20): Itens por página

**Response:** Lista de vendas do cliente específico

## Códigos de Erro

### 400 - Bad Request

```json
{
    "error": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
        {
            "field": "customerEmail",
            "message": "Email is required"
        }
    ]
}
```

### 401 - Unauthorized

```json
{
    "error": "UNAUTHORIZED",
    "message": "Invalid or missing token"
}
```

### 404 - Not Found

```json
{
    "error": "SALE_NOT_FOUND",
    "message": "Sale not found"
}
```

### 500 - Internal Server Error

```json
{
    "error": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
}
```

## Valores Monetários

Todos os valores monetários são armazenados em **centavos** para evitar problemas de precisão com números decimais.

**Exemplo:**

- R$ 159,90 = 15990 centavos
- R$ 10,00 = 1000 centavos

## Integração com Pagamentos

### Gateways Suportados

1. **Stripe**

    - Métodos: Cartão de crédito
    - Configuração: `STRIPE_SECRET_KEY`

2. **MercadoPago**

    - Métodos: PIX, Boleto
    - Configuração: `MERCADOPAGO_ACCESS_TOKEN`

3. **PagSeguro**
    - Métodos: Cartão, Transferência bancária, Boleto
    - Configuração: `PAGSEGURO_EMAIL`, `PAGSEGURO_TOKEN`

### Webhooks

Para receber atualizações de pagamento, configure webhooks nos gateways apontando para:

```
POST /webhooks/stripe
POST /webhooks/mercadopago
POST /webhooks/pagseguro
```

## Rate Limiting

- **100 requests/minute** por IP
- **1000 requests/hour** por usuário autenticado

## Logs

Todos os endpoints geram logs estruturados com:

- Timestamp
- Request ID
- User ID (quando autenticado)
- Endpoint
- Status code
- Response time
- IP address
