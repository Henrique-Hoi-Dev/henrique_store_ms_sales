'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const products = [
            // Manual Products
            {
                id: uuidv4(),
                name: 'Camiseta Básica Algodão',
                description: 'Camiseta 100% algodão, confortável e durável. Disponível em várias cores.',
                price: 2999, // R$ 29,99
                stock: 150,
                sku: 'CAM-BAS-001',
                image_url: 'https://via.placeholder.com/300x400/4A90E2/FFFFFF?text=Camiseta+Basica',
                is_active: true,
                origin: 'MANUAL',
                integration_source: null,
                external_id: null,
                metadata: null,
                created_at: now,
                updated_at: now
            },
            {
                id: uuidv4(),
                name: 'Calça Jeans Slim Fit',
                description: 'Calça jeans moderna com corte slim fit, ideal para o dia a dia.',
                price: 8999, // R$ 89,99
                stock: 75,
                sku: 'CAL-JEA-002',
                image_url: 'https://via.placeholder.com/300x400/2C3E50/FFFFFF?text=Calca+Jeans',
                is_active: true,
                origin: 'MANUAL',
                integration_source: null,
                external_id: null,
                metadata: null,
                created_at: now,
                updated_at: now
            },
            {
                id: uuidv4(),
                name: 'Tênis Esportivo Running',
                description: 'Tênis especializado para corrida com amortecimento avançado e respirabilidade.',
                price: 19999, // R$ 199,99
                stock: 45,
                sku: 'TEN-ESP-003',
                image_url: 'https://via.placeholder.com/300x400/E74C3C/FFFFFF?text=Tenis+Running',
                is_active: true,
                origin: 'MANUAL',
                integration_source: null,
                external_id: null,
                metadata: null,
                created_at: now,
                updated_at: now
            },

            // Dropshipping Products
            {
                id: uuidv4(),
                name: 'Fone de Ouvido Bluetooth Wireless',
                description: 'Fone de ouvido com cancelamento de ruído ativo e bateria de longa duração.',
                price: 15999, // R$ 159,99
                stock: 200,
                sku: 'FON-BLU-004',
                image_url: 'https://via.placeholder.com/300x400/9B59B6/FFFFFF?text=Fone+Bluetooth',
                is_active: true,
                origin: 'DROPSHIPPING',
                integration_source: 'AliExpress',
                external_id: 'AE_FONE_001',
                metadata: JSON.stringify({
                    color: 'Preto',
                    size: 'Único',
                    supplier_price: 8999,
                    shipping_days: 15,
                    supplier_name: 'TechAudio Co.',
                    warranty: '6 meses'
                }),
                created_at: now,
                updated_at: now
            },
            {
                id: uuidv4(),
                name: 'Smartwatch Fitness Tracker',
                description: 'Relógio inteligente com monitor cardíaco, GPS e resistente à água.',
                price: 29999, // R$ 299,99
                stock: 120,
                sku: 'SMA-FIT-005',
                image_url: 'https://via.placeholder.com/300x400/27AE60/FFFFFF?text=Smartwatch',
                is_active: true,
                origin: 'DROPSHIPPING',
                integration_source: 'AliExpress',
                external_id: 'AE_SMART_002',
                metadata: JSON.stringify({
                    color: 'Azul',
                    size: '42mm',
                    supplier_price: 18999,
                    shipping_days: 20,
                    supplier_name: 'SmartTech Ltd.',
                    warranty: '12 meses',
                    features: ['GPS', 'Heart Rate', 'Water Resistant']
                }),
                created_at: now,
                updated_at: now
            },
            {
                id: uuidv4(),
                name: 'Câmera de Segurança WiFi',
                description: 'Câmera de segurança com visão noturna, detecção de movimento e armazenamento em nuvem.',
                price: 24999, // R$ 249,99
                stock: 80,
                sku: 'CAM-SEG-006',
                image_url: 'https://via.placeholder.com/300x400/34495E/FFFFFF?text=Camera+Seguranca',
                is_active: true,
                origin: 'DROPSHIPPING',
                integration_source: 'AliExpress',
                external_id: 'AE_CAM_003',
                metadata: JSON.stringify({
                    color: 'Branco',
                    resolution: '1080p',
                    supplier_price: 15999,
                    shipping_days: 25,
                    supplier_name: 'SecurityCam Pro',
                    warranty: '18 meses',
                    features: ['Night Vision', 'Motion Detection', 'Cloud Storage']
                }),
                created_at: now,
                updated_at: now
            }
        ];

        await queryInterface.bulkInsert('Products', products, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Products', null, {});
    }
};
