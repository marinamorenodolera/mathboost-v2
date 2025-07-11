/**
 * ESLINT CONFIGURATION - MATHBOOST PROTECTOR
 * ==========================================
 * 
 * Reglas defensivas para proteger el branding perfecto
 * Modo LEARNING: educativo, no bloqueante
 */

module.exports = {
  extends: ['next/core-web-vitals'],
  
  plugins: ['mathboost-protector'],
  
  rules: {
    // MODO LEARNING - Solo warnings, no errors
    'mathboost-protector/protect-glassmorphism': 'warn',
    'mathboost-protector/protect-georgia-serif': 'warn', 
    'mathboost-protector/protect-gradients': 'warn',
    'mathboost-protector/suggest-design-tokens': 'warn',
    'mathboost-protector/accessibility-check': 'warn'
  },

  overrides: [
    {
      // ARCHIVOS PROTEGIDOS - Solo warnings suaves
      files: [
        'components/MathBoost.jsx',
        'app/globals.css'
      ],
      rules: {
        'mathboost-protector/protect-glassmorphism': 'warn',
        'mathboost-protector/protect-georgia-serif': 'warn',
        'mathboost-protector/protect-gradients': 'warn',
        // Deshabilitar reglas estrictas en archivos protegidos
        'mathboost-protector/require-design-tokens': 'off'
      }
    },
    {
      // ARCHIVOS NUEVOS - Reglas más estrictas pero no bloqueantes
      files: [
        'components/**/*.{js,jsx,ts,tsx}',
        'app/**/*.{js,jsx,ts,tsx}',
        '!components/MathBoost.jsx',
        '!app/globals.css'
      ],
      rules: {
        'mathboost-protector/suggest-design-tokens': 'warn',
        'mathboost-protector/prefer-components': 'warn',
        'mathboost-protector/accessibility-check': 'warn'
      }
    }
  ],

  settings: {
    'mathboost-protector': {
      // Configuración del protector
      mode: 'learning',
      protectedClasses: [
        // Glassmorphism crítico
        'bg-white/85',
        'backdrop-blur-xl',
        'border-black/5',
        'shadow-lg',
        'hover:bg-white/95',
        'hover:backdrop-blur-2xl',
        'hover:shadow-xl',
        'hover:border-blue-500/20',
        
        // Typography crítica
        'text-9xl',
        'font-light',
        'tracking-wider',
        
        // Animaciones críticas
        'hover:scale-105',
        'active:scale-95',
        'transition-all',
        'duration-500',
        'duration-1000',
        
        // Gradientes críticos
        'from-blue-400',
        'to-blue-600',
        'from-green-400', 
        'to-green-600',
        'bg-gradient-to-r',
        
        // Spacing crítico
        'px-12',
        'py-6',
        'p-10',
        'p-6',
        'rounded-2xl',
        'rounded-3xl'
      ],
      
      criticalInlineStyles: {
        fontFamily: ['Georgia, serif'],
        background: ['linear-gradient(135deg, #DBEAFE, #EDE9FE)'],
        backdropFilter: ['blur(12px) saturate(200%)'],
        textShadow: ['0 4px 20px rgba(0, 0, 0, 0.12)']
      },
      
      designTokens: {
        prefix: '--mathboost-',
        suggest: true,
        severity: 'warn'
      },
      
      opportunities: {
        accessibility: true,
        componentExtraction: true,
        designTokenUsage: true
      }
    }
  }
};

// Plugin personalizado para MathBoost Protector
const mathboostProtectorPlugin = {
  meta: {
    name: 'mathboost-protector',
    version: '1.0.0'
  },
  
  rules: {
    'protect-glassmorphism': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Protege las clases de glassmorphism que funcionan perfectamente'
        },
        messages: {
          protectedClass: '🛡️ Clase protegida: {{className}} forma parte del branding perfecto',
          modifyingGlass: '⚠️ Modificando glassmorphism funcional - revisar impacto visual'
        }
      },
      create(context) {
        const settings = context.settings['mathboost-protector'] || {};
        const protectedClasses = settings.protectedClasses || [];
        
        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              const classNames = node.value.split(' ');
              classNames.forEach(className => {
                if (protectedClasses.includes(className)) {
                  context.report({
                    node,
                    messageId: 'protectedClass',
                    data: { className }
                  });
                }
              });
            }
          }
        };
      }
    },
    
    'protect-georgia-serif': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Protege la tipografía Georgia serif en problemas matemáticos'
        },
        messages: {
          georgiaSerif: '🚨 Georgia serif es crítica para problemas matemáticos - NO modificar'
        }
      },
      create(context) {
        return {
          Property(node) {
            if (node.key && node.key.name === 'fontFamily' && 
                node.value && node.value.value && 
                node.value.value.includes('Georgia')) {
              context.report({
                node,
                messageId: 'georgiaSerif'
              });
            }
          }
        };
      }
    },
    
    'suggest-design-tokens': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Sugiere uso de design tokens en lugar de valores hardcodeados'
        },
        messages: {
          useToken: '💡 Considera usar var(--mathboost-{{token}}) en lugar de {{value}}'
        }
      },
      create(context) {
        const colorPattern = /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/;
        
        return {
          Literal(node) {
            if (typeof node.value === 'string' && colorPattern.test(node.value)) {
              context.report({
                node,
                messageId: 'useToken',
                data: { 
                  value: node.value,
                  token: 'primary' // Simplificado para ejemplo
                }
              });
            }
          }
        };
      }
    }
  }
};

// Exportar el plugin también
module.exports.plugins = {
  'mathboost-protector': mathboostProtectorPlugin
};