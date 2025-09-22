# Database Schema - NeoCDT

## Entities Overview

El sistema NeoCDT maneja dos entidades principales:
- **Users**: Usuarios del sistema
- **CDT Applications**: Solicitudes de Certificados de Depósito a Término

## Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    full_name VARCHAR NOT NULL,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);
```

### Fields Description

- `id`: Primary key, auto-incrementing
- `email`: Email único del usuario
- `username`: Nombre de usuario único
- `full_name`: Nombre completo del usuario
- `hashed_password`: Contraseña hasheada con bcrypt
- `is_active`: Estado activo del usuario
- `is_superuser`: Indica si es superusuario
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

### Indexes

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

## CDT Applications Table

```sql
CREATE TABLE cdt_applications (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id),
    amount NUMERIC(15, 2) NOT NULL,
    term_days INTEGER NOT NULL,
    interest_rate NUMERIC(5, 4) NOT NULL,
    status VARCHAR DEFAULT 'pending',
    application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approval_date TIMESTAMP WITH TIME ZONE,
    maturity_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);
```

### Fields Description

- `id`: Primary key, auto-incrementing
- `owner_id`: Foreign key referencing users.id
- `amount`: Monto del CDT (máximo 15 dígitos, 2 decimales)
- `term_days`: Plazo en días del CDT
- `interest_rate`: Tasa de interés anual (máximo 5 dígitos, 4 decimales)
- `status`: Estado de la solicitud ('pending', 'approved', 'rejected', 'completed')
- `application_date`: Fecha de solicitud
- `approval_date`: Fecha de aprobación (nullable)
- `maturity_date`: Fecha de vencimiento (nullable)
- `notes`: Notas adicionales
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

### Indexes

```sql
CREATE INDEX idx_cdt_applications_owner_id ON cdt_applications(owner_id);
CREATE INDEX idx_cdt_applications_status ON cdt_applications(status);
CREATE INDEX idx_cdt_applications_application_date ON cdt_applications(application_date);
```

### Constraints

```sql
-- Amount must be positive
ALTER TABLE cdt_applications ADD CONSTRAINT chk_amount_positive CHECK (amount > 0);

-- Term days must be at least 30
ALTER TABLE cdt_applications ADD CONSTRAINT chk_term_days_minimum CHECK (term_days >= 30);

-- Interest rate must be positive
ALTER TABLE cdt_applications ADD CONSTRAINT chk_interest_rate_positive CHECK (interest_rate > 0);

-- Status must be one of the allowed values
ALTER TABLE cdt_applications ADD CONSTRAINT chk_status_valid 
CHECK (status IN ('pending', 'approved', 'rejected', 'completed'));
```

## Relationships

```
users ||--o{ cdt_applications : "one-to-many"
```

Un usuario puede tener múltiples solicitudes de CDT, pero cada solicitud pertenece a un solo usuario.

## Data Types

### PostgreSQL Types Used

- `SERIAL`: Auto-incrementing integer
- `VARCHAR`: Variable-length string
- `NUMERIC(p,s)`: Exact numeric with precision p and scale s
- `INTEGER`: 32-bit integer
- `BOOLEAN`: True/false value
- `TIMESTAMP WITH TIME ZONE`: Date and time with timezone
- `TEXT`: Variable-length text

### Business Rules

1. **Users**:
   - Email debe ser único en el sistema
   - Username debe ser único en el sistema
   - Contraseña debe ser hasheada antes de almacenarse

2. **CDT Applications**:
   - Monto mínimo: $100,000 COP
   - Plazo mínimo: 30 días
   - Tasa de interés debe ser positiva
   - Estados válidos: 'pending', 'approved', 'rejected', 'completed'
   - Solo el propietario puede ver/modificar sus CDTs

3. **Timestamps**:
   - Todos los timestamps incluyen timezone
   - `created_at` se establece automáticamente
   - `updated_at` se actualiza en cada modificación

## Migration Strategy

Las migraciones se manejan con Alembic:

```bash
# Generar nueva migración
alembic revision --autogenerate -m "description"

# Aplicar migraciones
alembic upgrade head

# Revertir migración
alembic downgrade -1
```