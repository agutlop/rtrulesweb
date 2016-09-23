# RTRulesWeb

Front end para el proyecto fin de master del Experto en Big Data de la U-Tad Curso 2015-2016.

El proyecto consiste en la aplicación de reglas a los mesajes recibidos por un sistema de procesamiento streaming distribuido. 
Estas reglas serán introducidas en el sistema por el usuario mediante la web RTRulesWeb. 

RTRulesWeb cubre las siguientes funcionalidades:
- Alta de Metadatos
- Alta de Topics
- Alta de Reglas
- Consulta de los resultados de las reglas aplicadas a los procesos Streaming


## Prerequisitos

Para el funcionamiento de la web es necesario:
  - `npm` y `grunt` 
  - RTRulesAPI(`localhost:9090`). Ver repositorio rtrulesapi
  - Una instancia de MongoDB (`localhost:27017`) 
  - Una instancia de Kibana (`localhost:5601`)
  - Una instancia de Elasticsearch (`localhost:9200`)
  - Consultar el repositorio rtrulesstorage para consultar los metadatos que deben tener Elasticsearch, Kibana y MongoDB


## Build & development

Descargar el repositorio 
    `git clone https://github.com/agutlop/rtrulesweb.git`

Instalar dependencias
    `npm install`

Instalar bower
    `bower install`

Ejecutar `grunt` para compilar y `grunt serve` para lanzar la web en local



This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.
