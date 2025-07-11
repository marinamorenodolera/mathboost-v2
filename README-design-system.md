# 📋 MATHBOOST DESIGN SYSTEM - DOCUMENTACIÓN

## 🎯 ESTADO ACTUAL
Este documento describe el **branding perfecto** que está funcionando actualmente, sin modificar el código existente.

---

## 🎨 ANÁLISIS VISUAL COMPLETO

### WELCOME SCREEN (Pantalla Principal)

#### 🔥 **Elementos que funcionan perfectamente:**

**1. Header Superior**
```jsx
// UBICACIÓN: MathBoost.jsx - NavigationHeader component
// CLASES OBSERVADAS: 
className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-black/5"

// TOKENS EXTRAÍDOS:
--mathboost-glass-bg: rgba(255, 255, 255, 0.85)
--mathboost-glass-backdrop: blur(12px) saturate(200%)
--mathboost-border: rgba(0, 0, 0, 0.05)
```

**2. Título Principal**
```jsx
// UBICACIÓN: WelcomeScreen - título "mathboost"
// CLASES OBSERVADAS:
className="text-4xl md:text-6xl font-light tracking-wider mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"

// TOKENS EXTRAÍDOS:
--mathboost-font-display: 'Inter', -apple-system, sans-serif
--mathboost-font-light: 300
--mathboost-gradient-title: linear-gradient(to right, #111827, #4B5563)
```

**3. Avatar Section**
```jsx
// UBICACIÓN: WelcomeScreen - emoji user
// CLASES OBSERVADAS:
className="mb-6 text-6xl animate-bounce hover:scale-110 transition-transform duration-300"

// TOKENS EXTRAÍDOS:
--mathboost-text-6xl: 3.75rem
--mathboost-scale-icon-hover: 1.10
--mathboost-duration-fast: 300ms
```

**4. Botón Principal (🚀 comenzar entrenamiento)**
```jsx
// UBICACIÓN: WelcomeScreen - botón principal
// CLASES OBSERVADAS:
className="group px-12 py-6 text-2xl font-medium rounded-3xl transition-all duration-500 hover:scale-105 active:scale-95 mb-4 shadow-2xl bg-white/85 backdrop-blur-xl border border-black/5 hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20"

// ESTILOS INLINE CRÍTICOS:
style={{
  background: linear-gradient(135deg, #DBEAFE, #EDE9FE),
  color: #0F172A,
  fontFamily: 'Inter, -apple-system, sans-serif',
  border: '2px solid rgba(59, 130, 246, 0.2)'
}}

// TOKENS EXTRAÍDOS:
--mathboost-gradient-primary-light: linear-gradient(135deg, #DBEAFE, #EDE9FE)
--mathboost-radius-3xl: 1.75rem
--mathboost-padding-button-lg: 3rem 1.5rem
--mathboost-text-2xl: 1.5rem
--mathboost-scale-hover: 1.05
--mathboost-scale-active: 0.95
```

**5. Botón Secundario (👥 Cambiar usuario)**
```jsx
// UBICACIÓN: WelcomeScreen - botón secundario
// CLASES OBSERVADAS:
className="group flex items-center gap-3 px-8 py-3 text-lg font-light rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95"

// TOKENS EXTRAÍDOS:
--mathboost-text-lg: 1.125rem
--mathboost-radius-2xl: 1.5rem
```

**6. Cards de Progreso (Glassmorphism Perfecto)**
```jsx
// UBICACIÓN: WelcomeScreen - cards "Problemas semanales" y "Velocidad objetivo"
// CLASES OBSERVADAS:
className="group p-6 mb-8 rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20"

// TOKENS EXTRAÍDOS - GLASS EFFECT PERFECTO:
--mathboost-glass-bg: rgba(255, 255, 255, 0.85)
--mathboost-glass-backdrop: blur(12px) saturate(200%)
--mathboost-glass-border: 1px solid rgba(0, 0, 0, 0.05)
--mathboost-glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.08)

// HOVER EFFECT:
--mathboost-glass-hover-bg: rgba(255, 255, 255, 0.95)
--mathboost-glass-hover-backdrop: blur(16px) saturate(220%)
--mathboost-glass-hover-border: 1px solid rgba(59, 130, 246, 0.2)
--mathboost-glass-hover-shadow: 0 12px 48px rgba(0, 0, 0, 0.12)
```

**7. Progress Bars (Gradientes Hermosos)**
```jsx
// UBICACIÓN: Cards de progreso - barras azul y verde
// CLASES OBSERVADAS AZUL:
className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"

// CLASES OBSERVADAS VERDE:
className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"

// TOKENS EXTRAÍDOS:
--mathboost-gradient-blue: linear-gradient(to right, #60A5FA, #2563EB)
--mathboost-gradient-green: linear-gradient(to right, #4ADE80, #16A34A)
--mathboost-duration-slow: 1000ms
--mathboost-radius-full: 9999px
```

**8. Stats Grid (4 cards pequeñas)**
```jsx
// UBICACIÓN: WelcomeScreen - grid 2x2 con iconos y números
// CLASES OBSERVADAS:
className="grid grid-cols-2 md:grid-cols-4 gap-6"

// CARD INDIVIDUAL:
className="group p-6 rounded-2xl text-center transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer bg-white/85 backdrop-blur-xl border border-black/5 shadow-lg hover:bg-white/95 hover:backdrop-blur-2xl hover:shadow-xl hover:border-blue-500/20"

// NÚMEROS EN SERIF:
style={{ fontFamily: 'Georgia, serif' }}
```

---

### GAME SCREEN (Pantalla de Juego)

**1. Problema Matemático (Tipografía Impresionante)**
```jsx
// UBICACIÓN: GameScreen - números del problema
// CLASES OBSERVADAS:
className="text-9xl font-light mb-12 tracking-wider animate-pulse"

// ESTILOS INLINE CRÍTICOS:
style={{ 
  color: #0F172A, 
  fontFamily: 'Georgia, serif',
  animationDuration: '3s',
  animationIterationCount: '1',
  textShadow: '0 4px 20px rgba(0, 0, 0, 0.12)'
}}

// TOKENS EXTRAÍDOS:
--mathboost-text-9xl: 8rem
--mathboost-font-math: 'Georgia', 'Times New Roman', serif
--mathboost-font-light: 300
--mathboost-text-shadow-problem: 0 4px 20px rgba(0, 0, 0, 0.12)
--mathboost-duration-pulse: 3s
```

**2. Línea Separadora**
```jsx
// UBICACIÓN: GameScreen - línea bajo el problema
// CLASES OBSERVADAS:
className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-gray-300 to-transparent"

// TOKENS EXTRAÍDOS:
--mathboost-gradient-divider: linear-gradient(to right, transparent, #D1D5DB, transparent)
```

**3. Área de Respuesta con Estados**
```jsx
// UBICACIÓN: GameScreen - respuesta del usuario
// CLASES OBSERVADAS BASE:
className="relative text-9xl font-light min-h-[160px] flex items-center justify-center transition-all duration-500"

// ESTADOS DE FEEDBACK:
// CORRECTO: scale-110 + color: #059669 + textShadow: '0 8px 32px #ECFDF5'
// INCORRECTO: scale-90 + color: #DC2626 + textShadow: '0 8px 32px #FEF2F2'

// TOKENS EXTRAÍDOS:
--mathboost-scale-feedback: 1.10
--mathboost-scale-feedback-error: 0.90
--mathboost-success-text: #059669
--mathboost-error-text: #DC2626
--mathboost-text-shadow-feedback-success: 0 8px 32px #ECFDF5
--mathboost-text-shadow-feedback-error: 0 8px 32px #FEF2F2
```

**4. Barra de Progreso de Respuesta**
```jsx
// UBICACIÓN: GameScreen - barra pequeña bajo la respuesta
// CLASES OBSERVADAS:
className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-2 overflow-hidden rounded-full"
// CONTENIDO:
className="h-full transition-all duration-500 bg-gradient-to-r from-blue-400 to-green-400"

// TOKENS EXTRAÍDOS:
--mathboost-gradient-progress: linear-gradient(to right, #60A5FA, #4ADE80)
```

**5. Sparkle Effect (✨)**
```jsx
// UBICACIÓN: GameScreen - efecto de confeti en respuestas correctas
// CLASES OBSERVADAS:
className="absolute top-4 right-4 pointer-events-none transition-all duration-500 opacity-100 scale-100 text-4xl animate-bounce"

// TOKENS EXTRAÍDOS:
--mathboost-text-4xl: 2.25rem
```

---

## 🎯 MAPEO DE COMPONENTES EXISTENTES

### ✅ CLASES CSS QUE FUNCIONAN PERFECTAMENTE:

```css
/* GLASSMORPHISM - NO TOCAR */
.bg-white/85.backdrop-blur-xl.border.border-black/5.shadow-lg

/* HOVER GLASSMORPHISM - NO TOCAR */
.hover\\:bg-white/95.hover\\:backdrop-blur-2xl.hover\\:shadow-xl.hover\\:border-blue-500/20

/* BOTONES PRINCIPALES - NO TOCAR */
.px-12.py-6.text-2xl.font-medium.rounded-3xl.transition-all.duration-500.hover\\:scale-105.active\\:scale-95

/* BOTONES SETUP - NO TOCAR */
.p-10.text-center.rounded-2xl.transition-all.duration-500.hover\\:scale-105.active\\:scale-95

/* PROBLEMAS MATEMÁTICOS - NO TOCAR */
.text-9xl.font-light.mb-12.tracking-wider.animate-pulse

/* CARDS DE PROGRESO - NO TOCAR */
.p-6.rounded-2xl.transition-all.duration-500.hover\\:scale-105.active\\:scale-95.cursor-pointer

/* PROGRESS BARS - NO TOCAR */
.h-full.bg-gradient-to-r.from-blue-400.to-blue-600.rounded-full.transition-all.duration-1000
.h-full.bg-gradient-to-r.from-green-400.to-green-600.rounded-full.transition-all.duration-1000
```

---

## 🚨 REGLAS CRÍTICAS

### ❌ NUNCA MODIFICAR:
1. **Liquid Glass Effects** - `backdrop-blur-xl` + `bg-white/85`
2. **Georgia Serif** - Para números y problemas matemáticos
3. **Gradientes específicos** - `from-blue-400 to-blue-600`, etc.
4. **Hover scales** - `hover:scale-105` en botones
5. **Durations** - `duration-500`, `duration-1000` para animaciones
6. **Border radius** - `rounded-2xl`, `rounded-3xl` específicos
7. **Padding específico** - `px-12 py-6` en botón principal

### ✅ TOKENS DISPONIBLES PARA USO FUTURO:
- Variables CSS en `mathboost-design-system.css`
- Documentación de cada componente
- Mapeo completo de estilos funcionando

---

## 📝 PRÓXIMOS PASOS (SIN TOCAR CÓDIGO)

1. **Crear utility classes** que mapeen exactamente a los estilos existentes
2. **Crear component classes** como `.mathboost-card` = `.p-6.rounded-2xl.bg-white/85...`
3. **Refactoring incremental** - reemplazar solo cuando esté 100% verificado
4. **Testing visual** - comparar pixel por pixel antes de cualquier cambio

---

## 🎨 PALETA DE COLORES EXACTA

```css
:root {
  /* BASE */
  --background: #FFFFFF;
  --surface: #F8FAFC;
  --text: #0F172A;
  --text-secondary: #64748B;
  
  /* BRAND */
  --primary: #3B82F6;
  --primary-light: #DBEAFE;
  --secondary: #8B5CF6;
  --secondary-light: #EDE9FE;
  
  /* STATUS */
  --success: #ECFDF5;
  --success-text: #059669;
  --error: #FEF2F2;
  --error-text: #DC2626;
  
  /* GLASS */
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(0, 0, 0, 0.05);
  --glass-shadow: rgba(0, 0, 0, 0.08);
}
```

---

**🎯 OBJETIVO:** Mantener el branding perfecto mientras creamos un sistema escalable para el futuro.