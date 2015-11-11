var path= require("path");
var fs= require("fs");
var vw=function(){
    this.paths= [];
}

/* VW 1.0.0.2 incluye Coffee Script */
var coffee= require("vw-coffee-script");
coffee.register();

var modulePath= require("app-module-path");
//modulePath.addPath(__dirname +"/..");


var Module= require("module").Module;
var resolveName= Module._resolveFilename;
var thisModule= module;

vw.prototype.run= function(request){
    return require(request);
}

vw.prototype.command= function(){
    var file= process.argv[2];
    if(file.substring(0,2)=="--"){
        // Son opciones de jx o nodejs ...
        return;
    }
    vw.prototype.run(file);
}

vw.prototype.require = function(){
    return require.apply(null, arguments);
}
vw.prototype.addPath= function(ipath){
    this.paths.push(path.normalize(ipath));
}
vw.prototype.version= function(){
    return "1.0.0.2";
}
vw.prototype.resolveFileName= function(name, imodule){
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
                            return jsonp.main;
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

var vvw= new vw();
global.vw = module.exports= vvw;

Module._resolveFilename=function(){
    return vw.prototype.resolveFileName.apply(vvw, arguments);
}



vvw.command();
