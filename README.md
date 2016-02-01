# vw

Voxwebkit o en su abreviatura vw, ha sido diseñado para crear aplicaciones multiplataforma con un mismo código base. 
vw está hecho como un módulo para jxcore, una versión de nodejs que soporta plataformas móviles.
vw contiene varios módulos necesarios para la ejecución de estas aplicaciones.
vw debe instalarse como un módulo global. Más adelante se pondrán aplicaciones completas que se ejecutan con vw,
vw tiene soporte para javascript, y coffeescript

Vw funciona sobre jxcore, para instalar vw, primero instale jxcore. 





#### Installation Sistemas Unix

Instale jxcore

Para instalar jxcore por favor vaya a esta página y descargue la versión correspondiente, http://jxcore.com/downloads/

En el caso de Linux ubique su archivo descargado en la carpeta /usr/bin (necesitará permisos de administrador)

A los usuarios Linux que usan el script automático por favor deben ejecutar luego el siguiente comando:

```sh
$ sudo cp /usr/local/bin/jx /usr/bin/jx
```


Los usuarios Windows, deben utilizar el instalador, e instalar JxCore en una carpeta sin espacios preferiblemente corta como C:\JxCore y habilitar la opción de añadir el path al entorno de Windows

A continuación instale vw, debe instalarse globalmente:

```sh
$ jx install -g vw
```


#### Nota
El desarrollo de vw está indocumentado aún, en breve subiremos una aplicación de ejemplo llamada G-Music que se instala con vw. 



#### Cómo usar


```sh
vw mypath/myapp

```


#### Ventajas del rediseño de vw
Vw ha sido rediseñado para tener ciertas características que no tenía en las versiones iniciales. Ahora se puede instalar vw completamente desde npm. Antes se debía instalar por medio de un script que no estaba completo.
vw ahora permite comunicación entre procesos vw, resultando que se puede obtener la lista de procesos sobre vw, poder restringir la ejecución de una aplicación a una sola instancia, entre otras. 


### Development
Producto desarrollado por VoxSoftware


License
----

MIT


   