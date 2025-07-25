'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add metadata column
        await queryInterface.addColumn('Products', 'metadata', {
            type: Sequelize.JSONB,
            allowNull: true,
            comment: 'Custom integration data (size, color, supplier_price, shipping days, etc.)'
        });
    },

    async down(queryInterface, Sequelize) {
        // Remove metadata column
        await queryInterface.removeColumn('Products', 'metadata');
    }
};
