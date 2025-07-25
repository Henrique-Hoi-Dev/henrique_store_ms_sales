'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            stock: {
                type: Sequelize.INTEGER
            },
            sku: {
                type: Sequelize.STRING,
                unique: true
            },
            image_url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            origin: {
                type: Sequelize.ENUM('MANUAL', 'DROPSHIPPING'),
                allowNull: false
            },
            integration_source: {
                type: Sequelize.STRING,
                allowNull: true
            },
            external_id: {
                type: Sequelize.STRING,
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Products');
    }
};
