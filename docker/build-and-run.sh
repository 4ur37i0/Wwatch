#!/bin/bash

# Script para construir y ejecutar la aplicación en Docker

set -e

echo "🐳 Iniciando Wwatch en Docker..."

# Construir imagen
echo "📦 Construyendo imagen Docker..."
docker build -t wwatch:latest .

# Ejecutar contenedor
echo "🚀 Levantando contenedor..."
docker run -d \
  --name wwatch-app \
  -p 3000:3000 \
  --restart unless-stopped \
  wwatch:latest

echo "✅ Wwatch está corriendo en http://localhost:3000"
echo ""
echo "Comandos útiles:"
echo "  - Ver logs: docker logs -f wwatch-app"
echo "  - Detener: docker stop wwatch-app"
echo "  - Reiniciar: docker restart wwatch-app"
echo "  - Eliminar: docker rm -f wwatch-app"
