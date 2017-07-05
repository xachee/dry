const Sequelize = require('sequelize');
const sq = require("./db");

const User = sq.define('users', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  googleId: {type: Sequelize.STRING(22), unique: true},
  accessToken: Sequelize.TEXT,
  refreshToken: Sequelize.TEXT,
  photos: Sequelize.TEXT,
  displayName: Sequelize.TEXT
});

const Order = sq.define('orders', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  playlistId: Sequelize.TEXT,
  ownerId: Sequelize.STRING(22)
});

const Sale = sq.define('sales', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  playlistId: Sequelize.TEXT,
  price: Sequelize.FLOAT
});

const Playlist = sq.define('playlists', {
  id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
  title: Sequelize.TEXT,
  description: Sequelize.TEXT,
  youtubeId: {type: Sequelize.STRING(35), unique: true},
  status: {type: Sequelize.STRING(9), defaultValue: "youtube"},
  videos: Sequelize.TEXT,
  thumbnail: Sequelize.TEXT,
  userId: Sequelize.STRING(22)
});

User.sync();
Playlist.sync();
Sale.sync();
Order.sync();

module.exports = {User, Order, Sale, Playlist};
