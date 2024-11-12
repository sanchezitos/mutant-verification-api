# Mutant Verification API

Este proyecto proporciona una API para verificar si una secuencia de ADN corresponde a un mutante o a un humano, basada en la secuencia de ADN proporcionada. También ofrece un endpoint para obtener estadísticas sobre las secuencias de ADN verificadas.

## Funcionalidades

1. **Verificación de ADN (POST /mutant)**: 
   - Recibe un JSON con una secuencia de ADN y determina si la secuencia pertenece a un mutante o un humano.
   - Almacena la secuencia de ADN verificada en una base de datos para mantener un registro de las verificaciones.
     
POST - https://yaurpovhi0.execute-api.us-east-1.amazonaws.com/mutant
  

2. **Estadísticas de ADN (GET /stats)**: 
   - Proporciona estadísticas sobre las secuencias de ADN verificadas, incluyendo el número de secuencias mutantes y humanas, así como la relación entre ambas.
     
GET - https://yaurpovhi0.execute-api.us-east-1.amazonaws.com/stats

## Endpoints

### 1. Verificación de ADN (POST /mutant)

#### Solicitud
```json
{
  "dna": [
    "ATGCGA",
    "CAGTGC",
    "TTATGT",
    "AGAAGG",
    "CCCCTA",
    "TCACTG"
  ]
}
```
#### Respuesta

*200 OK:* Si la secuencia corresponde a un mutante.

*403 Forbidden:* Si la secuencia corresponde a un humano.

## Instalación
Sigue estos pasos para instalar y ejecutar el proyecto en tu máquina local:

#### Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/mutant-verification-api.git
```
#### Entra en el directorio del proyecto:

```bash
cd mutant-verification-api
```
#### Instala las dependencias:

```bash
npm install
```
#### Ejecuta el proyecto localmente:

```bash
npm run serverless-offline
```
