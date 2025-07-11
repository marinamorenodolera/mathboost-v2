#!/usr/bin/env node

/**
 * MATHBOOST STRICT TEST SUITE - TOLERANCIA CERO
 * ==============================================
 * 
 * Suite completa de tests para garantizar branding pixel-perfect
 * NO acepta aproximaciones - SOLO perfección
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const PixelPerfectValidator = require('./pixel-perfect-validator');
const { VisualRegressionTest } = require('./visual-regression-test');

class MathBoostStrictTestSuite {
  constructor() {
    this.testResults = {
      pixelPerfect: null,
      visualRegression: null,
      designSystemCompliance: null,
      brandingIntegrity: null
    };
    
    this.overallScore = 0;
    this.requiredScore = 100; // TOLERANCIA CERO
  }

  async runFullSuite() {
    console.log(chalk.red('🚨 MATHBOOST STRICT TEST SUITE'));
    console.log(chalk.red('=============================='));
    console.log(chalk.yellow('⚠️  TOLERANCIA CERO - Requiere perfección 100%\\n'));

    const startTime = Date.now();

    try {
      // TEST 1: Pixel-Perfect Validation
      await this.runPixelPerfectTest();
      
      // TEST 2: Visual Regression
      await this.runVisualRegressionTest();
      
      // TEST 3: Design System Compliance  
      await this.runDesignSystemComplianceTest();
      
      // TEST 4: Branding Integrity
      await this.runBrandingIntegrityTest();
      
      // Generar reporte final
      const passed = this.generateFinalReport();
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(chalk.gray(`\\n⏱️  Duración total: ${duration}s`));
      
      if (!passed) {
        console.log(chalk.red('\\n❌ SUITE FALLIDA - NO está listo para producción'));
        this.generateFailureGuidance();
        process.exit(1);
      } else {
        console.log(chalk.green('\\n✅ SUITE EXITOSA - Branding pixel-perfect confirmado'));
        this.generateSuccessReport();
      }
      
    } catch (error) {
      console.error(chalk.red(`\\n💥 ERROR FATAL: ${error.message}`));
      process.exit(1);
    }
  }

  async runPixelPerfectTest() {
    console.log(chalk.cyan('\\n🎯 TEST 1: PIXEL-PERFECT VALIDATION'));
    console.log(chalk.cyan('===================================='));
    
    try {
      const validator = new PixelPerfectValidator();
      await validator.validateStrict('.');
      
      this.testResults.pixelPerfect = {
        passed: validator.compliance.overall === 100,
        score: validator.compliance.overall,
        violations: validator.violations.length,
        details: validator.compliance
      };
      
      console.log(chalk.green(`✅ Pixel-Perfect Test: ${this.testResults.pixelPerfect.score}%`));
      
    } catch (error) {
      this.testResults.pixelPerfect = {
        passed: false,
        score: 0,
        error: error.message
      };
      console.log(chalk.red(`❌ Pixel-Perfect Test: FAILED`));
    }
  }

  async runVisualRegressionTest() {
    console.log(chalk.cyan('\\n📸 TEST 2: VISUAL REGRESSION'));
    console.log(chalk.cyan('============================='));
    
    try {
      const tester = new VisualRegressionTest();
      await tester.runVisualTests();
      
      const passedTests = tester.results.filter(r => r.passed).length;
      const totalTests = tester.results.length;
      const score = totalTests > 0 ? (passedTests / totalTests) * 100 : 100;
      
      this.testResults.visualRegression = {
        passed: score === 100,
        score: score,
        passedTests: passedTests,
        totalTests: totalTests,
        results: tester.results
      };
      
      console.log(chalk.green(`✅ Visual Regression: ${score}% (${passedTests}/${totalTests})`));
      
    } catch (error) {
      this.testResults.visualRegression = {
        passed: false,
        score: 0,
        error: error.message
      };
      console.log(chalk.red(`❌ Visual Regression: FAILED`));
    }
  }

  async runDesignSystemComplianceTest() {
    console.log(chalk.cyan('\\n📋 TEST 3: DESIGN SYSTEM COMPLIANCE'));
    console.log(chalk.cyan('===================================='));
    
    const compliance = await this.checkDesignSystemUsage();
    
    this.testResults.designSystemCompliance = compliance;
    
    const status = compliance.passed ? chalk.green('✅') : chalk.red('❌');
    console.log(`${status} Design System Compliance: ${compliance.score}%`);
  }

  async checkDesignSystemUsage() {
    const checks = [
      { name: 'Design tokens defined', test: () => fs.existsSync('mathboost-design-system.css') },
      { name: 'No hardcoded colors', test: () => this.checkNoHardcodedColors() },
      { name: 'No hardcoded spacing', test: () => this.checkNoHardcodedSpacing() },
      { name: 'Glassmorphism consistency', test: () => this.checkGlassmorphismConsistency() },
      { name: 'Typography consistency', test: () => this.checkTypographyConsistency() }
    ];
    
    let passedChecks = 0;
    const details = [];
    
    for (const check of checks) {
      try {
        const passed = await check.test();
        if (passed) passedChecks++;
        
        details.push({
          name: check.name,
          passed: passed,
          status: passed ? '✅' : '❌'
        });
        
        console.log(`  ${passed ? chalk.green('✅') : chalk.red('❌')} ${check.name}`);
        
      } catch (error) {
        details.push({
          name: check.name,
          passed: false,
          error: error.message
        });
        console.log(`  ${chalk.red('❌')} ${check.name}: ${error.message}`);
      }
    }
    
    const score = (passedChecks / checks.length) * 100;
    
    return {
      passed: score === 100,
      score: score,
      passedChecks: passedChecks,
      totalChecks: checks.length,
      details: details
    };
  }

  checkNoHardcodedColors() {
    // Verificar que no haya colores hardcodeados en archivos nuevos
    const files = this.getJSXFiles();
    
    for (const file of files) {
      if (file.includes('MathBoost.jsx')) continue; // Skip reference file
      
      const content = fs.readFileSync(file, 'utf8');
      const hardcodedColors = content.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
      
      if (hardcodedColors) {
        throw new Error(`Hardcoded colors found in ${file}: ${hardcodedColors.join(', ')}`);
      }
    }
    
    return true;
  }

  checkNoHardcodedSpacing() {
    const files = this.getJSXFiles();
    
    for (const file of files) {
      if (file.includes('MathBoost.jsx')) continue; // Skip reference file
      
      const content = fs.readFileSync(file, 'utf8');
      const hardcodedSpacing = content.match(/(?:padding|margin|gap):\\s*['"]*\\d+px['"]/g);
      
      if (hardcodedSpacing) {
        throw new Error(`Hardcoded spacing found in ${file}: ${hardcodedSpacing.join(', ')}`);
      }
    }
    
    return true;
  }

  checkGlassmorphismConsistency() {
    const files = this.getJSXFiles();
    const requiredClasses = ['bg-white/85', 'backdrop-blur-xl', 'border-black/5'];
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const glassPatterns = content.match(/className="[^"]*(?:bg-white\\/85|backdrop-blur)[^"]*"/g);
      
      if (glassPatterns) {
        for (const pattern of glassPatterns) {
          const missingClasses = requiredClasses.filter(cls => !pattern.includes(cls));
          if (missingClasses.length > 0) {
            throw new Error(`Incomplete glassmorphism in ${file}: missing ${missingClasses.join(', ')}`);
          }
        }
      }
    }
    
    return true;
  }

  checkTypographyConsistency() {
    const files = this.getJSXFiles();
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Verificar que Georgia serif tenga las clases correctas
      if (content.includes('Georgia, serif')) {
        const mathPatterns = content.match(/className="[^"]*text-9xl[^"]*"/g);
        if (mathPatterns) {
          for (const pattern of mathPatterns) {
            if (!pattern.includes('font-light') || !pattern.includes('tracking-wider')) {
              throw new Error(`Incomplete math typography in ${file}: ${pattern}`);
            }
          }
        }
      }
    }
    
    return true;
  }

  async runBrandingIntegrityTest() {
    console.log(chalk.cyan('\\n🎨 TEST 4: BRANDING INTEGRITY'));
    console.log(chalk.cyan('=============================='));
    
    const integrity = await this.checkBrandingElements();
    
    this.testResults.brandingIntegrity = integrity;
    
    const status = integrity.passed ? chalk.green('✅') : chalk.red('❌');
    console.log(`${status} Branding Integrity: ${integrity.score}%`);
  }

  async checkBrandingElements() {
    const brandingElements = [
      { name: 'WelcomeScreen glassmorphism', test: () => this.verifyWelcomeScreenGlass() },
      { name: 'Primary button gradient', test: () => this.verifyPrimaryButtonGradient() },
      { name: 'Math typography Georgia', test: () => this.verifyMathTypography() },
      { name: 'Progress bar gradients', test: () => this.verifyProgressBarGradients() },
      { name: 'Hover animations exact', test: () => this.verifyHoverAnimations() }
    ];
    
    let passedElements = 0;
    const details = [];
    
    for (const element of brandingElements) {
      try {
        const passed = await element.test();
        if (passed) passedElements++;
        
        details.push({
          name: element.name,
          passed: passed
        });
        
        console.log(`  ${passed ? chalk.green('✅') : chalk.red('❌')} ${element.name}`);
        
      } catch (error) {
        details.push({
          name: element.name,
          passed: false,
          error: error.message
        });
        console.log(`  ${chalk.red('❌')} ${element.name}: ${error.message}`);
      }
    }
    
    const score = (passedElements / brandingElements.length) * 100;
    
    return {
      passed: score === 100,
      score: score,
      passedElements: passedElements,
      totalElements: brandingElements.length,
      details: details
    };
  }

  verifyWelcomeScreenGlass() {
    // Verificar que el glassmorphism esté presente y completo
    const mathboostFile = 'components/MathBoost.jsx';
    if (!fs.existsSync(mathboostFile)) return false;
    
    const content = fs.readFileSync(mathboostFile, 'utf8');
    const requiredClasses = [
      'bg-white/85',
      'backdrop-blur-xl',
      'border',
      'border-black/5',
      'shadow-lg'
    ];
    
    return requiredClasses.every(cls => content.includes(cls));
  }

  verifyPrimaryButtonGradient() {
    const mathboostFile = 'components/MathBoost.jsx';
    if (!fs.existsSync(mathboostFile)) return false;
    
    const content = fs.readFileSync(mathboostFile, 'utf8');
    return content.includes('linear-gradient(135deg, #DBEAFE, #EDE9FE)');
  }

  verifyMathTypography() {
    const mathboostFile = 'components/MathBoost.jsx';
    if (!fs.existsSync(mathboostFile)) return false;
    
    const content = fs.readFileSync(mathboostFile, 'utf8');
    return content.includes('Georgia, serif') && 
           content.includes('text-9xl') && 
           content.includes('font-light');
  }

  verifyProgressBarGradients() {
    const mathboostFile = 'components/MathBoost.jsx';
    if (!fs.existsSync(mathboostFile)) return false;
    
    const content = fs.readFileSync(mathboostFile, 'utf8');
    return content.includes('from-blue-400') && 
           content.includes('to-blue-600') &&
           content.includes('from-green-400') && 
           content.includes('to-green-600');
  }

  verifyHoverAnimations() {
    const mathboostFile = 'components/MathBoost.jsx';
    if (!fs.existsSync(mathboostFile)) return false;
    
    const content = fs.readFileSync(mathboostFile, 'utf8');
    return content.includes('hover:scale-105') && 
           content.includes('active:scale-95') &&
           content.includes('duration-500');
  }

  getJSXFiles() {
    const files = [];
    const scanDir = (dir) => {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory() && !['node_modules', '.git', '.next'].includes(item.name)) {
          scanDir(fullPath);
        } else if (item.isFile() && (item.name.endsWith('.jsx') || item.name.endsWith('.tsx'))) {
          files.push(fullPath);
        }
      }
    };
    
    scanDir('.');
    return files;
  }

  generateFinalReport() {
    console.log(chalk.blue('\\n📊 REPORTE FINAL - STRICT TEST SUITE'));
    console.log(chalk.blue('===================================='));
    
    const results = this.testResults;
    const scores = [
      results.pixelPerfect?.score || 0,
      results.visualRegression?.score || 0,
      results.designSystemCompliance?.score || 0,
      results.brandingIntegrity?.score || 0
    ];
    
    this.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    console.log(chalk.white(`\\n🎯 PUNTUACIONES POR CATEGORÍA:`));
    console.log(`  Pixel-Perfect: ${this.formatScore(results.pixelPerfect?.score)}`);
    console.log(`  Visual Regression: ${this.formatScore(results.visualRegression?.score)}`);
    console.log(`  Design System: ${this.formatScore(results.designSystemCompliance?.score)}`);
    console.log(`  Branding Integrity: ${this.formatScore(results.brandingIntegrity?.score)}`);
    
    console.log(chalk.white(`\\n🏆 PUNTUACIÓN GENERAL: ${this.formatScore(this.overallScore)}`));
    
    const passed = this.overallScore === 100;
    
    console.log(chalk.blue('\\n🎯 CRITERIOS DE APROBACIÓN (TOLERANCIA CERO):'));
    console.log(`  Pixel-Perfect 100%: ${this.checkCriteria(results.pixelPerfect?.score === 100)}`);
    console.log(`  Visual Regression 100%: ${this.checkCriteria(results.visualRegression?.score === 100)}`);
    console.log(`  Design System 100%: ${this.checkCriteria(results.designSystemCompliance?.score === 100)}`);
    console.log(`  Branding Integrity 100%: ${this.checkCriteria(results.brandingIntegrity?.score === 100)}`);
    console.log(`  Puntuación General 100%: ${this.checkCriteria(this.overallScore === 100)}`);
    
    return passed;
  }

  formatScore(score) {
    if (score === undefined || score === null) return chalk.gray('N/A');
    
    const color = score === 100 ? chalk.green : score >= 90 ? chalk.yellow : chalk.red;
    return color(`${score.toFixed(1)}%`);
  }

  checkCriteria(met) {
    return met ? chalk.green('✅') : chalk.red('❌');
  }

  generateFailureGuidance() {
    console.log(chalk.red('\\n🚨 GUÍA DE CORRECCIÓN'));
    console.log(chalk.red('===================='));
    
    const results = this.testResults;
    
    if (results.pixelPerfect && !results.pixelPerfect.passed) {
      console.log(chalk.yellow('\\n📐 Pixel-Perfect Issues:'));
      console.log(chalk.gray('  • Verificar clases glassmorphism exactas'));
      console.log(chalk.gray('  • Comprobar typography Georgia serif'));
      console.log(chalk.gray('  • Validar spacing y colores'));
    }
    
    if (results.visualRegression && !results.visualRegression.passed) {
      console.log(chalk.yellow('\\n📸 Visual Regression Issues:'));
      console.log(chalk.gray('  • Comparar screenshots con referencia'));
      console.log(chalk.gray('  • Verificar hover effects'));
      console.log(chalk.gray('  • Comprobar responsive behavior'));
    }
    
    console.log(chalk.red('\\n🎯 ACCIÓN REQUERIDA:'));
    console.log(chalk.red('  1. Corregir TODAS las violaciones detectadas'));
    console.log(chalk.red('  2. Re-ejecutar: npm run test:strict'));
    console.log(chalk.red('  3. NO proceder hasta obtener 100% en todos los tests'));
  }

  generateSuccessReport() {
    console.log(chalk.green('\\n🎉 BRANDING PIXEL-PERFECT CONFIRMADO'));
    console.log(chalk.green('====================================='));
    console.log(chalk.white('\\n✅ Todos los criterios cumplidos:'));
    console.log(chalk.white('  • Glassmorphism effects: PERFECTOS'));
    console.log(chalk.white('  • Typography Georgia: PRESERVADA'));
    console.log(chalk.white('  • Gradientes y colores: EXACTOS'));
    console.log(chalk.white('  • Animaciones hover: FUNCIONANDO'));
    console.log(chalk.white('  • Design system: COMPLIANCE 100%'));
    
    console.log(chalk.green('\\n🚀 LISTO PARA PRODUCCIÓN'));
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const suite = new MathBoostStrictTestSuite();
  suite.runFullSuite();
}

module.exports = MathBoostStrictTestSuite;