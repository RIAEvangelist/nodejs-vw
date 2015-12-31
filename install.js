var fs= require("fs");
function copy(src, dst, opts, cb) {
    if ('function' === typeof opts) {
        cb = opts;
        opts = null;
    }
    opts = opts || {};

    function copyHelper(err) {
        var is
        , os
        ;

        if (!err && !(opts.replace || opts.overwrite)) {
        return cb(new Error("File " + dst + " exists."));
        }

        fs.stat(src, function (err, stat) {
        if (err) {
            return cb(err);
        }

        is = fs.createReadStream(src);
        os = fs.createWriteStream(dst);

        is.pipe(os);
        os.on('close', function (err) {
            if (err) {
            return cb(err);
            }

            fs.utimes(dst, stat.atime, stat.mtime, cb);
        });
        });
    }

    cb = cb || noop;
    fs.stat(dst, copyHelper);
}
  
var os= require("os"); 
var windows= os.platform()=="win32"
var is64= os.arch()=="x64"
var exe= process.execPath;
var cp= require("child_process");

if(windows){
    
    
    console.log("Instalando vw en Windows");
    // Write cmd ...
    var filecmd= process.env.WINDIR+"/vw-cmd.bat";
    var str= [];
    str.push("@echo off");
    str.push('"' + exe +'" --expose-gc "' + __dirname + '" %*');
    fs.writeFileSync(filecmd, str.join("\r\n"));
    
    
    var file= __dirname + "/vw.exe";
    if(is64){
        //file= __dirname + "/vw64.exe";
    }
    var dest= process.env.WINDIR+"/vw.exe";
    copy(file, dest, {overwrite:true}, function(err){
        if(err){
            throw err;
        }
        
        console.log("Instalado vw, vw-cmd");
    });
}
else{
    console.log("Instalando vw en Unix");
    /*
     * var filecmd= "/usr/bin/vw";
    var str= [];
    str.push("#!/usr/bin/env bash");
    str.push('"' + exe +'" --expose-gc "' + __dirname + '" "$@"');
    fs.writeFileSync(filecmd, str.join("\n"));
    console.log("Instalado vw");
    */
    var cmd="sudo ln -s -f \"" + __dirname + "/vw\" /usr/bin/"
    console.log("Corriendo: ", cmd);
    cp.exec(cmd, function(err){
        if(err){
            throw err;
        }
        console.log("Instalado vw");
    });
    
    
    
}

