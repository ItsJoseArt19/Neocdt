# NeoCDT - Banking Module

Un sistema completo de gestión bancaria con autenticación y CRUD para Certificados de Depósito a Término (CDT).

## 🚀 Características

- **Backend:** FastAPI con SQLAlchemy y Alembic
- **Frontend:** React con TypeScript
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT Tokens
- **Containerización:** Docker & Docker Compose
- **Testing:** Pytest (backend) y Jest (frontend)

## 📁 Estructura del Proyecto

```
Neocdt/
├── backend/           # API FastAPI
│   ├── app/          # Código principal de la aplicación
│   ├── alembic/      # Migraciones de base de datos
│   └── tests/        # Tests del backend
├── frontend/         # Aplicación React
│   ├── src/          # Código fuente del frontend
│   └── public/       # Archivos estáticos
├── infrastructure/   # Docker Compose y configuración
├── docs/            # Documentación
└── README.md
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local del frontend)
- Python 3.11+ (para desarrollo local del backend)

### Configuración con Docker (Recomendado)

1. Clona el repositorio:
```bash
git clone https://github.com/ItsJoseArt19/Neocdt.git
cd Neocdt
```

2. Configura las variables de entorno:
```bash
cp infrastructure/.env.example infrastructure/.env
```

3. Inicia los servicios:
```bash
docker-compose -f infrastructure/docker-compose.yml up -d
```

4. Ejecuta las migraciones:
```bash
docker-compose -f infrastructure/docker-compose.yml exec backend alembic upgrade head
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs

### Desarrollo Local

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📚 Documentación

- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Frontend Components](docs/frontend.md)
- [Deployment Guide](docs/deployment.md)

## 🔒 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:

1. **Registro/Login:** `/auth/register` y `/auth/login`
2. **Token refresh:** `/auth/refresh`
3. **Protección de rutas:** Middleware de autenticación

## 🏦 Funcionalidades CDT

- **Crear solicitud CDT:** Monto, plazo, tasa de interés
- **Consultar CDTs:** Lista paginada con filtros
- **Actualizar CDT:** Modificar datos de solicitudes
- **Eliminar CDT:** Cancelar solicitudes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Jose Miguel Galeano Serna**
- GitHub: [@ItsJoseArt19](https://github.com/ItsJoseArt19)

---

**NeoCDT** - Sistema moderno de gestión bancaria 🏦
