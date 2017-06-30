const Sequelize = require('sequelize');
const sequelize = new Sequelize('dry', 'root', 'usbw');
module.exports=sequelize;