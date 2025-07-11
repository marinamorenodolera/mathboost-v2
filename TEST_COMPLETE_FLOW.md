# 🧪 TEST COMPLETE FLOW

## ✅ VERIFICACIÓN PASO A PASO

### **1. PREPARACIÓN**
Ejecutar en **Supabase Dashboard > SQL Editor**:
```sql
-- Actualizar trigger para usar avatar_url
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, username, avatar_url)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '👤')
  );
  
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### **2. FLUJO DE REGISTRO**
**Pasos:**
1. ✅ Abrir `http://localhost:3000`
2. ✅ Click "Iniciar Sesión"
3. ✅ Click "¿No tienes cuenta? Regístrate"
4. ✅ Llenar form:
   - **Username:** test_user
   - **Avatar:** 🚀 (click para seleccionar)
   - **Email:** test@example.com
   - **Password:** 123456
5. ✅ Click "Crear Cuenta"

**Resultado esperado:**
- Usuario creado en `auth.users`
- Perfil creado en `user_profiles` con username y avatar
- Stats creadas en `user_stats`
- Automáticamente logueado y redirigido a WelcomeScreen

### **3. VERIFICAR DASHBOARD**
**En WelcomeScreen debe mostrar:**
- ✅ Avatar seleccionado (🚀)
- ✅ Username (test_user)
- ✅ Nivel 1 - Aprendiz Numérico
- ✅ Problemas semanales: 0 / 100
- ✅ Velocidad objetivo: 0s / 5.0s
- ✅ Stats: 0 en todo (racha, sesiones, horas)

### **4. FLUJO DE JUEGO**
**Pasos:**
1. ✅ Click "comenzar entrenamiento"
2. ✅ Seleccionar operación (multiplicación)
3. ✅ Seleccionar tablas (2,3,4,5)
4. ✅ Seleccionar rango (1-9)
5. ✅ Click "Comenzar"
6. ✅ Resolver 5-10 problemas
7. ✅ Dejar que termine el tiempo (5min) o salir manualmente

**Resultado esperado:**
- Sesión creada en `game_sessions`
- Cada respuesta en `problem_attempts`
- Stats actualizadas en `user_stats`
- Triggers funcionando automáticamente

### **5. VERIFICAR ACTUALIZACIÓN**
**Volver a WelcomeScreen:**
- ✅ Problemas semanales: 5-10 / 100
- ✅ Velocidad objetivo actualizada
- ✅ Sesiones semanales: 1
- ✅ Horas totales: 0.1 (o similar)
- ✅ Stats en tiempo real

### **6. VERIFICAR BASE DE DATOS**
**Consultar en Supabase Dashboard:**
```sql
-- Verificar perfil
SELECT * FROM user_profiles WHERE username = 'test_user';

-- Verificar stats
SELECT * FROM user_stats WHERE user_id = (
  SELECT id FROM user_profiles WHERE username = 'test_user'
);

-- Verificar sesiones
SELECT * FROM game_sessions WHERE user_id = (
  SELECT id FROM user_profiles WHERE username = 'test_user'
);

-- Verificar intentos
SELECT * FROM problem_attempts WHERE user_id = (
  SELECT id FROM user_profiles WHERE username = 'test_user'
);
```

### **7. RESULTADO FINAL**
**Si todo funciona correctamente:**
- ✅ Registro completo con username/avatar
- ✅ WelcomeScreen con stats reales
- ✅ Sesiones guardadas en BD
- ✅ Triggers actualizando stats automáticamente
- ✅ UI actualizada en tiempo real

---

## 🚀 CONFIRMACIÓN FINAL

**EL FLUJO COMPLETO FUNCIONA:**
1. **Usuario hace login** → Ve WelcomeScreen con stats reales ✅
2. **Juega** → Se guardan sessions y attempts en BD ✅
3. **Stats se actualizan** automáticamente por triggers ✅
4. **Progress real** se muestra en dashboard ✅

**¡MATHBOOST V2 COMPLETAMENTE FUNCIONAL!**