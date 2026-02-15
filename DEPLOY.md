# Despliegue automático a producción

Cada vez que hagas **push a la rama `main`**, la aplicación se construye y se publica sola. No tienes que desplegar a mano.

## Primera vez: conectar con GitHub

1. **Crea un repositorio en GitHub** (por ejemplo `empresarial`).

2. **Inicializa Git en este proyecto** (si aún no lo hiciste):
   ```bash
   git init
   git add .
   git commit -m "Panel empresarial inicial"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/empresarial.git
   git push -u origin main
   ```
   Sustituye `TU_USUARIO` y `empresarial` por tu usuario y nombre del repo.

3. **Activa GitHub Pages** en el repositorio:
   - Ve a **Settings** → **Pages**.
   - En **Source** elige **GitHub Actions**.

4. **Espera al primer workflow**: tras el primer `git push`, en la pestaña **Actions** se ejecutará “Deploy to GitHub Pages”. Cuando termine en verde, la web estará en:
   ```
   https://TU_USUARIO.github.io/empresarial/
   ```

## Uso diario

- Haz tus cambios en el código.
- Haz commit y push a `main`:
  ```bash
  git add .
  git commit -m "Descripción del cambio"
  git push
  ```
- En unos minutos la versión nueva estará publicada. No hace falta hacer nada más.

## Despliegue manual (opcional)

En GitHub: **Actions** → workflow **Deploy to GitHub Pages** → **Run workflow**. Útil si quieres volver a publicar sin hacer un nuevo commit.
