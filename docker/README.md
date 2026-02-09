# Wwatch - Docker Setup Guide

## 📋 Estructura Docker

```
.
├── Dockerfile                          # Build multi-stage para http-server
├── docker-compose.yml                  # Orquestación con http-server
├── .dockerignore                       # Archivos a excluir del build
└── docker/
    ├── Dockerfile.nginx                # Build multi-stage para Nginx (recomendado)
    ├── docker-compose.nginx.yml        # Orquestación con Nginx
    ├── nginx.conf                      # Configuración Nginx
    └── build-and-run.sh                # Script helper para build
```

## 🚀 Opciones de Deploy

### Opción 1: HTTP-Server (Simple)

**Características:**
- Ligero y simple
- Ideal para desarrollo/testing
- Node.js como servidor

**Comandos:**

```bash
# Con docker-compose
docker-compose up -d

# O manual
docker build -t wwatch:latest .
docker run -d -p 3000:3000 wwatch:latest
```

**URL:** http://localhost:3000

---

### Opción 2: Nginx (Recomendado para Producción)

**Características:**
- Ultra-optimizado
- Mejor performance
- Compresión gzip automática
- Headers de seguridad incluidos

**Comandos:**

```bash
# Con docker-compose
docker-compose -f docker/docker-compose.nginx.yml up -d

# O manual
docker build -f docker/Dockerfile.nginx -t wwatch:latest .
docker run -d -p 3000:80 wwatch:latest
```

**URL:** http://localhost:3000

---

## 🐳 Comandos Comunes

### Build
```bash
# HTTP-Server
docker build -t wwatch:latest .

# Nginx
docker build -f docker/Dockerfile.nginx -t wwatch:latest .
```

### Run
```bash
# Interactivo
docker run -it -p 3000:3000 wwatch:latest

# Background
docker run -d --name wwatch-app -p 3000:3000 wwatch:latest
```

### Gestión de Contenedores
```bash
# Ver logs
docker logs -f wwatch-app

# Detener
docker stop wwatch-app

# Reiniciar
docker restart wwatch-app

# Eliminar
docker rm -f wwatch-app
```

### Docker Compose
```bash
# Levantar
docker-compose up -d

# Bajar
docker-compose down

# Logs
docker-compose logs -f wwatch
```

---

## 🔧 EasyPanel Integration

### En EasyPanel:

1. **Create Service**
   - Type: Docker Image
   - Name: `wwatch`
   - Image: `wwatch:latest`

2. **Build Settings**
   - Dockerfile: `Dockerfile.nginx` (recomendado)
   - Build Context: `.`

3. **Port Mapping**
   - Container Port: `80` (Nginx) o `3000` (HTTP-Server)
   - Host Port: `3000` o tu puerto deseado

4. **Environment**
   - NODE_ENV: `production`

5. **Restart Policy**
   - Unless-stopped

---

## 📊 Comparativa

| Aspecto | HTTP-Server | Nginx |
|---------|------------|-------|
| Tamaño imagen | ~180MB | ~30MB |
| Performance | Media | Alta ⭐ |
| Compresión | No | Sí (gzip) |
| Seguridad | Básica | Headers incluidos |
| Configuración | Simple | Flexible |
| Producción | No recomendado | ✅ Recomendado |

---

## ⚡ Optimizaciones Incluidas

### Nginx (`docker/Dockerfile.nginx`)
- ✅ Multi-stage build (reduce tamaño final)
- ✅ Alpine Linux (imagen base pequeña)
- ✅ Compresión gzip
- ✅ Cache headers para assets
- ✅ Routing Angular SPA (`try_files`)
- ✅ Headers de seguridad CSP, X-Frame-Options, etc.
- ✅ Health checks integrados

### HTTP-Server (`Dockerfile`)
- ✅ Multi-stage build
- ✅ Alpine Linux
- ✅ Health checks integrados

---

## 🐛 Troubleshooting

**Error: Port already in use**
```bash
docker stop $(docker ps -q)
# o cambiar puerto en docker-compose.yml
```

**Error: Build fails**
```bash
# Limpiar cache
docker system prune -a
# Reintentar
docker build -t wwatch:latest .
```

**App no responde**
```bash
# Revisar logs
docker logs wwatch-app
# Revisar contenedor está corriendo
docker ps
```

---

## 📝 Notas

- **API Keys:** Las variables sensibles deben manejarse con Docker secrets o environment variables
- **CORS:** Si tienes problemas con CORS, revisa `docker/nginx.conf`
- **Performance:** Nginx es ~5x más rápido que HTTP-Server para archivos estáticos
- **Actualizar código:** Rebuilda la imagen después de cambios (`docker build`)

