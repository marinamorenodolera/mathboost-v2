# 🔧 CONFIGURACIÓN MCP SUPABASE - PROYECTO EXISTENTE

## ✅ DETECTADO: Ya tienes un proyecto Supabase configurado

El sistema detectó que ya existe `NEXT_PUBLIC_SUPABASE_URL` en tu entorno.

## 📋 PASOS PARA COMPLETAR CONFIGURACIÓN MCP:

### 1. **Obtener Project Reference**
Tu Project Reference está en tu URL de Supabase:
- Si tu URL es: `https://abcdefghijkl.supabase.co`
- Tu project-ref es: `abcdefghijkl`

### 2. **Generar Personal Access Token**
1. Ve a: https://supabase.com/dashboard/account/tokens
2. Clic en "Generate new token"
3. Nombre: "mathboost-cursor-mcp"
4. Copia el token (solo se muestra una vez)

### 3. **Actualizar MCP**
Edita `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=TU_PROJECT_REF_AQUI"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "TU_PERSONAL_ACCESS_TOKEN_AQUI"
      }
    }
  }
}
```

### 4. **Reiniciar Cursor**
Después de actualizar el archivo, reinicia Cursor completamente.

## 🔍 VERIFICAR VARIABLES DE ENTORNO

Si necesitas las variables de tu proyecto:

1. Ve a: https://supabase.com/dashboard/project/TU_PROJECT_REF/settings/api
2. Ahí encontrarás:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (para server-side)

## 📝 CREAR ARCHIVO .env.local

Si aún no tienes el archivo `.env.local`, créalo con:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

## ✅ VERIFICACIÓN FINAL

Una vez configurado, las herramientas MCP de Supabase estarán disponibles en Cursor para:
- Gestionar tablas
- Ejecutar migraciones
- Configurar RLS
- Y más operaciones directamente desde el IDE