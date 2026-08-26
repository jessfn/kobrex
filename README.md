# Kobrex

Gestor de clientes, proyectos, contratos y facturas para freelancers y agencias pequeñas.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS (tema rojo maximalista, 100% responsivo)
- Prisma + PostgreSQL
- NextAuth (Credentials)
- `@react-pdf/renderer` para facturas y contratos en PDF
- Resend para recordatorios por email

## Desarrollo local

```bash
npm install
cp .env.example .env   # completa DATABASE_URL, NEXTAUTH_SECRET, etc.
npx prisma migrate dev
npm run dev
```

## Despliegue en el VPS

1. Clonar en `/var/www/kobrex`
2. Crear `.env` en el servidor con las variables reales (nunca commitear este archivo)
3. Crear la base de datos en Postgres: `CREATE DATABASE kobrex OWNER jesus;`
4. Ejecutar `bash deploy.sh` (hace `git pull`, `npm ci`, migraciones, build y reinicio con PM2)
5. Nginx debe hacer proxy de `kobrex.geodatos.com.mx` hacia `localhost:14400`

### Recordatorios de facturas (cron del sistema)

El endpoint `GET /api/cron/reminders` revisa facturas por vencer (próximos 3 días) y vencidas, envía
email al cliente y marca como `OVERDUE` las que ya vencieron. Está protegido con `CRON_SECRET`.

Agregar en el crontab del VPS (`crontab -e`), una vez al día:

```
0 9 * * * curl -s -H "Authorization: Bearer TU_CRON_SECRET" https://kobrex.geodatos.com.mx/api/cron/reminders
```
