var ipc= require("node-ipc-ecma5");
ipc.config.silent= true;

var vw= require("./lib/vw");
vw.addPath(__dirname + "/node_modules/");
vw.addPath(__dirname + "/node_modules/vw-server/node_modules/");
vw.on("ready", function(){
	// Mirar los argumentos ...
	vw.command();
});
vw.startClient();
module.exports= vw;
