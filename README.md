/CLIENT
-------
-npm install


/SERVER
-------
-Para crear el proyecto: npm init
-Para generar el fichero tsconfig.json: tsc --init
-Para ejecutar un fichero .ts: tsc <NAME_FILE> (Esto genera un fichero js en el outDir del fichero  tsconfig.json) o node <NAME_FILE>
-Para que se recompile todo y ponerlo como watcher cada vez que hacemos un cambio en un ts: tsc -w
-Para ejecutar el back-end desde lista de comando: node /dist (y esto  ya va al directorio y coge el index.js)
-Para evitar tener que estar con el comando node /dist ejecutándose todo el tiempo instalamos NodeMon, que lo hace automáticamente 
lanzando el comando: nodemon dist entonces cada vez que haces un cambio lo ejecuta por ti. NOTA: tienes que tener lanzado el comando tsc -w en otra consola
para que actualice la carpeta dist y entonces nodemon dist/ te la sirve con los cambios en tiempo real

-Instalamos los siguientes paquetes:
npm install express             - Permite crear un servidor web y rest
npm install body-parser         - Permite recibir una información de un post y transformarla en un objeto javascript
npm install cors                - Para hacer peticiones CORS
npm install mongoose            - Para hacer el modelado de datos de MongoDB
npm install express-fileupload  - Para recibir las peticiones de imágenes que voy a postear
npm install jsonwebtoken        - Para crear tokens de seguridad de la aplicación
npm install bcrypt              - Para encriptar las contraseñas

-Para levantar la base de datos: Ir a la consola y ejecutar el siguiente comando -> cd C:\Program Files\MongoDB\Server\4.2\bin\ y luego lanzar mongod


Para levantar front y back:
Levantar database, levantar el back haciendo tsc en la carpeta de fotosgram-server y luego node dist/ para levantar el servidor
