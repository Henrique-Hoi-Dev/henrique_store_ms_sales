# Henrique Store - Microserviço de Vendas

API de vendas para o ecossistema Henrique Store, responsável por gerenciar transações, clientes e integração com
gateways de pagamento.

## 🚀 Funcionalidades

- **Gestão de Vendas**: CRUD completo de vendas com status e rastreamento
- **Integração com Pagamentos**: Suporte a múltiplos gateways (Stripe, MercadoPago, PagSeguro)
- **Gestão de Clientes**: Histórico de compras e dados de entrega
- **Cálculo Automático**: Impostos, descontos e frete
- **Relatórios**: Resumos de vendas e métricas
- **Microserviços**: Preparado para integração com outros serviços

## 🛠️ Tecnologias

- **Node.js 20 LTS** com Express 5
- **PostgreSQL** com Sequelize ORM
- **JWT** para autenticação
- **Pino** para logging estruturado
- **Jest** para testes
- **Docker** para containerização

## 📋 Pré-requisitos

- Node.js >= 18.20.0
- PostgreSQL 15+
- Docker (opcional)

## 🔧 Instalação

1. **Clone o repositório**

```bash
git clone <repository-url>
cd henrique_store_api_sales
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp env.sample .env
# Edite o arquivo .env com suas configurações
```

4. **Execute as migrations**

```bash
npm run migrate
```

5. **Execute os seeders (opcional)**

```bash
npm run seed
```

6. **Inicie o servidor**

```bash
npm run dev
```

## 🐳 Docker

```bash
# Construir e executar com Docker Compose
docker-compose up --build

# Apenas executar
docker-compose up
```

## 📚 API Endpoints

### Vendas

- `GET /v1/sales` - Listar vendas
- `GET /v1/sales/summary` - Resumo de vendas
- `GET /v1/sales/:id` - Buscar venda por ID
- `GET /v1/sales/order/:orderNumber` - Buscar venda por número do pedido
- `POST /v1/sales` - Criar nova venda
- `PUT /v1/sales/:id` - Atualizar venda
- `DELETE /v1/sales/:id` - Excluir venda (soft delete)

### Status e Pagamentos

- `PATCH /v1/sales/:id/status` - Atualizar status da venda
- `PATCH /v1/sales/:id/payment` - Atualizar status do pagamento

### Clientes

- `GET /v1/sales/customer/:customerId` - Vendas por cliente

## 💳 Gateways de Pagamento

### Suportados

- **Stripe**: Cartão de crédito
- **MercadoPago**: PIX, Boleto
- **PagSeguro**: Cartão, Transferência bancária, Boleto

### Configuração

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_API_URL=https://api.stripe.com/v1

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=TEST-your_token
MERCADOPAGO_API_URL=https://api.mercadopago.com

# PagSeguro
PAGSEGURO_API_URL=https://ws.pagseguro.uol.com.br
PAGSEGURO_EMAIL=your_email
PAGSEGURO_TOKEN=your_token
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Cobertura
npm run coverage
```

## 📊 Estrutura do Banco

### Tabela Sales

- **order_number**: Número único do pedido
- **customer\_\***: Dados do cliente
- **\*\_amount**: Valores em centavos
- **status**: Status da venda (PENDING, PAID, etc.)
- **payment\_\***: Dados de pagamento
- **items**: Array JSON com produtos
- **addresses**: Endereços de entrega e cobrança

## 🔗 Integração com Microserviços

### Comunicação

- **Síncrona**: HTTP/REST para operações críticas
- **Assíncrona**: Eventos para atualizações de status

### Eventos

- `sale.created` - Nova venda criada
- `sale.paid` - Pagamento confirmado
- `sale.shipped` - Produto enviado
- `sale.delivered` - Produto entregue

## 📈 Monitoramento

- **Logs estruturados** com Pino
- **Métricas** de vendas e pagamentos
- **Health checks** para load balancers
- **Tracing** de transações

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.
