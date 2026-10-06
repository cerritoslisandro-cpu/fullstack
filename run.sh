#!/bin/bash

# 1. Liberar los puertos 8080 (Quarkus) y 3000 (Vue/Vite) por si quedaron ocupados
echo "Liberando puertos 8080 y 3000..."
fuser -k 8080/tcp 3000/tcp 2>/dev/null

# 2. Iniciar Backend Quarkus en segundo plano (guardando logs en quarkus.log)
echo "Iniciando Backend (Quarkus)..."
cd /workspaces/fullstack/backend-quarkus
mvn quarkus:dev > ../quarkus.log 2>&1 &

# 3. Esperar un par de segundos para que Quarkus prepare el proceso
sleep 8

# 4. Iniciar Frontend Vue/Vite en primer plano para ver sus logs en la consola
echo "Iniciando Frontend (Vue/Vite)..."
cd /workspaces/fullstack/frontend-vue
npx vite --host 0.0.0.0 --port 3000