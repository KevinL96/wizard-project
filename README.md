# Wizard 
Este es un wizard de recopilacion de datos con codigo OTP 


# Prerequisitos
Antes de iniciar ebes tener instalado lo siguiente :

Tener instalado Node.



Tener instalado el CLI de Vue , si no esta instalado puedes hacerlo con el siguiente comando para instalacion global :
```bash
npm install -g @vue/cli
```
# Descargar el proyecto

----------


## 💿 Instalacion
Es necesario ingresar en la carpeta del proyecto 
```bash
cd wizard-project
```
E instalar los packetes de Node :

```bash
npm install
```
El wizard utiliza axios para las consultas a la APi por lo que es necesario instalar esta dependencia , usa el siguiente comando :

```bash
npm install axios
```
Asi como el enrutador 

```bash
npm install vue-router@next
```
## 💡 Uso

Correr el Proyecto

Utiliza el siguiente comando para correr el proyecto :

```bash
npm run serve
```

Esete comando crea un servidor local de desarrollo . puede verse la aplicacion ingresando en [http://localhost:8080](http://localhost:8080)  en un navegador


# Variables de Entorno

Para que el proyecto funcione de manera adecuada necesitas agregar la siguiente variable de entorno a un archivo .env en la raiz del proyecto 

```bash
/wizard-project
|-- .env  *
|-- node_modules/
|-- public/
|-- src/
|-- package.json
|-- README.md
|-- ...
```
`VUE_APP_API_URL=https://test.wanqara.com/api`  


