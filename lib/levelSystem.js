// SISTEMA ÉPICO DE NIVELES MATHBOOST
export const LEVEL_SYSTEM = {
  // 12 NIVELES ÉPICOS CON PROGRESIÓN MATEMÁTICA
  levels: [
    {
      level: 1,
      name: "Aprendiz",
      icon: "🌱",
      color: "#10B981", // Verde suave
      xp_required: 100,
      xp_total: 0,
      weekly_goal: 50,
      description: "Primeros pasos en matemáticas"
    },
    {
      level: 2,
      name: "Explorador",
      icon: "🔍",
      color: "#3B82F6", // Azul
      xp_required: 150,
      xp_total: 100,
      weekly_goal: 60,
      description: "Descubriendo patrones matemáticos"
    },
    {
      level: 3,
      name: "Calculador",
      icon: "🧮",
      color: "#8B5CF6", // Púrpura
      xp_required: 200,
      xp_total: 250,
      weekly_goal: 70,
      description: "Dominando operaciones básicas"
    },
    {
      level: 4,
      name: "Estratega",
      icon: "♟️",
      color: "#F59E0B", // Amarillo/Naranja
      xp_required: 250,
      xp_total: 450,
      weekly_goal: 80,
      description: "Pensamiento estratégico matemático"
    },
    {
      level: 5,
      name: "Alquimista",
      icon: "⚗️",
      color: "#EF4444", // Rojo
      xp_required: 300,
      xp_total: 700,
      weekly_goal: 90,
      description: "Transformando números en magia"
    },
    {
      level: 6,
      name: "Arquitecto",
      icon: "🏗️",
      color: "#6366F1", // Índigo
      xp_required: 350,
      xp_total: 1000,
      weekly_goal: 100,
      description: "Construyendo estructuras matemáticas"
    },
    {
      level: 7,
      name: "Mago",
      icon: "🧙‍♂️",
      color: "#8B5CF6", // Púrpura mágico
      xp_required: 400,
      xp_total: 1350,
      weekly_goal: 110,
      description: "Maestro de las artes matemáticas"
    },
    {
      level: 8,
      name: "Sabio",
      icon: "🧙‍♀️",
      color: "#059669", // Verde esmeralda
      xp_required: 450,
      xp_total: 1750,
      weekly_goal: 120,
      description: "Sabiduría matemática ancestral"
    },
    {
      level: 9,
      name: "Maestro",
      icon: "👑",
      color: "#DC2626", // Rojo real
      xp_required: 500,
      xp_total: 2200,
      weekly_goal: 130,
      description: "Maestría absoluta de números"
    },
    {
      level: 10,
      name: "Leyenda",
      icon: "⚡",
      color: "#F59E0B", // Dorado eléctrico
      xp_required: 600,
      xp_total: 2700,
      weekly_goal: 140,
      description: "Velocidad legendaria de cálculo"
    },
    {
      level: 11,
      name: "Titán",
      icon: "🔥",
      color: "#7C2D12", // Bronce ardiente
      xp_required: 700,
      xp_total: 3300,
      weekly_goal: 150,
      description: "Poder matemático titánico"
    },
    {
      level: 12,
      name: "Dios Matemático",
      icon: "🌟",
      color: "#A855F7", // Púrpura divino
      xp_required: 800,
      xp_total: 4000,
      weekly_goal: 160,
      description: "Divinidad numérica suprema"
    }
  ],

  // FUNCIÓN PARA OBTENER INFO DE NIVEL
  getLevelInfo: (level) => {
    return LEVEL_SYSTEM.levels.find(l => l.level === level) || LEVEL_SYSTEM.levels[0]
  },

  // FUNCIÓN PARA CALCULAR NIVEL DESDE XP
  getLevelFromXP: (totalXP) => {
    let currentLevel = 1
    
    for (let i = 0; i < LEVEL_SYSTEM.levels.length; i++) {
      const levelData = LEVEL_SYSTEM.levels[i]
      if (totalXP >= levelData.xp_total) {
        currentLevel = levelData.level
      } else {
        break
      }
    }
    
    const levelInfo = LEVEL_SYSTEM.getLevelInfo(currentLevel)
    const nextLevelInfo = LEVEL_SYSTEM.getLevelInfo(currentLevel + 1)
    
    // Calcular XP en el nivel actual
    const xpInCurrentLevel = totalXP - levelInfo.xp_total
    const xpForNextLevel = nextLevelInfo ? (nextLevelInfo.xp_total - totalXP) : 0
    
    return {
      current_level: currentLevel,
      level_info: levelInfo,
      next_level_info: nextLevelInfo,
      current_xp: totalXP,
      xp_in_current_level: xpInCurrentLevel,
      xp_for_next_level: xpForNextLevel,
      weekly_goal: levelInfo.weekly_goal,
      progress_percentage: nextLevelInfo ? 
        Math.round((xpInCurrentLevel / levelInfo.xp_required) * 100) : 100
    }
  },

  // RECOMPENSAS DE XP
  XP_REWARDS: {
    CORRECT_ANSWER: 10,
    SESSION_COMPLETE: 5,
    PERFECT_SESSION: 50,
    STREAK_MULTIPLIER: 1.5,
    DAILY_BONUS: 25,
    WEEKLY_GOAL_BONUS: 100
  },

  // FUNCIÓN PARA CALCULAR XP DE SESIÓN
  calculateSessionXP: (sessionStats) => {
    const { totalProblems, correctAnswers, currentStreak, isPerfect } = sessionStats
    
    let totalXP = 0
    
    // XP base por respuestas correctas
    totalXP += correctAnswers * LEVEL_SYSTEM.XP_REWARDS.CORRECT_ANSWER
    
    // XP por completar sesión
    totalXP += LEVEL_SYSTEM.XP_REWARDS.SESSION_COMPLETE
    
    // Bonus por sesión perfecta
    if (isPerfect && totalProblems > 0 && correctAnswers === totalProblems) {
      totalXP += LEVEL_SYSTEM.XP_REWARDS.PERFECT_SESSION
    }
    
    // Multiplicador por racha
    if (currentStreak > 0) {
      totalXP = Math.floor(totalXP * LEVEL_SYSTEM.XP_REWARDS.STREAK_MULTIPLIER)
    }
    
    return totalXP
  }
}

export default LEVEL_SYSTEM