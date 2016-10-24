
const join = require('path').join;


module.exports = function (app) {
	//SERVE SEMPRE L'INDEX.HTML IN QUALSIASI ALTRO CASO FUORI DALLE API
	app.get('/*',function(req, res){
	  res.sendFile(join(__dirname,"..","build","index.html"));
	});
}