require('./tables.js')


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

function upsertUser(user){
	if(user.refreshToken!="undefined" && refreshToken!="" && refreshToken!=null ){
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

function upsertPlaylist(data){	
		var updates={
			title:data.title,
			description:data.description,
			youtube_id:data.youtube_id,
			videos:data.videos,
			thumbnail:data.thumbnail,
		  	user_id:data.user_id
		}
	return sq.sync().then(() =>playlists.upsert(updates));
}
