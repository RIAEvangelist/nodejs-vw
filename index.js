var os= require("os");
var mobile= os.platform()=="android" || os.platform()=="ios";
var singleinstance= require("single-instance");
var locker = new singleinstance('vox-webkit');
var cp= require("child_process");
var vw= require("./lib/vw.js");
vw.addPath(__dirname + "/node_modules/");

var continuer= function(){
    /*
    console.log(process.stdin);
    console.log(process.stdout);
    console.log(process.stderr);
    */

    vw.on("ready", function(){        
        vw.open(process.argv);        
    });
    vw.startServer();
}

// En móvil no crea un proceso padre ...
if(mobile){
    vw.command();
    module.exports= vw;
    return; 
}

locker.lock().then(continuer).catch(function(err){

    if(err.stack){
        console.log(err.stack);
        process.exit(1);
    }
    
    
    /*
    // Ya está abierta ...
    var ipc= require("node-ipc");
    ipc.config.id= process.vwuid;
    ipc.config.retry=1500;
    ipc.connectTo ("voxwebkit", function(){
        ipc.of.voxwebkit.emit("open", {
            argv:process.argv
        });

        setTimeout(function(){
            process.exit(0);
        }, 100)
    });
    return;
    */

    
    require("child.js");


});
