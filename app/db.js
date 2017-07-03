const Sequelize = require('sequelize');
const sequelize = new Sequelize('dry', 'root', 'usbw',{
	host:"localhost",
	dialect: 'mysql',
	port:3307,
	define: {
        timestamps: false
    }});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports=sequelize;