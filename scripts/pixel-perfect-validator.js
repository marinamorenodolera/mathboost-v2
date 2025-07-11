#!/usr/bin/env node

/**
 * PIXEL-PERFECT VALIDATOR - TOLERANCIA CERO
 * =========================================
 * 
 * Validación ESTRICTA del design system MathBoost
 * NO acepta aproximaciones - SOLO perfección
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class PixelPerfectValidator {
  constructor() {
    this.referenceComponents = this.loadReferenceComponents();
    this.designTokens = this.loadDesignTokens();
    this.violations = [];
    this.compliance = {
      glassmorphism: 0,
      typography: 0,
      spacing: 0,
      colors: 0,
      animations: 0,
      overall: 0
    };
    this.strictMode = true;
  }

  loadReferenceComponents() {
    return {
      // REFERENCIA: WelcomeScreen glassmorphism PERFECTO
      glassmorphismCard: {
        required: [
          'bg-white/85',
          'backdrop-blur-xl', 
          'border',
          'border-black/5',
          'shadow-lg'
        ],
        requiredHover: [
          'hover:bg-white/95',
          'hover:backdrop-blur-2xl',
          'hover:shadow-xl',
          'hover:border-blue-500/20'
        ],
        forbidden: [
          'bg-white/80',  // NO aproximaciones
          'bg-white/90',  // NO aproximaciones
          'backdrop-blur-sm',  // NO aproximaciones
          'backdrop-blur-lg',  // NO aproximaciones
          'border-gray-200',   // NO hardcoded
          'shadow-md'          // NO aproximaciones
        ]
      },

      // REFERENCIA: Botón principal PERFECTO
      primaryButton: {
        required: [
          'px-12',
          'py-6', 
          'text-2xl',
          'font-medium',
          'rounded-3xl',
          'transition-all',
          'duration-500',
          'hover:scale-105',
          'active:scale-95'
        ],
        requiredInlineStyles: {
          background: 'linear-gradient(135deg, #DBEAFE, #EDE9FE)',
          fontFamily: 'Inter, -apple-system, sans-serif'
        },
        forbidden: [
          'px-10',     // NO aproximaciones
          'px-11',     // NO aproximaciones  
          'py-4',      // NO aproximaciones
          'py-5',      // NO aproximaciones
          'text-xl',   // NO aproximaciones
          'text-3xl',  // NO aproximaciones
          'rounded-2xl', // NO aproximaciones
          'duration-300', // NO aproximaciones
          'duration-700'  // NO aproximaciones
        ]
      },

      // REFERENCIA: Typography matemática PERFECTA
      mathTypography: {
        required: [
          'text-9xl',
          'font-light', 
          'tracking-wider'
        ],
        requiredInlineStyles: {
          fontFamily: 'Georgia, serif',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.12)'
        },
        forbidden: [
          'text-8xl',    // NO aproximaciones
          'text-7xl',    // NO aproximaciones
          'font-normal', // NO aproximaciones
          'font-thin',   // NO aproximaciones
          'tracking-normal', // NO aproximaciones
          'tracking-wide'    // NO aproximaciones
        ]
      },

      // REFERENCIA: Progress bars PERFECTAS
      progressBar: {
        required: [
          'h-full',
          'bg-gradient-to-r',
          'rounded-full',
          'transition-all',
          'duration-1000'
        ],
        requiredVariants: {
          blue: ['from-blue-400', 'to-blue-600'],
          green: ['from-green-400', 'to-green-600']
        },
        forbidden: [
          'from-blue-300',  // NO aproximaciones
          'from-blue-500',  // NO aproximaciones
          'to-blue-500',    // NO aproximaciones
          'to-blue-700',    // NO aproximaciones
          'duration-500',   // NO aproximaciones
          'duration-800'    // NO aproximaciones
        ]
      }
    };
  }

  loadDesignTokens() {
    try {
      const cssContent = fs.readFileSync('mathboost-design-system.css', 'utf8');
      const tokens = {};
      
      // Extraer variables CSS
      const variableRegex = /--mathboost-([\\w-]+):\\s*([^;]+);/g;
      let match;
      while ((match = variableRegex.exec(cssContent)) !== null) {
        tokens[match[1]] = match[2].trim();
      }
      
      return tokens;
    } catch (error) {
      console.error(chalk.red('❌ FATAL: No se pudo cargar mathboost-design-system.css'));
      process.exit(1);
    }
  }

  async validateStrict(targetPath = '.') {
    console.log(chalk.red('🚨 PIXEL-PERFECT VALIDATOR - TOLERANCIA CERO'));
    console.log(chalk.red('=============================================='));
    console.log(chalk.yellow('⚠️  MODO ESTRICTO: NO acepta aproximaciones\\n'));

    await this.scanForCompliance(targetPath);
    await this.validateComponentCompliance();
    
    const passed = this.generateStrictReport();
    
    if (!passed) {
      console.log(chalk.red('\\n❌ VALIDACIÓN FALLIDA - NO está listo para producción'));
      process.exit(1);
    } else {
      console.log(chalk.green('\\n✅ VALIDACIÓN EXITOSA - Branding pixel-perfect confirmado'));
    }
  }

  async scanForCompliance(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory() && !this.shouldSkipDirectory(file.name)) {
        await this.scanForCompliance(fullPath);
      } else if (file.isFile() && this.shouldValidateFile(file.name)) {
        await this.validateFileStrictly(fullPath);
      }
    }
  }

  shouldSkipDirectory(dirname) {
    return ['node_modules', '.git', '.next', 'dist', 'build'].includes(dirname);
  }

  shouldValidateFile(filename) {
    return ['.jsx', '.js', '.tsx', '.ts'].some(ext => filename.endsWith(ext));
  }

  async validateFileStrictly(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(chalk.gray(`🔍 Validando ESTRICTAMENTE: ${filePath}`));

    // VALIDACIÓN 1: Glassmorphism EXACTO
    this.validateGlassmorphismExact(filePath, content);
    
    // VALIDACIÓN 2: Typography EXACTA  
    this.validateTypographyExact(filePath, content);
    
    // VALIDACIÓN 3: Spacing EXACTO
    this.validateSpacingExact(filePath, content);
    
    // VALIDACIÓN 4: Colors EXACTOS
    this.validateColorsExact(filePath, content);
    
    // VALIDACIÓN 5: Animations EXACTAS
    this.validateAnimationsExact(filePath, content);
    
    // VALIDACIÓN 6: NO hardcoded values
    this.validateNoHardcodedValues(filePath, content);
  }

  validateGlassmorphismExact(filePath, content) {
    const ref = this.referenceComponents.glassmorphismCard;
    let score = 0;
    let maxScore = 0;

    // Buscar patrones de glassmorphism
    const glassPatterns = content.match(/className="[^"]*(?:bg-white\\/85|backdrop-blur)[^"]*"/g);
    
    if (glassPatterns) {
      glassPatterns.forEach(pattern => {
        maxScore += ref.required.length;
        
        // Verificar TODAS las clases requeridas están presentes
        ref.required.forEach(reqClass => {
          if (pattern.includes(reqClass)) {
            score++;
          } else {
            this.violations.push({
              type: 'GLASSMORPHISM_INCOMPLETE',
              file: filePath,
              severity: 'FATAL',
              message: `Glassmorphism incompleto: falta '${reqClass}'`,
              pattern: pattern,
              required: ref.required
            });
          }
        });

        // Verificar hover effects si están presentes
        if (pattern.includes('hover:')) {
          maxScore += ref.requiredHover.length;
          ref.requiredHover.forEach(hoverClass => {
            if (pattern.includes(hoverClass)) {
              score++;
            } else {
              this.violations.push({
                type: 'HOVER_EFFECT_INCOMPLETE', 
                file: filePath,
                severity: 'FATAL',
                message: `Hover effect incompleto: falta '${hoverClass}'`,
                pattern: pattern
              });
            }
          });
        }

        // Verificar NO forbidden classes
        ref.forbidden.forEach(forbiddenClass => {
          if (pattern.includes(forbiddenClass)) {
            this.violations.push({
              type: 'FORBIDDEN_APPROXIMATION',
              file: filePath, 
              severity: 'FATAL',
              message: `PROHIBIDO usar aproximación: '${forbiddenClass}' - usar clases exactas`,
              pattern: pattern
            });
          }
        });
      });
    }

    this.compliance.glassmorphism = maxScore > 0 ? (score / maxScore) * 100 : 100;
  }

  validateTypographyExact(filePath, content) {
    const ref = this.referenceComponents.mathTypography;
    let score = 0;
    let maxScore = 0;

    // Buscar typography patterns
    const mathPatterns = content.match(/className="[^"]*text-9xl[^"]*"/g);
    const georgiaPatterns = content.match(/fontFamily:\\s*['"][^'"]*Georgia[^'"]*['"]/g);
    
    if (mathPatterns) {
      mathPatterns.forEach(pattern => {
        maxScore += ref.required.length;
        
        ref.required.forEach(reqClass => {
          if (pattern.includes(reqClass)) {
            score++;
          } else {
            this.violations.push({
              type: 'TYPOGRAPHY_INCOMPLETE',
              file: filePath,
              severity: 'FATAL', 
              message: `Typography incompleta: falta '${reqClass}'`,
              pattern: pattern
            });
          }
        });
      });
    }

    if (georgiaPatterns) {
      maxScore += 2; // fontFamily + textShadow
      georgiaPatterns.forEach(() => {
        score += 1; // Georgia found
        
        // Verificar textShadow exacto
        if (content.includes('0 4px 20px rgba(0, 0, 0, 0.12)')) {
          score += 1;
        } else {
          this.violations.push({
            type: 'TEXT_SHADOW_INEXACT',
            file: filePath,
            severity: 'FATAL',
            message: 'textShadow debe ser EXACTAMENTE: 0 4px 20px rgba(0, 0, 0, 0.12)'
          });
        }
      });
    }

    this.compliance.typography = maxScore > 0 ? (score / maxScore) * 100 : 100;
  }

  validateSpacingExact(filePath, content) {
    let score = 100;
    
    // Buscar hardcoded spacing (PROHIBIDO)
    const hardcodedSpacing = [
      /padding:\\s*['"]*\\d+px['"]*/, 
      /margin:\\s*['"]*\\d+px['"]*/, 
      /gap:\\s*['"]*\\d+px['"]*/, 
      /className="[^"]*p-[13579][^"]*"/g,  // Spacing no estándar
      /className="[^"]*m-[13579][^"]*"/g   // Spacing no estándar
    ];

    hardcodedSpacing.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        score = 0;
        matches.forEach(match => {
          this.violations.push({
            type: 'HARDCODED_SPACING',
            file: filePath,
            severity: 'FATAL',
            message: `PROHIBIDO hardcoded spacing: ${match}`,
            solution: 'Usar variables --mathboost-space-* solamente'
          });
        });
      }
    });

    this.compliance.spacing = score;
  }

  validateColorsExact(filePath, content) {
    let score = 100;
    
    // Buscar hardcoded colors (PROHIBIDO excepto en referencia)
    const hardcodedColors = content.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
    
    if (hardcodedColors && !filePath.includes('MathBoost.jsx')) {
      // Solo permitido en archivo de referencia
      score = 0;
      hardcodedColors.forEach(color => {
        this.violations.push({
          type: 'HARDCODED_COLOR',
          file: filePath,
          severity: 'FATAL',
          message: `PROHIBIDO hardcoded color: ${color}`,
          solution: 'Usar variables --mathboost-* solamente'
        });
      });
    }

    this.compliance.colors = score;
  }

  validateAnimationsExact(filePath, content) {
    const ref = this.referenceComponents.primaryButton;
    let score = 100;
    
    // Verificar duration exactas
    const wrongDurations = [
      'duration-100', 'duration-200', 'duration-300', 'duration-700', 'duration-1000'
    ];
    
    wrongDurations.forEach(duration => {
      if (content.includes(duration) && !content.includes('duration-500') && !content.includes('duration-1000')) {
        score = 0;
        this.violations.push({
          type: 'ANIMATION_DURATION_INEXACT',
          file: filePath,
          severity: 'FATAL',
          message: `Duration incorrecta: ${duration}. Usar duration-500 o duration-1000 SOLAMENTE`,
          exactValues: ['duration-500', 'duration-1000']
        });
      }
    });

    this.compliance.animations = score;
  }

  validateNoHardcodedValues(filePath, content) {
    // Patrones PROHIBIDOS absolutamente
    const prohibitedPatterns = [
      { pattern: /width:\\s*['"]*\\d+px['"]*/, name: 'hardcoded width' },
      { pattern: /height:\\s*['"]*\\d+px['"]*/, name: 'hardcoded height' },
      { pattern: /fontSize:\\s*['"]*\\d+px['"]*/, name: 'hardcoded fontSize' },
      { pattern: /borderRadius:\\s*['"]*\\d+px['"]*/, name: 'hardcoded borderRadius' }
    ];

    prohibitedPatterns.forEach(({ pattern, name }) => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          this.violations.push({
            type: 'HARDCODED_VALUE_PROHIBITED',
            file: filePath,
            severity: 'FATAL',
            message: `PROHIBIDO ${name}: ${match}`,
            solution: 'Usar variables CSS del design system'
          });
        });
      }
    });
  }

  async validateComponentCompliance() {
    console.log(chalk.yellow('\\n🔍 VALIDACIÓN DE COMPLIANCE POR COMPONENTE:'));
    
    const components = ['glassmorphism', 'typography', 'spacing', 'colors', 'animations'];
    
    components.forEach(component => {
      const score = this.compliance[component];
      const status = score === 100 ? chalk.green('✅ PERFECTO') : chalk.red('❌ FALLO');
      console.log(`  ${component.padEnd(15)}: ${score.toFixed(1)}% ${status}`);
      
      if (score < 100) {
        console.log(chalk.red(`    🚨 REQUIERE CORRECCIÓN INMEDIATA`));
      }
    });
  }

  generateStrictReport() {
    console.log(chalk.blue('\\n📊 REPORTE DE VALIDACIÓN ESTRICTA'));
    console.log(chalk.blue('=================================='));
    
    // Calcular compliance general
    const scores = Object.values(this.compliance);
    const overall = scores.reduce((a, b) => a + b, 0) / scores.length;
    this.compliance.overall = overall;
    
    console.log(chalk.white(`\\n🎯 COMPLIANCE GENERAL: ${overall.toFixed(1)}%`));
    
    if (overall === 100) {
      console.log(chalk.green('✅ BRANDING PIXEL-PERFECT CONFIRMADO'));
    } else {
      console.log(chalk.red(`❌ COMPLIANCE INSUFICIENTE (Requerido: 100.0%)`));
    }

    // Mostrar violaciones FATALES
    if (this.violations.length > 0) {
      console.log(chalk.red(`\\n🚨 VIOLACIONES FATALES (${this.violations.length}):`));
      
      this.violations.forEach((violation, index) => {
        console.log(chalk.red(`\\n${index + 1}. ${violation.type}`));
        console.log(chalk.gray(`   Archivo: ${violation.file}`));
        console.log(chalk.gray(`   Error: ${violation.message}`));
        if (violation.solution) {
          console.log(chalk.yellow(`   Solución: ${violation.solution}`));
        }
        if (violation.pattern) {
          console.log(chalk.gray(`   Patrón: ${violation.pattern.substring(0, 100)}...`));
        }
      });
    }

    // Criterios de aprobación ESTRICTOS
    const passed = overall === 100 && this.violations.length === 0;
    
    console.log(chalk.blue('\\n🎯 CRITERIOS DE APROBACIÓN:'));
    console.log(`  Compliance 100%: ${overall === 100 ? chalk.green('✅') : chalk.red('❌')}`);
    console.log(`  Cero violaciones: ${this.violations.length === 0 ? chalk.green('✅') : chalk.red('❌')}`);
    console.log(`  Pixel-perfect: ${passed ? chalk.green('✅') : chalk.red('❌')}`);
    
    return passed;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const validator = new PixelPerfectValidator();
  const targetPath = process.argv[2] || '.';
  validator.validateStrict(targetPath);
}

module.exports = PixelPerfectValidator;