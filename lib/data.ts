import type { Food, Product } from "./types"

// Datos de productos
export const products: Product[] = [
  {
    id: "prod_001",
    name: "Proteína Whey Premium",
    description: "Proteína de suero de alta calidad con 24g de proteína por porción. Sabor chocolate.",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "suplementos",
    stock: 50,
  },
  {
    id: "prod_002",
    name: "Creatina Monohidrato",
    description: "Creatina pura para aumentar la fuerza y el rendimiento muscular. 500g.",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "suplementos",
    stock: 35,
  },
  {
    id: "prod_003",
    name: "Mancuernas Ajustables 20kg",
    description: "Par de mancuernas ajustables de 2 a 20kg cada una. Perfectas para entrenamiento en casa.",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "equipamiento",
    stock: 10,
  },
  {
    id: "prod_004",
    name: "Barras Proteicas (12 uds)",
    description: "Barras de proteína con 20g de proteína y bajo contenido en azúcar. Varios sabores.",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "suplementos",
    stock: 40,
  },
  {
    id: "prod_005",
    name: "Esterilla de Yoga Premium",
    description: "Esterilla antideslizante de 6mm de grosor. Perfecta para yoga y pilates.",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "equipamiento",
    stock: 25,
  },
  {
    id: "prod_006",
    name: "BCAA en Polvo",
    description: "Aminoácidos de cadena ramificada para recuperación muscular. 300g.",
    price: 22.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "suplementos",
    stock: 30,
  },
  {
    id: "prod_007",
    name: "Banda de Resistencia Set",
    description: "Set de 5 bandas de resistencia de diferentes intensidades con asas y anclaje para puerta.",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "equipamiento",
    stock: 20,
  },
  {
    id: "prod_008",
    name: "Multivitamínico Deportista",
    description: "Complejo vitamínico especialmente formulado para deportistas. 90 cápsulas.",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "suplementos",
    stock: 45,
  },
]

// Datos de alimentos
export const foods: Food[] = [
  {
    id: "food_001",
    name: "Pechuga de pollo",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    portion: 100,
    category: "proteínas",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_002",
    name: "Arroz blanco",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    portion: 100,
    category: "carbohidratos",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_003",
    name: "Huevo entero",
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    portion: 100,
    category: "proteínas",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_004",
    name: "Atún en conserva",
    calories: 116,
    protein: 25.5,
    carbs: 0,
    fat: 1,
    portion: 100,
    category: "proteínas",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_005",
    name: "Patata",
    calories: 77,
    protein: 2,
    carbs: 17,
    fat: 0.1,
    portion: 100,
    category: "carbohidratos",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_006",
    name: "Aguacate",
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    portion: 100,
    category: "grasas",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_007",
    name: "Salmón",
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    portion: 100,
    category: "proteínas",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_008",
    name: "Brócoli",
    calories: 34,
    protein: 2.8,
    carbs: 6.6,
    fat: 0.4,
    portion: 100,
    category: "verduras",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_009",
    name: "Pasta integral",
    calories: 131,
    protein: 5.3,
    carbs: 27.2,
    fat: 0.9,
    portion: 100,
    category: "carbohidratos",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_010",
    name: "Queso fresco",
    calories: 98,
    protein: 14,
    carbs: 3.1,
    fat: 4.3,
    portion: 100,
    category: "lácteos",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_011",
    name: "Lentejas",
    calories: 116,
    protein: 9,
    carbs: 20,
    fat: 0.4,
    portion: 100,
    category: "legumbres",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_012",
    name: "Plátano",
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    portion: 100,
    category: "frutas",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_013",
    name: "Avena",
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    portion: 100,
    category: "carbohidratos",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_014",
    name: "Aceite de oliva",
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    portion: 100,
    category: "grasas",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "food_015",
    name: "Yogur griego",
    calories: 97,
    protein: 9,
    carbs: 3.6,
    fat: 5,
    portion: 100,
    category: "lácteos",
    image: "/placeholder.svg?height=100&width=100",
  },
]

// Función para generar un menú aleatorio
export function generateRandomMenu() {
  const breakfast = generateMeal("Desayuno", 500, 40)
  const lunch = generateMeal("Almuerzo", 600, 40)
  const dinner = generateMeal("Cena", 500, 40)

  const totalCalories = breakfast.calories + lunch.calories + dinner.calories
  const totalProtein = breakfast.protein + lunch.protein + dinner.protein
  const totalCarbs = breakfast.carbs + lunch.carbs + dinner.carbs
  const totalFat = breakfast.fat + lunch.fat + dinner.fat

  return {
    id: `menu_${Date.now()}`,
    name: `Menú ${new Date().toLocaleDateString()}`,
    meals: [breakfast, lunch, dinner],
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
  }
}

// Función para generar una comida aleatoria
function generateMeal(name: string, targetCalories: number, minProtein: number) {
  const mealFoods: { food: Food; grams: number }[] = []
  let currentCalories = 0
  let currentProtein = 0
  let currentCarbs = 0
  let currentFat = 0

  // Asegurar proteína suficiente
  const proteinFoods = foods.filter((food) => food.category === "proteínas")
  const randomProteinFood = proteinFoods[Math.floor(Math.random() * proteinFoods.length)]

  // Calcular gramos necesarios para alcanzar mínimo de proteína
  const proteinGrams = Math.ceil((minProtein / randomProteinFood.protein) * 100)

  mealFoods.push({
    food: randomProteinFood,
    grams: proteinGrams,
  })

  currentCalories += (randomProteinFood.calories * proteinGrams) / 100
  currentProtein += (randomProteinFood.protein * proteinGrams) / 100
  currentCarbs += (randomProteinFood.carbs * proteinGrams) / 100
  currentFat += (randomProteinFood.fat * proteinGrams) / 100

  // Añadir carbohidratos
  const carbFoods = foods.filter((food) => food.category === "carbohidratos")
  const randomCarbFood = carbFoods[Math.floor(Math.random() * carbFoods.length)]

  // Calcular gramos necesarios para completar calorías
  const remainingCalories = targetCalories - currentCalories
  const carbGrams = Math.ceil((remainingCalories / randomCarbFood.calories) * 100 * 0.7) // 70% de las calorías restantes

  mealFoods.push({
    food: randomCarbFood,
    grams: carbGrams,
  })

  currentCalories += (randomCarbFood.calories * carbGrams) / 100
  currentProtein += (randomCarbFood.protein * carbGrams) / 100
  currentCarbs += (randomCarbFood.carbs * carbGrams) / 100
  currentFat += (randomCarbFood.fat * carbGrams) / 100

  // Añadir verduras o frutas
  const veggies = foods.filter((food) => food.category === "verduras" || food.category === "frutas")
  const randomVeggie = veggies[Math.floor(Math.random() * veggies.length)]

  mealFoods.push({
    food: randomVeggie,
    grams: 100, // Porción estándar
  })

  currentCalories += randomVeggie.calories
  currentProtein += randomVeggie.protein
  currentCarbs += randomVeggie.carbs
  currentFat += randomVeggie.fat

  // Añadir grasas saludables si es necesario
  if (currentCalories < targetCalories * 0.9) {
    const fatFoods = foods.filter((food) => food.category === "grasas")
    const randomFatFood = fatFoods[Math.floor(Math.random() * fatFoods.length)]

    const fatGrams = Math.ceil(((targetCalories - currentCalories) / randomFatFood.calories) * 100)

    mealFoods.push({
      food: randomFatFood,
      grams: fatGrams > 30 ? 30 : fatGrams, // Limitar la cantidad de grasas
    })

    currentCalories += (randomFatFood.calories * fatGrams) / 100
    currentProtein += (randomFatFood.protein * fatGrams) / 100
    currentCarbs += (randomFatFood.carbs * fatGrams) / 100
    currentFat += (randomFatFood.fat * fatGrams) / 100
  }

  return {
    id: `meal_${Date.now()}_${name.toLowerCase()}`,
    name,
    foods: mealFoods,
    calories: Math.round(currentCalories),
    protein: Math.round(currentProtein),
    carbs: Math.round(currentCarbs),
    fat: Math.round(currentFat),
  }
}

// Función para calcular macros de una comida personalizada
export function calculateMealMacros(foods: { food: Food; grams: number }[]) {
  let calories = 0
  let protein = 0
  let carbs = 0
  let fat = 0

  foods.forEach((item) => {
    calories += (item.food.calories * item.grams) / 100
    protein += (item.food.protein * item.grams) / 100
    carbs += (item.food.carbs * item.grams) / 100
    fat += (item.food.fat * item.grams) / 100
  })

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  }
}
