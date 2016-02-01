// Port 41441 ...

var path= require("path");
var host= "127.0.0.1:41441";
var ipc= require("node-ipc-ecma5");
ipc.config.silent= true;


//var os= require("os");
var home= process.env.HOME || process.env.USERPROFILE;
var fs= require("fs");
var tmp= home + "/.voxwebkit/";
if(!fs.existsSync(tmp)){
	fs.mkdirSync(tmp);
}
tmp+= "socks/";
if(!fs.existsSync(tmp)){
	fs.mkdirSync(tmp);
}


ipc.config.socketRoot= tmp;
ipc.config.networkPort= 49671;


if(!String.prototype.startsWith){
    String.prototype.startsWith=function(str){
        str=str||"";
        if(str.length==0){
            return false;
        }
        return this.substring(0, str.length)==str;
    }
}

if(!String.prototype.endsWith){
    String.prototype.endsWith=function(str){
        str=str||"";
        if(str.length==0){
            return false;
        }
        return this.substring(this.length-str.length, this.length)==str;
    }
}



var eventEmitter= require("events").EventEmitter;
var util= require("util");
var vwClass= function(){
	eventEmitter.call(this);
	this.paths=[];
}
util.inherits(vwClass, eventEmitter);
var chalk= require("chalk");


var fs= require("fs");
var vw= vwClass.prototype;
var uniqid= require("uniqid");
process.vwuid= uniqid();


var Module= require("module").Module;
var resolveName= Module._resolveFilename;
var thisModule= module;



/* VW 1.0.0.2 incluye Coffee Script */
var coffee= require("vw-coffee-script");
require("sqlite-mobile-fix");






var toStr= function(obj){
    if(typeof(obj)=="string"){
        return obj;
    }
    if(obj==null){
        return "null";
    }
    if(obj==undefined){
        return "undefined";
    }
    return util.inspect(obj);
}


vw.log= function(){
    // Como el info ...
    for(var i=0;i<arguments.length;i++){
    	if(i==0 && false){
        	arguments[i]= chalk.green("log: ", toStr(arguments[i]));
        }else{
        	arguments[i]= chalk.green(toStr(arguments[i]));
        }

    }
    return console.log.apply(console, arguments);
}

vw.info= function(){
    // Como el info ...
    for(var i=0;i<arguments.length;i++){
    	if(i==0 && false){
        	arguments[i]= chalk.cyan("info: ", toStr(arguments[i]));
    	}
    	else{
    		arguments[i]= chalk.cyan(toStr(arguments[i]));
    	}
    }
    return console.info.apply(console, arguments);
}

vw.error= function(){
    // Como el info ...
    for(var i=0;i<arguments.length;i++){
    	if(i==0 && false){
	        arguments[i]= chalk.red("error ", toStr(arguments[i]));
	    }
	    else{
	    	arguments[i]= chalk.red(toStr(arguments[i]));
	    }
    }
    return console.error.apply(console, arguments);
}

vw.warning= function(){
    // Como el info ...
    for(var i=0;i<arguments.length;i++){
    	if(i==0 && false){
        	arguments[i]= chalk.yellow("warning: ", toStr(arguments[i]));
    	}
    	else{
    		arguments[i]= chalk.yellow(toStr(arguments[i]));
    	}
    }
    return console.warn.apply(console, arguments);
}

vw.run= function(file){
	return require(file);
}


/* Línea de argumentos */
vw["--apps"]= function(){
	// Mostrar las aplicaciones ...
	var self= this;
	self.getApplications(function(err, apps){
		if(err){
			self.error(err);
			return self._verify();
		}
		console.log(chalk.yellow("Lista de aplicaciones voxwebkit"));
		console.log("");
		apps.forEach(function(app){
			var str= JSON.stringify(app);
			self.info(str);
		});

		return self._verify();
	});
}


vw["--g"]= function(){
	var self= this;
	self.installArgs=self.installArgs||{};
	self.installArgs.global= true;
}

vw["--install"]= function(){
	var self= this;
	var cp= require("child_process");
	var run= function(f){


		if(!f){
			vw.warning("No se especificó el nombre de la aplicación a instalar");
			process.exit(0);
			return;
		}
		// Descarga la aplicación y le aplica el install ...
		var installArgs= self.installArgs|| {};
		var argvs=["install"];


		if(installArgs.global){
			argvs.push("-g");
		}
		argvs.push(f);


		/*
		var npm= require("npm");
		npm.load(function(er){
			if(er){
				return vw.error(er);
			}

			npm.commands.install(argvs, function(er, data){
				if(er){
					return vw.error(er);
				}


				// Realizar la instalación
				var vwInstall= require("vw-installer");
				var count= data.length;

				data= data[data.length-1]; // Esto es porque los demás son solo dependencias ...
				data.forEach(function(item){
					var nop= false;
					try{
						vwInstall.getConfig(item[1]);
					}
					catch(e){
						vw.warning("No se encontró la configuración de instalación de vw para ",item[1]);
						nop= true;
					}

					if(nop){
						count--;
						vw.info("Instalado: ", item);
						if(count<=0){
							process.exit(0);
						}
					}

					else{
						vwInstall.install(item[1], !!installArgs.global, function(err){
							if(err){
								vw.error(err);
								process.exit(0);
							}
							count--;
							vw.info("Instalado: ", item);
							if(count<=0){
								process.exit(0);
							}
						});
					}

				});

			});
		});
		*/

		vw.info("Instalando... ");
		vw.info("Esta operación puede tardar algunos minutos... ");
		vw.info("");

		var pro= cp.spawn(process.argv[0], argvs, {
			stdio: ['pipe','pipe',2]
		});
		var haveEr= false;
		var allData= [];
		/*
		pro.stderr.on("data", function(er){
			haveEr= true;
			vw.warning(er.toString());
		});
		*/



		pro.stdout.on("data", function(data){
			vw.log(data.toString());
			allData.push(data.toString());
		});

		pro.on("exit", function(){


			var vwInstall= require("vw-installer");
			var response= allData.join("\n").split("\n");
			var appLine;
			response.forEach(function(line){
				if(line.substring(0, f.length)== f){
					// este es ...
					appLine= line;
					return;
				}
			});

			if(!appLine){
				vw.error("No se pudo determinar en que carpeta se instaló el módulo. No se puede continuar");
				process.exit(1);
				return;
			}

			appLine= appLine.split(" ");
			var dir= [];
			for(var i=1;i<appLine.length;i++){
				dir.push(appLine[i]);
			}
			dir= dir.join(" ");
			try{
				vwInstall.getConfig(dir);
			}
			catch(e){

				vw.error("No se encontró la configuración de instalación de vw para ",f);
				process.exit(1);
				return;
			}

			vwInstall.install(dir, !!installArgs.global, function(err){
				if(err){
					vw.error(err);
					process.exit(0);
					return;
				}

				vw.info("Instalado: ", dir);
				process.exit(0);
				return;
			});






		})




	}
	return run;
}



vw._verify= function(){
	this.commandCount--;
	if(this.commandCount<=0){
        if(this.isserver){
            process.exit(0);
        }
        else{
			ipc.disconnect("voxwebkit");
			process.exit(0);
        }
	}
}

vw.command= function(){
	/*
	var f= process.argv[2];
	if(f){
		this.run(f);
	}
	else{
		ipc.disconnect("voxwebkit");
	}
	*/
	var self= this;
	self.commandCount=0;
	var f,nod, run;
        /*
	console.log(process.argv);
	console.log(global.gc);
        */
	for(var i=2;i<process.argv.length;i++){
		var arg= process.argv[i];
		if(arg.substring(0,2)=="--"){

			if(typeof self[arg]=="function"){
				self.commandCount++;
				run=self[arg]();
				nod=true;
			}

		}
		else{
			f= arg;
			break;
		}
	}

	if(f){

		if(typeof(run)=="function"){
			return run(f);
		}
		else{
        	this.run(f);
    	}
	}
	else{
		if(typeof(run)=="function"){
			return run();
		}
		if(!nod){
        	self._verify();
    	}
	}


}

var pcallback= function(callback){
	callback= callback|| function(){}
	return function(data){
		if(data.error){
			return callback(data.error);
		}
		else{
			return callback(undefined, data.data);
		}
	}
}




vw.getApplications= function(callback){

	var uid= uniqid();
	this.once("voxwebkit:"+uid, pcallback(callback));
	ipc.of.voxwebkit.emit("applications", {
		messageuid:uid
	});


}


vw.getApplicationsByName= function(name, callback){

	var uid= uniqid();
	ipc.of.voxwebkit.emit("applications", {
		name: name,
		messageuid:uid
	});
	this.once("voxwebkit:"+uid, pcallback(callback));

}



vw.getApplicationByPID= function(name, callback){

	var uid= uniqid();
	ipc.of.voxwebkit.emit("applications", {
		pid: pid,
		messageuid:uid
	});
	this.once("voxwebkit:"+uid, pcallback(callback));

}


// Mandar argv a un proceso ya abierto
vw.sendArgv= function(name, argv, callback){

	var uid= uniqid();
	ipc.of.voxwebkit.emit("sendargv", {
		name:name,
		argv:argv,
		messageuid:uid
	});
	this.once("voxwebkit:"+uid, pcallback(callback));
}




vw.addPath= function(ipath){
    this.paths.push(path.normalize(ipath));
}
vw.version= function(){
    return "2.1.49";
}
vw.resolveFileName= function(name, imodule){
	//vw.log(name);
    var self = this;
    var retry,er;
    try{
        var fn= resolveName.apply(Module,arguments);
        return fn;
    }
    catch(e){
        er=e;
        if(e.code=="MODULE_NOT_FOUND"){
            retry=true;
        }
    }

    if(er && retry){

        var paths=[];
        var upath= function(ipath){
            var ipp= ipath;
            if(paths.indexOf(ipath)<1){
                paths.push(ipath);
            }
            ipath = ipp+ "/node_modules";
            if(paths.indexOf(ipath)<1){
                paths.push(ipath);
            }
            ipath = ipp+ "/vw_modules";
            if(paths.indexOf(ipath)<1){
                paths.push(ipath);
            }
            ipath = path.normalize(ipp+ "/..");
            if(paths.indexOf(ipath)<1){
                paths.push(ipath);
            }
        }



        if(imodule){
            var stat= fs.statSync(imodule.filename);
            if(stat.isDirectory()){
                upath(imodule.filename);
            }
            else{
                upath(path.dirname(imodule.filename));
            }

        }
        if(imodule.parent){
            var stat= fs.statSync(imodule.parent.filename);
            if(stat.isDirectory()){
                upath(imodule.parent.filename);
            }
            else{
                upath(path.dirname(imodule.parent.filename));
            }
        }
        upath(__dirname);
        upath(process.cwd());

        paths= paths.concat(self.paths);


        var file, fl, stat, jpackage, jsonp;

        var reviseExt= function(ipath){
            for(var i in require.extensions){
                var nf= ipath+ i;
                if(fs.existsSync(nf)){
                    return nf;
                }
            }
        }

        for(var i =0;i<paths.length;i++){
            var ipath= paths[i];

            fl= path.join(ipath, name);


            if(fs.existsSync(fl)){


                stat= fs.statSync(fl);
                if(stat.isDirectory()){
                    jpackage= fl + "/package.json";


                    if(fs.existsSync(jpackage)){
                        jsonp= fs.readFileSync(jpackage,'utf8');
                        jsonp= JSON.parse(jsonp);
                        if(jsonp.main){
                            return name + "/" + jsonp.main;
                        }
                    }

                    if(fl= reviseExt(fl + "/index")){
                        return fl;
                    }

                }
                else{
                    return fl;
                }
            }
            else if(fl= reviseExt(fl)){
                return fl;
            }

        }
    }


    if(er){
        throw er;
    }

}


vw.startServer= function(){

        var self= this;
	var apps= [];
	var connections={};
	var getConnection= function(uid, callback){
		if(connections[uid]){
			return callback(undefined, connections[uid]);
		}
		ipc.connectTo(uid, function(){
			var c=connections[uid]= ipc.of[uid];
			return callback(undefined, c);
		});
	}



	vw.open = function(argv){

	var cp=require("child_process");
        var argvs=["--expose-gc", __dirname + "/../child.js"];
        for(var i=2;i<argv.length;i++){
            argvs.push(argv[i]);
        }




        // console.log("---- ", argvs);
        var nwp= cp.spawn(argv[0], argvs, {
		    stdio: [
		      0, // use parents stdin for child
		      1,
		      2
		    ]
		});

		/*
        nwp.stdout.on("data", function(data){
            data=data||"";
            //console.log(chalk.yellow("--- stdout desde " + nwp.pid +" ---"));
            console.log(data.toString());
            //console.log("");
        });

        nwp.stderr.on("data", function(data){
            data=data||"";
            //console.log(chalk.yellow("--- stderr desde " + nwp.pid +" ---"));
            console.log(data.toString());
            //console.log("");
        });

        nwp.on("close", function(code){
            //console.log(chalk.red("--- "+ nwp.pid +" Proceso cerrado---"));
            console.log("Cerrado con código " + code);
            //console.log("");
        });
		*/
	}


	ipc.config.id= "voxwebkit";
	ipc.config.retry=1500;
	ipc.serve(function(){
		// console.log(arguments);

		/*
		var cp= require("child_process");
		cp.exec("chmod 777 \"/tmp/vox-webkit.sock\"");
		*/

		var unregister= function(data){

			for(var i=0;i<apps.length;i++){
				if(apps[i]){
					if(apps[i].pid== data.pid){
						apps[i]= undefined;
					}
				}
			}

		}



		ipc.server.on("response", function(data){
			global.vw.emit("voxwebkit:" + data.uid, data);
		});

		ipc.server.on("register", function(data, socket){
			var uid= data.messageuid
			apps.push(data);
			var pid= data.pid;
			getConnection(data.uid, function(err, s){
				s.on("disconnect", function(){
					ipc.disconnect(data.uid);
					connections[data.uid]= undefined;
					unregister(data)
				})
			})

			ipc.server.emit(socket, "response", {uid:uid})
		});


		ipc.server.on("unregister", function(data, socket){

			var uid= data.messageuid
			unregister(data)
			ipc.server.emit(socket, "response", {uid:uid})
		});


		var getapps= function(data){

			var appsl=[];
			for(var i=0;i<apps.length;i++){

				if(apps[i]){
					if(data.name){
						if(apps[i].name==data.name){
							appsl.push(apps[i]);
						}
					}
					else if(data.pid){
						if(apps[i].pid==data.pid){
							appsl.push(apps[i]);
						}
					}
					else{
						appsl.push(apps[i]);
					}
				}
			}
			return appsl;
		}

		ipc.server.on("applications", function(data, socket){
			var uid= data.messageuid;
			var lapps= getapps(data);
			ipc.server.emit(socket, "response", {uid:uid, data:lapps})
			//socket.emit(uid, {data:getapps(data)});
		});

		ipc.server.on("open", function(data, socket){
			setTimeout(function(){
				global.vw.open(data.argv);
			}, 0);

		});


		ipc.server.on("sendargv", function(data, socket){
			var uid= data.messageuid;
			var appsl=getapps(data);
			if(appsl[0]){
				getConnection(appsl[0].uid, function(connection){
					connection.emit("sendargv", data);
					this.once("voxwebkit:"+uid, function(daa){
						// socket.emit(uid, daa);
						daa.uid= uid;
						ipc.server.emit(socket, "response", daa)
					})
				});
			}
			else{
				// socket.emit(uid, {});
				ipc.server.emit(socket, "response", {uid:uid})
			}
		});


		global.vw.emit("ready");

	});

	// console.log("here1");
	ipc.server.start();
        self.isserver= true;

}

vw.startClient= function(){
	var self= this;

	// Client ...
	vw.registerApp= function(name, singleinstance, callback){


		var uid= uniqid();
		ipc.of.voxwebkit.emit("register", {
			pid:process.pid,
			argv:process.argv,
			uid: process.vwuid,
			singleinstance:singleinstance,
			messageuid:uid,
			name:name
		});
		this.once("voxwebkit:"+uid, pcallback(callback));



	}


	// Client ...
	vw.unregisterApp= function(callback){
		var uid= uniqid();
		ipc.of.voxwebkit.emit("unregister", {
			messageuid:uid,
			pid:process.pid
		});
		this.once("voxwebkit:"+uid, pcallback(callback));
	}

	ipc.config.id= process.vwuid;
	ipc.config.retry=1500;

	ipc.serve(function(){
		ipc.connectTo ("voxwebkit", function(){

			ipc.of.voxwebkit.on("disconnect", function(){
				//global.vw.error("El proceso padre fue terminado");
				process.exit(1);
			});
			ipc.of.voxwebkit.on("response", function(data){
				self.emit("voxwebkit:" + data.uid, data);
			});

			self.emit("ready");
		})
	});
	ipc.server.start();
}



// vwClass.prototype=

var vvw= new vwClass();
global.vw = module.exports= vvw;
Module._resolveFilename=function(){
    return vw.resolveFileName.apply(vvw, arguments);
}
module.exports= vvw;
