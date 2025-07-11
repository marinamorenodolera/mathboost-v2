# 🔧 CONFIGURACIÓN SUPABASE MCP - INSTRUCCIONES

## ✅ ARCHIVO MCP CREADO
El archivo `.cursor/mcp.json` ha sido creado con la estructura correcta.

## 📋 PASOS PENDIENTES (DEBES COMPLETAR):

### 1. **Crear/Verificar Proyecto Supabase**
- Ve a: https://supabase.com/dashboard
- Crea un nuevo proyecto llamado "mathboost" (o usa uno existente)
- Anota el **Project Reference ID** (aparece en la URL y en Project Settings)

### 2. **Generar Personal Access Token**
- Ve a: https://supabase.com/dashboard/account/tokens
- Clic en "Generate new token"
- Nombre: "mathboost-cursor-mcp"
- Copia el token generado (solo se muestra una vez)

### 3. **Actualizar archivo MCP**
Edita el archivo `.cursor/mcp.json` y reemplaza:

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
        "SUPABASE_ACCESS_TOKEN": "TU_ACCESS_TOKEN_AQUI"
      }
    }
  }
}
```

### 4. **Reiniciar Cursor**
- Cierra completamente Cursor
- Abre Cursor de nuevo
- El MCP de Supabase debería estar disponible

### 5. **Verificar Configuración**
- En Cursor, abre el chat
- Deberías ver herramientas de Supabase disponibles
- Puedes probar con: "Lista las tablas de mi proyecto Supabase"

## 🚨 IMPORTANTE
- NO commitees el archivo `.cursor/mcp.json` con tokens reales
- Agrega `.cursor/` al `.gitignore` si planeas hacer commit

## 📝 EJEMPLO DE .gitignore
```
# Cursor MCP configuration (contains secrets)
.cursor/
```

---
**Una vez completados estos pasos, el MCP de Supabase estará listo para usar en Cursor.**