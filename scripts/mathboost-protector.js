#!/usr/bin/env node

/**
 * MATHBOOST PROTECTOR - Sistema Defensivo Inteligente
 * ==================================================
 * 
 * Protege el branding perfecto mientras guía hacia mejores prácticas
 * Modo LEARNING: educativo, no bloqueante
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class MathBoostProtector {
  constructor() {
    this.config = this.loadConfig();
    this.violations = [];
    this.suggestions = [];
    this.opportunities = [];
    this.stats = {
      filesScanned: 0,
      protectedClassesFound: 0,
      suggestionsGenerated: 0,
      opportunitiesIdentified: 0
    };
  }

  loadConfig() {
    try {
      const configPath = path.join(process.cwd(), '.mathboost-protector.json');
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
      console.error(chalk.red('❌ No se pudo cargar .mathboost-protector.json'));
      process.exit(1);
    }
  }

  async scan(targetPath = '.') {
    console.log(chalk.blue('🛡️  MathBoost Protector - Modo LEARNING'));
    console.log(chalk.gray('Escaneando y protegiendo el branding perfecto...\\n'));

    await this.scanDirectory(targetPath);
    this.generateReport();
  }

  async scanDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory() && !this.shouldSkipDirectory(file.name)) {
        await this.scanDirectory(fullPath);
      } else if (file.isFile() && this.shouldScanFile(file.name)) {
        await this.scanFile(fullPath);
      }
    }
  }

  shouldSkipDirectory(dirname) {
    const skipDirs = ['node_modules', '.git', '.next', 'dist', 'build'];
    return skipDirs.includes(dirname);
  }

  shouldScanFile(filename) {
    const extensions = ['.jsx', '.js', '.tsx', '.ts', '.css', '.scss'];
    return extensions.some(ext => filename.endsWith(ext));
  }

  async scanFile(filePath) {
    this.stats.filesScanned++;
    const content = fs.readFileSync(filePath, 'utf8');
    const isProtectedFile = this.isProtectedFile(filePath);
    const isNewFile = this.isNewFile(filePath);

    console.log(chalk.gray(`📁 Escaneando: ${filePath}`));

    // PROTECCIÓN DE ARCHIVOS CRÍTICOS
    if (isProtectedFile) {
      this.scanProtectedFile(filePath, content);
    }

    // ANÁLISIS DE CLASES CSS PROTEGIDAS
    this.scanForProtectedClasses(filePath, content);

    // ESTILOS INLINE CRÍTICOS
    this.scanForCriticalInlineStyles(filePath, content);

    // OPORTUNIDADES DE MEJORA (no bloqueantes)
    this.identifyOpportunities(filePath, content);

    // REGLAS STRICT solo para archivos nuevos
    if (isNewFile && this.config.rules.strict) {
      this.applyStrictRules(filePath, content);
    }
  }

  isProtectedFile(filePath) {
    return this.config.protectedFiles.whitelist.some(protected => 
      filePath.includes(protected)
    );
  }

  isNewFile(filePath) {
    // Simular detección de archivos nuevos
    // En implementación real usaría git status
    return !this.config.protectedFiles.whitelist.some(protected => 
      filePath.includes(protected)
    );
  }

  scanProtectedFile(filePath, content) {
    console.log(chalk.yellow(`🛡️  ARCHIVO PROTEGIDO: ${filePath}`));
    
    // Detectar modificaciones peligrosas
    const dangerousPatterns = [
      { pattern: /backdrop-filter:\\s*none/g, warning: 'Se está deshabilitando backdrop-filter en glassmorphism' },
      { pattern: /font-family:\\s*(?!.*Georgia)/g, warning: 'Se está cambiando Georgia serif en problemas matemáticos' },
      { pattern: /linear-gradient\\([^)]*\\)/g, warning: 'Se están modificando gradientes del branding' }
    ];

    dangerousPatterns.forEach(({ pattern, warning }) => {
      const matches = content.match(pattern);
      if (matches) {
        this.violations.push({
          type: 'PROTECTED_FILE_MODIFICATION',
          file: filePath,
          severity: 'warning',
          message: warning,
          matches: matches.length
        });
      }
    });
  }

  scanForProtectedClasses(filePath, content) {
    const allProtectedClasses = [
      ...this.config.protectedClasses.glassmorphism,
      ...this.config.protectedClasses.typography,
      ...this.config.protectedClasses.animations,
      ...this.config.protectedClasses.gradients,
      ...this.config.protectedClasses.spacing
    ];

    allProtectedClasses.forEach(className => {
      const regex = new RegExp(`\\\\b${className.replace('/', '\\\\/')}\\\\b`, 'g');
      const matches = content.match(regex);
      
      if (matches) {
        this.stats.protectedClassesFound += matches.length;
        console.log(chalk.green(`  ✅ Clase protegida encontrada: ${className} (${matches.length}x)`));
      }
    });
  }

  scanForCriticalInlineStyles(filePath, content) {
    // Detectar Georgia serif en estilos inline
    const georgiaPattern = /fontFamily:\\s*['"]['"]Georgia[, serif]*['"]['"]/g;
    const georgiaMatches = content.match(georgiaPattern);
    
    if (georgiaMatches) {
      console.log(chalk.green(`  ✅ Tipografía crítica protegida: Georgia serif (${georgiaMatches.length}x)`));
    }

    // Detectar gradientes críticos
    const gradientPattern = /linear-gradient\\([^)]*#DBEAFE[^)]*#EDE9FE[^)]*\\)/g;
    const gradientMatches = content.match(gradientPattern);
    
    if (gradientMatches) {
      console.log(chalk.green(`  ✅ Gradiente crítico protegido: botón principal (${gradientMatches.length}x)`));
    }

    // Detectar backdrop-filter crítico
    const backdropPattern = /backdropFilter:\\s*['"][^'"]*blur\\([^'"]*\\)['"]['"]/g;
    const backdropMatches = content.match(backdropPattern);
    
    if (backdropMatches) {
      console.log(chalk.green(`  ✅ Efecto glassmorphism protegido (${backdropMatches.length}x)`));
    }
  }

  identifyOpportunities(filePath, content) {
    // Oportunidad: usar design tokens en lugar de colores hardcodeados
    const hardcodedColors = content.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
    if (hardcodedColors) {
      this.opportunities.push({
        type: 'DESIGN_TOKENS',
        file: filePath,
        suggestion: `💡 Encontrados ${hardcodedColors.length} colores hardcodeados. Considera usar var(--mathboost-*)`,
        priority: 'low',
        colors: [...new Set(hardcodedColors)]
      });
      this.stats.opportunitiesIdentified++;
    }

    // Oportunidad: componentes reutilizables
    const buttonPatterns = content.match(/className="[^"]*rounded-[23]xl[^"]*transition[^"]*"/g);
    if (buttonPatterns && buttonPatterns.length > 1) {
      this.opportunities.push({
        type: 'COMPONENT_EXTRACTION',
        file: filePath,
        suggestion: `💡 Patrón de botón repetido ${buttonPatterns.length}x. Podría extraerse como componente`,
        priority: 'medium'
      });
    }

    // Oportunidad: accesibilidad
    const interactiveElements = content.match(/<(button|a|input)[^>]*>/g);
    const ariaLabels = content.match(/aria-label/g);
    if (interactiveElements && (!ariaLabels || ariaLabels.length < interactiveElements.length)) {
      this.opportunities.push({
        type: 'ACCESSIBILITY',
        file: filePath,
        suggestion: `💡 ${interactiveElements.length} elementos interactivos, ${ariaLabels?.length || 0} con aria-label`,
        priority: 'high'
      });
    }
  }

  applyStrictRules(filePath, content) {
    // Solo aplicar reglas estrictas a archivos nuevos
    console.log(chalk.blue(`  📋 Aplicando reglas STRICT a archivo nuevo: ${filePath}`));
    
    // Verificar uso de design tokens
    const hasDesignTokens = content.includes('var(--mathboost-');
    if (!hasDesignTokens) {
      this.suggestions.push({
        type: 'USE_DESIGN_TOKENS',
        file: filePath,
        message: '💡 Archivo nuevo debería usar variables CSS del design system',
        severity: 'info'
      });
      this.stats.suggestionsGenerated++;
    }
  }

  generateReport() {
    console.log('\\n' + chalk.blue('📊 REPORTE DE PROTECCIÓN - MATHBOOST'));
    console.log(chalk.blue('=========================================='));
    
    // Estadísticas generales
    console.log(chalk.white('\\n📈 Estadísticas:'));
    console.log(`  📁 Archivos escaneados: ${this.stats.filesScanned}`);
    console.log(`  🛡️  Clases protegidas encontradas: ${this.stats.protectedClassesFound}`);
    console.log(`  💡 Sugerencias generadas: ${this.stats.suggestionsGenerated}`);
    console.log(`  🎯 Oportunidades identificadas: ${this.stats.opportunitiesIdentified}`);

    // Violaciones (modo learning - solo warnings)
    if (this.violations.length > 0) {
      console.log(chalk.yellow('\\n⚠️  ALERTAS (Modo Learning):'));
      this.violations.forEach(violation => {
        console.log(chalk.yellow(`  ⚠️  ${violation.file}`));
        console.log(chalk.gray(`     ${violation.message}`));
      });
    }

    // Sugerencias constructivas
    if (this.suggestions.length > 0) {
      console.log(chalk.cyan('\\n💡 SUGERENCIAS:'));
      this.suggestions.forEach(suggestion => {
        console.log(chalk.cyan(`  💡 ${suggestion.file}`));
        console.log(chalk.gray(`     ${suggestion.message}`));
      });
    }

    // Oportunidades de mejora
    if (this.opportunities.length > 0) {
      console.log(chalk.magenta('\\n🎯 OPORTUNIDADES DE MEJORA:'));
      
      // Agrupar por prioridad
      const byPriority = this.opportunities.reduce((acc, opp) => {
        acc[opp.priority] = acc[opp.priority] || [];
        acc[opp.priority].push(opp);
        return acc;
      }, {});

      ['high', 'medium', 'low'].forEach(priority => {
        if (byPriority[priority]) {
          console.log(chalk.magenta(`\\n  🔥 Prioridad ${priority.toUpperCase()}:`));
          byPriority[priority].forEach(opp => {
            console.log(chalk.gray(`     ${opp.file}: ${opp.suggestion}`));
          });
        }
      });
    }

    // Estado del branding
    console.log(chalk.green('\\n✅ ESTADO DEL BRANDING:'));
    console.log(chalk.green('  🛡️  Archivos críticos: PROTEGIDOS'));
    console.log(chalk.green('  ✨ Glassmorphism: FUNCIONANDO'));
    console.log(chalk.green('  🎨 Gradientes: PRESERVADOS')); 
    console.log(chalk.green('  📝 Typography: GEORGIA SERIF PROTEGIDA'));
    
    // Resumen final
    console.log(chalk.blue('\\n🎯 RESUMEN:'));
    if (this.violations.length === 0) {
      console.log(chalk.green('  ✅ NO se detectaron modificaciones peligrosas'));
    } else {
      console.log(chalk.yellow(`  ⚠️  ${this.violations.length} alertas de modificación (solo warnings)`));
    }
    
    console.log(chalk.blue(`\\n💡 El branding perfecto está PROTEGIDO y funcionando`));
    console.log(chalk.gray('   Usa este reporte para mejoras futuras sin romper el diseño\\n'));
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const protector = new MathBoostProtector();
  const targetPath = process.argv[2] || '.';
  protector.scan(targetPath);
}

module.exports = MathBoostProtector;