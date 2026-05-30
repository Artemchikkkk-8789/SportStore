# SportStore

## PostgreSQL для backend

Запустити PostgreSQL:

```powershell
docker compose up -d
```

Запустити backend з PostgreSQL:

```powershell
cd backend
$env:DB_URL="jdbc:postgresql://localhost:5432/sportstore"
$env:DB_USERNAME="sportstore"
$env:DB_PASSWORD="sportstore123"
$env:SPRING_PROFILES_ACTIVE="postgres"
mvn spring-boot:run
```

Якщо `DB_URL`, `DB_USERNAME` і `DB_PASSWORD` не задані, backend автоматично запускається з H2 fallback:

```powershell
cd backend
mvn spring-boot:run
```
