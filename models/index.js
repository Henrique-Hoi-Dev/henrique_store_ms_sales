const { sequelize } = require('../config/database');
const Product = require('../app/api/v1/business/product/product_model');

// Sync models with database
const syncModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Models synchronized with database');
    } catch (error) {
        console.error('Error syncing models:', error);
    }
};

module.exports = {
    sequelize,
    Product,
    syncModels
};
