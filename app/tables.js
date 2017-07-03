const Sequelize = require('sequelize');
const sq=require("./db");

const users = sq.define('users', {
  google_id: {type :Sequelize.STRING(22), unique:true},
  accessToken: Sequelize.TEXT,
  refreshToken:Sequelize.TEXT  
});

const orders = sq.define('orders', {
  seller_id: Sequelize.INTEGER,
  playlist_id:Sequelize.TEXT,
  owner_id:Sequelize.INTEGER
});

/*function addUser(accessToken,refreshToken,id){
	return	sq.sync().then(() => 
		  	users.create({
		    accessToken: accessToken,
		    refreshToken: refreshToken,
		    google_id:id
		  }));
}
*/
function getUser(id){
	return sq.sync().then(() =>  users.findOne({
		where: {
		    google_id: id
	  	}
	}));
}
/*
function updateUser(id,accessToken,refreshToken){
	if(refreshToken!="undefined" && refreshToken!="" && refreshToken!=null ){
		var updates={
			accessToken:accessToken,
			refreshToken:refreshToken
		}
	}
	return users.update(
		updates,
		{
			where: {
		    google_id: id
	  	}
	  }
	);
}*/

function upsertUser(id,accessToken,refreshToken){
	if(refreshToken!="undefined" && refreshToken!="" && refreshToken!=null ){
		var updates={
			accessToken:accessToken,
			refreshToken:refreshToken,
			google_id:id
		}
	}else{
		var updates={
			accessToken:accessToken,
			google_id:id
		}
	}
	return sq.sync().then(() =>users.upsert(updates));
}

module.exports={sq:sq,upsertUser:upsertUser,getUser:getUser};
