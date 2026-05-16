# Google Cloud desde cero

## Objetivo

Levantar este sitio en un proyecto nuevo de Google Cloud, desplegarlo en Cloud Run y dejar listo el dominio `politicamoderna.info` sobre un balanceador HTTPS productivo.

## Archivos nuevos para este flujo

- `config/gcp.env.example`
- `config/cloudrun.env.example.yaml`
- `scripts/gcp-bootstrap.sh`
- `scripts/deploy-cloud-run.sh`
- `scripts/setup-load-balancer.sh`

## 1. Prepara tu configuracion local

```bash
cp config/gcp.env.example config/gcp.env
cp config/cloudrun.env.example.yaml config/cloudrun.env.yaml
```

## 2. Completa `config/gcp.env`

Valores minimos:

- `PROJECT_ID`
- `PROJECT_NAME`
- `BILLING_ACCOUNT_ID`
- `DOMAIN_NAME=politicamoderna.info`
- `WWW_DOMAIN_NAME=www.politicamoderna.info`
- `REGION=us-central1`
- `SERVICE_NAME=politicamoderna-web`

Si tu dominio tambien usa Cloud DNS en ese proyecto:

- `DNS_ZONE_NAME`
- `CREATE_DNS_ZONE=true` si la zona todavia no existe
- `UPSERT_DNS_RECORDS=true` si quieres que el script publique los `A` records

## 3. Completa `config/cloudrun.env.yaml`

Minimo recomendado:

- `NEXT_PUBLIC_SITE_URL=https://politicamoderna.info`
- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_WRITE_TOKEN`
- `REVALIDATE_SECRET`

## 4. Autenticate `gcloud`

```bash
gcloud auth login
```

Si vas a crear proyecto o tocar billing, la cuenta necesita permisos suficientes.

## 5. Bootstrap del proyecto

```bash
./scripts/gcp-bootstrap.sh
```

Este script:

- usa una configuracion local de `gcloud` dentro del repo
- crea el proyecto si no existe
- enlaza billing si diste `BILLING_ACCOUNT_ID`
- habilita APIs necesarias
- crea el repositorio de Artifact Registry
- opcionalmente crea la zona de Cloud DNS

## 6. Primer despliegue a Cloud Run

```bash
./scripts/deploy-cloud-run.sh
```

Este script despliega desde el codigo fuente del repo con:

- `gcloud run deploy --source .`
- variables cargadas desde `config/cloudrun.env.yaml`
- configuracion base de CPU, memoria e instancias

Al final imprime la URL temporal de `run.app`.

## 7. Configura el balanceador HTTPS y el dominio

```bash
./scripts/setup-load-balancer.sh
```

Este script:

- reserva una IP global estatica
- crea un serverless NEG para el servicio de Cloud Run
- crea el backend service
- crea el URL map HTTPS
- crea el certificado administrado por Google
- crea el target HTTPS proxy y la forwarding rule en `443`
- crea el redirect HTTP -> HTTPS en `80`
- si `UPSERT_DNS_RECORDS=true` y existe `DNS_ZONE_NAME`, publica los `A` records

## 8. Espera DNS y certificado

Despues del paso anterior:

- `politicamoderna.info` y `www.politicamoderna.info` deben apuntar a la IP global del balanceador
- el certificado administrado puede tardar varios minutos en quedar `ACTIVE`

## 9. Verificaciones finales

```bash
curl -I http://politicamoderna.info
curl -I https://politicamoderna.info
curl -I https://www.politicamoderna.info
```

Esperado:

- `http://` redirige a `https://`
- `https://www...` redirige a `https://politicamoderna.info`
- la home responde con `200`

## Notas operativas

- Los scripts usan `./.gcloud` para no depender de `~/.config/gcloud`.
- La app ahora redirige `www` al dominio canonico desde middleware, para simplificar el load balancer.
- El formulario de contacto ya puede persistir mensajes en Sanity usando `contactMessage`.
