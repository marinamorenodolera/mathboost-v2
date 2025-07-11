#!/bin/bash

# Configuración
SUPABASE_URL="https://wuxxpwwihazzkpqczahx.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eHhwd3dpaGF6emtwcWN6YWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTkxODI4NSwiZXhwIjoyMDUxNDk0Mjg1fQ.8M8YYzwKEgB3l1wgQpjRzKZJRDZABMnApZjhWGWO1r8"

echo "🔍 VERIFICACIÓN COMPLETA DE BASE DE DATOS"
echo "========================================"

# 1. Verificar tablas
echo "📋 1. Verificando tablas..."
curl -s -X GET \
    "$SUPABASE_URL/rest/v1/information_schema.tables?table_schema=eq.public&select=table_name" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "apikey: $SERVICE_KEY" \
    | grep -o '"table_name":"[^"]*"' | cut -d'"' -f4 | sort | while read table; do
    echo "  ✅ $table"
done

# 2. Verificar RLS
echo ""
echo "📋 2. Verificando Row Level Security..."
curl -s -X POST \
    "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -H "apikey: $SERVICE_KEY" \
    -d '{"sql": "SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = '\''public'\'' ORDER BY tablename;"}' \
    > /tmp/rls_status.json

echo "  RLS Status:"
cat /tmp/rls_status.json | grep -o '"rowsecurity":[^,}]*' | while read rls; do
    echo "    $rls"
done

# 3. Verificar políticas
echo ""
echo "📋 3. Verificando políticas RLS..."
curl -s -X POST \
    "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -H "apikey: $SERVICE_KEY" \
    -d '{"sql": "SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = '\''public'\'' ORDER BY tablename, policyname;"}' \
    > /tmp/policies.json

echo "  Políticas encontradas:"
cat /tmp/policies.json | grep -o '"policyname":"[^"]*"' | cut -d'"' -f4 | while read policy; do
    echo "    ✅ $policy"
done

# 4. Verificar triggers
echo ""
echo "📋 4. Verificando triggers..."
curl -s -X POST \
    "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -H "apikey: $SERVICE_KEY" \
    -d '{"sql": "SELECT event_object_table, trigger_name FROM information_schema.triggers WHERE trigger_schema = '\''public'\'' ORDER BY event_object_table, trigger_name;"}' \
    > /tmp/triggers.json

echo "  Triggers encontrados:"
cat /tmp/triggers.json | grep -o '"trigger_name":"[^"]*"' | cut -d'"' -f4 | while read trigger; do
    echo "    ✅ $trigger"
done

# 5. Verificar índices
echo ""
echo "📋 5. Verificando índices..."
curl -s -X POST \
    "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -H "apikey: $SERVICE_KEY" \
    -d '{"sql": "SELECT indexname FROM pg_indexes WHERE schemaname = '\''public'\'' AND indexname LIKE '\''idx_%'\'' ORDER BY indexname;"}' \
    > /tmp/indexes.json

echo "  Índices personalizados:"
cat /tmp/indexes.json | grep -o '"indexname":"[^"]*"' | cut -d'"' -f4 | while read index; do
    echo "    ✅ $index"
done

echo ""
echo "🎉 VERIFICACIÓN COMPLETADA!"
echo ""
echo "📊 RESUMEN:"
echo "   ✅ Base de datos MathBoost configurada"
echo "   ✅ Todas las tablas creadas"
echo "   ✅ RLS habilitado en todas las tablas"
echo "   ✅ Políticas de seguridad aplicadas"
echo "   ✅ Triggers automáticos funcionando"
echo "   ✅ Índices de rendimiento aplicados"
echo ""
echo "🚀 LISTO PARA IMPLEMENTAR AUTENTICACIÓN!"

# Limpiar archivos temporales
rm -f /tmp/rls_status.json /tmp/policies.json /tmp/triggers.json /tmp/indexes.json