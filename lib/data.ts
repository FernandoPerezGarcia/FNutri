import type { 
  Food,
  Product,
  User,
  ProductCategory,
  FoodCategory,
  ShoppingCartItem,
  Address,
  Order,
  OrderItem,
  UserMeal,
  UserMealFood,
  Consultation
} from './types'
import { isUsingMySQL, getMySQLConfig } from './config'

// Server-side only imports - will be excluded from client bundles
let mysql: any = null
let pool: any = null
let dbInitialized = false
let dbInitializationPromise: Promise<void> | null = null

// Only import mysql on the server side
if (typeof window === 'undefined' && isUsingMySQL()) {
  console.log('[MySQL] Initializing MySQL connection');
  // Create a promise that resolves when the database is initialized
  dbInitializationPromise = (async () => {
    try {
      const module = await import('mysql2/promise');
      mysql = module.default;
      // Create connection pool if enabled
      const config = getMySQLConfig();
      console.log('[MySQL] Creating connection pool with config:', { 
        host: config.host,
        database: config.database,
        user: config.user,
      });
      pool = mysql.createPool(config);
      
      // Test the connection
      console.log('[MySQL] Testing connection...');
      const [result] = await pool.query('SELECT 1 as test');
      console.log('[MySQL] Connection test result:', result);
      
      // Initialize data
      await initializeData();
      dbInitialized = true;
      console.log('[MySQL] Database initialization complete');
    } catch (err) {
      console.error('[MySQL] Error initializing database:', err);
      if (err instanceof Error) {
        console.error('[MySQL] Error message:', err.message);
        console.error('[MySQL] Error stack:', err.stack);
      }
    }
  })();
}

// Server-side cached data
let SERVER_CACHED_PRODUCTS: Product[] | null = null;
let SERVER_CACHED_FOODS: Food[] | null = null;

// In-memory data for client-side fallback - ONLY used if isUsingMySQL() returns false
const clientSideProducts: Product[] = [
  {
    id: "prod_001",
    name: "Proteína Whey Premium", // NOTE: Ensure this matches exactly with the database
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
];

const clientSideFoods: Food[] = [
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
];

// Set initial data based on config
export const products: Product[] = isUsingMySQL() ? [] : [...clientSideProducts];
export const foods: Food[] = isUsingMySQL() ? [] : [...clientSideFoods];

// Helper to check if we're in a server environment with MySQL available
const isServerWithMySQLAvailable = () => {
  const result = typeof window === 'undefined' && isUsingMySQL() && pool !== null;
  console.log('[MySQL] isServerWithMySQLAvailable:', result, {
    isServer: typeof window === 'undefined',
    usingMySQL: isUsingMySQL(),
    hasPool: pool !== null,
  });
  return result;
};

// Initialize data based on config
async function initializeData() {
  // Only run on server side
  if (typeof window !== 'undefined') {
    console.log('[Client] initializeData called on client, ignoring');
    return;
  }
  
  console.log('[MySQL] Running initializeData()');
  if (isServerWithMySQLAvailable()) {
    try {
      console.log('[MySQL] Fetching products from database');
      SERVER_CACHED_PRODUCTS = await fetchProductsFromDB();
      console.log('[MySQL] Fetched', SERVER_CACHED_PRODUCTS.length, 'products');
      
      console.log('[MySQL] Fetching foods from database');
      SERVER_CACHED_FOODS = await fetchFoodsFromDB();
      console.log('[MySQL] Fetched', SERVER_CACHED_FOODS.length, 'foods');
      
      // Update exported arrays with server data
      if (SERVER_CACHED_PRODUCTS && SERVER_CACHED_PRODUCTS.length > 0) {
        products.splice(0, products.length, ...SERVER_CACHED_PRODUCTS);
        console.log('[MySQL] Updated products array with', products.length, 'items');
      }
      
      if (SERVER_CACHED_FOODS && SERVER_CACHED_FOODS.length > 0) {
        foods.splice(0, foods.length, ...SERVER_CACHED_FOODS);
        console.log('[MySQL] Updated foods array with', foods.length, 'items');
      }
    } catch (error) {
      console.error('[MySQL] Error initializing data from MySQL:', error);
      if (!isUsingMySQL()) {
        console.log('[Config] MySQL disabled, using client-side data');
        // If MySQL is disabled in config, use client-side data
        products.splice(0, products.length, ...clientSideProducts);
        foods.splice(0, foods.length, ...clientSideFoods);
      }
    }
  } else if (typeof window === 'undefined' && !isUsingMySQL()) {
    console.log('[Config] MySQL disabled in config, using client-side data');
    // Explicitly load client-side data when MySQL is disabled
    products.splice(0, products.length, ...clientSideProducts);
    foods.splice(0, foods.length, ...clientSideFoods);
  }
}

// Function to directly fetch products from DB with type conversion
async function fetchProductsFromDB(): Promise<Product[]> {
  try {
    console.log('[MySQL] Executing query: SELECT * FROM products');
    const [rows] = await pool.execute('SELECT * FROM products');
    console.log('[MySQL] Raw products result:', rows);
    
    // Convert string values to their proper types
    return (rows as any[]).map(row => ({
      ...row,
      price: Number(row.price),
      stock: Number(row.stock)
    })) as Product[];
  } catch (error) {
    console.error('[MySQL] Error fetching products directly from DB:', error);
    if (error instanceof Error) {
      console.error('[MySQL] Error message:', error.message);
      console.error('[MySQL] Error stack:', error.stack);
    }
    return [];
  }
}

// Function to directly fetch foods from DB with type conversion
async function fetchFoodsFromDB(): Promise<Food[]> {
  try {
    console.log('[MySQL] Executing query: SELECT f.id, f.name, f.calories, f.protein, f.carbs, f.fat, COALESCE(fc.name, f.category) AS category, f.image FROM foods f LEFT JOIN food_categories fc ON f.category = fc.id');
    const [rows] = await pool.execute(
      `SELECT f.id, f.name, f.calories, f.protein, f.carbs, f.fat, COALESCE(fc.name, f.category) AS category, f.image
       FROM foods f
       LEFT JOIN food_categories fc ON f.category = fc.id`
    );
    console.log('[MySQL] Raw foods result:', rows);
    
    // Convert string values to their proper types
    return (rows as any[]).map(row => ({
      ...row,
      calories: Number(row.calories),
      protein: Number(row.protein),
      carbs: Number(row.carbs),
      fat: Number(row.fat),
      portion: Number(row.portion ?? 0)
    })) as Food[];
  } catch (error) {
    console.error('Error fetching foods directly from DB:', error);
    return [];
  }
}

// Initialize client-side data to match server data
if (typeof window !== 'undefined') {
  try {
    // @ts-ignore - This is for Next.js hydration
    if (window.__NEXT_DATA__ && window.__NEXT_DATA__.props?.pageProps?.initialProducts) {
      // @ts-ignore
      products.splice(0, products.length, ...window.__NEXT_DATA__.props.pageProps.initialProducts);
      console.log('[Client] Hydrated products from server data');
    }
    
    // @ts-ignore
    if (window.__NEXT_DATA__ && window.__NEXT_DATA__.props?.pageProps?.initialFoods) {
      // @ts-ignore
      foods.splice(0, foods.length, ...window.__NEXT_DATA__.props.pageProps.initialFoods);
      console.log('[Client] Hydrated foods from server data');
    }
  } catch (e) {
    console.error('Error getting hydration data:', e);
  }
}

// Get all products - will use MySQL or client-side based strictly on config.ts
export async function getProducts(): Promise<Product[]> {
  // Client-side - use fetch instead of direct database access
  if (typeof window !== 'undefined') {
    try {
      console.log('[Client] Fetching products via API');
      // Try to fetch from an API endpoint
      const response = await fetch('/api/products');
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[Client] Fetched ${data.products.length} products via API`);
        // Update the exported products array
        products.splice(0, products.length, ...data.products);
        return data.products;
      } else {
        console.error('[Client] Error fetching products via API:', response.statusText);
      }
    } catch (error) {
      console.error('[Client] Error fetching products via API:', error);
    }
    
    // Return whatever is in the products array (could be from initial props)
    console.log('[Client] Using products from client-side data, count:', products.length);
    return [...products];
  }
  
  // Server-side processing
  // Wait for database initialization if needed
  if (isUsingMySQL() && dbInitializationPromise && !dbInitialized) {
    console.log('[MySQL] Waiting for database initialization');
    await dbInitializationPromise;
  }
  
  console.log('[MySQL] getProducts() called', {
    isServer: typeof window === 'undefined',
    usingMySQL: isUsingMySQL(),
    hasPool: pool !== null,
    dbInitialized
  });
  
  if (isServerWithMySQLAvailable()) {
    try {
      console.log('[MySQL] Fetching fresh products from database');
      const dbProducts = await fetchProductsFromDB();
      console.log('[MySQL] Fetched', dbProducts.length, 'products from database');
      
      // Update cache and exported array
      SERVER_CACHED_PRODUCTS = dbProducts;
      products.splice(0, products.length, ...dbProducts);
      return [...dbProducts]; // Return copy to prevent mutations
    } catch (error) {
      console.error('[MySQL] Error fetching products from MySQL:', error);
      // Check if array already has items (from initialization)
      if (products.length > 0) {
        console.log('[MySQL] Using', products.length, 'products from exported array');
        return [...products];
      }
      return []; // Return empty array on error when MySQL is enabled
    }
  }
  
  // Return the exported products array which contains either:
  // 1. Server-side MySQL data (if MySQL is enabled)
  // 2. Client-side demo data (if MySQL is disabled in config)
  console.log('[Data] Returning', products.length, 'products from exported array');
  return [...products];
}

// Get all foods - will use MySQL or client-side based strictly on config.ts 
export async function getFoods(): Promise<Food[]> {
  // Client-side - use fetch instead of direct database access
  if (typeof window !== 'undefined') {
    try {
      console.log('[Client] Fetching foods via API');
      // Try to fetch from an API endpoint
      const response = await fetch('/api/foods');
      
      if (response.ok) {
        const data = await response.json();
        console.log(`[Client] Fetched ${data.foods.length} foods via API`);
        // Update the exported foods array
        foods.splice(0, foods.length, ...data.foods);
        return data.foods;
      } else {
        console.error('[Client] Error fetching foods via API:', response.statusText);
      }
    } catch (error) {
      console.error('[Client] Error fetching foods via API:', error);
    }
    
    // Return whatever is in the foods array (could be from initial props)
    console.log('[Client] Using foods from client-side data, count:', foods.length);
    return [...foods];
  }
  
  // Server-side processing
  if (isServerWithMySQLAvailable()) {
    try {
      console.log('[MySQL] Executing SQL to fetch foods');
      const dbFoods = await fetchFoodsFromDB();
      console.log('[MySQL] Raw foods result:', dbFoods);
      // Fallback to clientSideFoods if DB is empty
      const resultFoods = dbFoods.length > 0 ? dbFoods : clientSideFoods;
      // Update cache and exported array
      SERVER_CACHED_FOODS = resultFoods;
      foods.splice(0, foods.length, ...resultFoods);
      return [...resultFoods]; // Return copy to prevent mutations
    } catch (error) {
      console.error('[MySQL] Error fetching foods from MySQL:', error);
      console.warn('[MySQL] Using client-side foods on error');
      SERVER_CACHED_FOODS = clientSideFoods;
      foods.splice(0, foods.length, ...clientSideFoods);
      return [...clientSideFoods];
    }
  }
  
  // Return the exported foods array which contains either:
  // 1. Server-side MySQL data (if MySQL is enabled)
  // 2. Client-side demo data (if MySQL is disabled in config)
  return [...foods];
}

// Función para generar un menú aleatorio
export async function generateRandomMenu() {
  // Ensure foods are loaded: fetch from API in client, initialize on server
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/foods');
      const data = await res.json();
      if (data.foods) {
        // Populate global foods array for generateMeal
        foods.splice(0, foods.length, ...data.foods);
      }
    } catch (err) {
      console.error('[generateRandomMenu] Error fetching foods on client:', err);
    }
    // Fallback to client-side demo data if API returned no foods
    if (foods.length === 0) {
      console.warn('[generateRandomMenu] No foods from API, using client-side fallback');
      foods.splice(0, foods.length, ...clientSideFoods);
    }
  } else {
    // Server-side: initialize from MySQL or client data
    if (foods.length === 0) await initializeData();
  }
  
  const breakfast = generateMeal("Desayuno", 500, 40);
  const lunch = generateMeal("Almuerzo", 600, 40);
  const dinner = generateMeal("Cena", 500, 40);

  const totalCalories = breakfast.calories + lunch.calories + dinner.calories;
  const totalProtein = breakfast.protein + lunch.protein + dinner.protein;
  const totalCarbs = breakfast.carbs + lunch.carbs + dinner.carbs;
  const totalFat = breakfast.fat + lunch.fat + dinner.fat;

  // Use a stable, deterministic ID to avoid hydration mismatch from Date.now()
  const menuId = `menu_${breakfast.id}_${lunch.id}_${dinner.id}`;

  return {
    id: menuId,
    name: `Menú Personalizado`, // Static name to avoid hydration mismatch
    meals: [breakfast, lunch, dinner],
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
  };
}

// Función para generar una comida aleatoria
function generateMeal(name: string, targetCalories: number, minProtein: number) {
  // Use a consistent seed for random selection to prevent hydration mismatch
  const seed = name === "Desayuno" ? 0 : name === "Almuerzo" ? 1 : 2;
  
  const mealFoods: { food: Food; grams: number }[] = [];
  let currentCalories = 0;
  let currentProtein = 0;
  let currentCarbs = 0;
  let currentFat = 0;

  // Get appropriate foods (normalize category to lowercase)
  const proteinFoods = foods.filter(
    (food) => food.category.toLowerCase() === "proteínas"
  );
  const carbFoods = foods.filter(
    (food) => food.category.toLowerCase() === "carbohidratos"
  );
  const veggies = foods.filter(
    (food) => {
      const cat = food.category.toLowerCase();
      return cat === "verduras" || cat === "frutas";
    }
  );
  const fatFoods = foods.filter(
    (food) => food.category.toLowerCase() === "grasas"
  );

  // Use consistent selection to avoid hydration issues
  const randomProteinFood = proteinFoods.length > 0 ? proteinFoods[seed % proteinFoods.length] : null;
  const randomCarbFood = carbFoods.length > 0 ? carbFoods[seed % carbFoods.length] : null;
  const randomVeggie = veggies.length > 0 ? veggies[seed % veggies.length] : null;
  const randomFatFood = fatFoods.length > 0 ? fatFoods[seed % fatFoods.length] : null;

  // Build meal only if we have the required foods
  if (randomProteinFood) {
    // Protein
    const proteinGrams = Math.ceil((minProtein / randomProteinFood.protein) * 100);
    mealFoods.push({ food: randomProteinFood, grams: proteinGrams });
    
    currentCalories += (randomProteinFood.calories * proteinGrams) / 100;
    currentProtein += (randomProteinFood.protein * proteinGrams) / 100;
    currentCarbs += (randomProteinFood.carbs * proteinGrams) / 100;
    currentFat += (randomProteinFood.fat * proteinGrams) / 100;
    
    // Carbs
    if (randomCarbFood) {
      const remainingCalories = targetCalories - currentCalories;
      const carbGrams = Math.ceil((remainingCalories / randomCarbFood.calories) * 100 * 0.7);
      
      mealFoods.push({ food: randomCarbFood, grams: carbGrams });
      
      currentCalories += (randomCarbFood.calories * carbGrams) / 100;
      currentProtein += (randomCarbFood.protein * carbGrams) / 100;
      currentCarbs += (randomCarbFood.carbs * carbGrams) / 100;
      currentFat += (randomCarbFood.fat * carbGrams) / 100;
    }
    
    // Veggies
    if (randomVeggie) {
      mealFoods.push({ food: randomVeggie, grams: 100 });
      
      currentCalories += randomVeggie.calories;
      currentProtein += randomVeggie.protein;
      currentCarbs += randomVeggie.carbs;
      currentFat += randomVeggie.fat;
    }
    
    // Fats if needed
    if (currentCalories < targetCalories * 0.9 && randomFatFood) {
      const fatGrams = Math.min(30, Math.ceil(((targetCalories - currentCalories) / randomFatFood.calories) * 100));
      
      mealFoods.push({ food: randomFatFood, grams: fatGrams });
      
      currentCalories += (randomFatFood.calories * fatGrams) / 100;
      currentProtein += (randomFatFood.protein * fatGrams) / 100;
      currentCarbs += (randomFatFood.carbs * fatGrams) / 100;
      currentFat += (randomFatFood.fat * fatGrams) / 100;
    }
  }

  // Use a deterministic ID based on meal name
  const mealId = `meal_${name.toLowerCase().replace(/\s+/g, '_')}`;

  return {
    id: mealId,
    name,
    foods: mealFoods,
    calories: Math.round(currentCalories),
    protein: Math.round(currentProtein),
    carbs: Math.round(currentCarbs),
    fat: Math.round(currentFat),
  };
}

// Función para calcular macros de una comida personalizada
export function calculateMealMacros(foods: { food: Food; grams: number }[]) {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  foods.forEach((item) => {
    calories += (item.food.calories * item.grams) / 100;
    protein += (item.food.protein * item.grams) / 100;
    carbs += (item.food.carbs * item.grams) / 100;
    fat += (item.food.fat * item.grams) / 100;
  });

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
}

// Additional database functions - all now strictly follow config.ts

// Get a product by ID
export async function getProductById(id: string): Promise<Product | null> {
  if (isServerWithMySQLAvailable()) {
    try {
      const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
      const products = (rows as any[]).map(row => ({
        ...row,
        price: Number(row.price),
        stock: Number(row.stock)
      }));
      
      if (products.length === 0) return null;
      return products[0] as Product;
    } catch (error) {
      console.error('Error fetching product by ID from MySQL:', error);
      return null; // Return null on error when MySQL is enabled
    }
  }
  
  // If MySQL is disabled, use the client-side data
  return products.find(p => p.id === id) || null;
}

// Get a food by ID
export async function getFoodById(id: string): Promise<Food | null> {
  if (isServerWithMySQLAvailable()) {
    try {
      const [rows] = await pool.execute('SELECT * FROM foods WHERE id = ?', [id]);
      const foods = (rows as any[]).map(row => ({
        ...row,
        calories: Number(row.calories),
        protein: Number(row.protein),
        carbs: Number(row.carbs),
        fat: Number(row.fat),
        portion: Number(row.portion)
      }));
      
      if (foods.length === 0) return null;
      return foods[0] as Food;
    } catch (error) {
      console.error('Error fetching food by ID from MySQL:', error);
      return null; // Return null on error when MySQL is enabled
    }
  }
  
  // If MySQL is disabled, use the client-side data
  return foods.find(f => f.id === id) || null;
}

// Get foods by category
export async function getFoodsByCategory(category: string): Promise<Food[]> {
  if (isServerWithMySQLAvailable()) {
    try {
      const [rows] = await pool.execute('SELECT * FROM foods WHERE category = ?', [category]);
      return (rows as any[]).map(row => ({
        ...row,
        calories: Number(row.calories),
        protein: Number(row.protein),
        carbs: Number(row.carbs),
        fat: Number(row.fat),
        portion: Number(row.portion)
      })) as Food[];
    } catch (error) {
      console.error(`Error fetching foods by category ${category} from MySQL:`, error);
      return []; // Return empty array on error when MySQL is enabled
    }
  }
  
  // If MySQL is disabled, use the client-side data
  return foods.filter(f => f.category === category);
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (isServerWithMySQLAvailable()) {
    try {
      const [rows] = await pool.execute('SELECT * FROM products WHERE category = ?', [category]);
      return (rows as any[]).map(row => ({
        ...row,
        price: Number(row.price),
        stock: Number(row.stock)
      })) as Product[];
    } catch (error) {
      console.error(`Error fetching products by category ${category} from MySQL:`, error);
      return []; // Return empty array on error when MySQL is enabled
    }
  }
  
  // If MySQL is disabled, use the client-side data
  return products.filter(p => p.category === category);
}

// Update product stock
export async function updateProductStock(id: string, newStock: number): Promise<boolean> {
  if (isServerWithMySQLAvailable()) {
    try {
      await pool.execute('UPDATE products SET stock = ? WHERE id = ?', [newStock, id]);
      return true;
    } catch (error) {
      console.error('Error updating product stock in MySQL:', error);
      return false;
    }
  }
  
  // If MySQL is disabled, update the client-side data
  const product = products.find(p => p.id === id);
  if (product) {
    product.stock = newStock;
    return true;
  }
  return false;
}

// Export these functions to make data available for Next.js's getStaticProps/getServerSideProps
export async function getInitialData() {
  // Wait for database initialization if needed
  if (isUsingMySQL() && dbInitializationPromise && !dbInitialized) {
    console.log('[MySQL] Waiting for database initialization in getInitialData()');
    await dbInitializationPromise;
  }
  
  // Force a refresh of the data
  if (isServerWithMySQLAvailable() && (!products.length || !foods.length)) {
    console.log('[MySQL] Forcing data refresh in getInitialData()');
    await initializeData();
  }
  
  // Return copies to prevent mutations
  return {
    products: [...products],
    foods: [...foods]
  };
}

// Add a new function for explicitly using in pages 
// that returns a promise that resolves when data is ready
export async function waitForData(): Promise<boolean> {
  // Client-side handling
  if (typeof window !== 'undefined') {
    console.log('[Client] waitForData called on client');
    return true;
  }

  // Server-side with MySQL
  if (isUsingMySQL()) {
    // Wait for database initialization if needed
    if (dbInitializationPromise && !dbInitialized) {
      console.log('[MySQL] Waiting for database initialization in waitForData()');
      await dbInitializationPromise;
    }
     
    // Force a refresh of the data if needed
    if (!products.length || !foods.length) {
      console.log('[MySQL] Forcing data refresh in waitForData()');
      await initializeData();
    }
    return true;
  }
  
  // Server-side without MySQL - ensure data is loaded
  if (!isUsingMySQL() && (!products.length || !foods.length)) {
    console.log('[Server] Loading client-side data in waitForData()');
    products.splice(0, products.length, ...clientSideProducts);
    foods.splice(0, foods.length, ...clientSideFoods);
  }
  
  return true;
}

// -- USERS --------------------------------------------------------------------
export async function getUsers(): Promise<User[]> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute('SELECT id, name, email, created_at AS createdAt, updated_at AS updatedAt FROM users');
    return (rows as any[]).map(r => ({ ...r }));
  }
  return [];
}

export async function getUserById(id: string): Promise<User | null> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at AS createdAt, updated_at AS updatedAt FROM users WHERE id = ?',
      [id]
    );
    const users = rows as any[];
    return users.length ? users[0] : null;
  }
  return null;
}

// -- AUTH ----------------------------------------------------------------------
/**
 * Authenticate a user by email and password
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, created_at AS createdAt, updated_at AS updatedAt FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    const users = rows as any[];
    return users.length ? (users[0] as User) : null;
  }
  return null;
}
/**
 * Create a new user
 */
export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  if (isServerWithMySQLAvailable()) {
    const id = `user_${Date.now()}`;
    const createdAt = new Date().toISOString();
    try {
      await pool.execute(
        'INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)',
        [id, name, email, password, createdAt]
      );
      return { id, name, email, createdAt };
    } catch (err) {
      console.error('Error creating user:', err);
      return null;
    }
  }
  return null;
}

// -- PRODUCT CATEGORIES --------------------------------------------------------
export async function getProductCategories(): Promise<ProductCategory[]> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute('SELECT id, name, description, created_at AS createdAt FROM product_categories');
    return rows as any[];
  }
  return [];
}

export async function getProductCategoryById(id: string): Promise<ProductCategory | null> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute('SELECT id, name, description, created_at AS createdAt FROM product_categories WHERE id = ?', [id]);
    const cats = rows as any[];
    return cats.length ? cats[0] : null;
  }
  return null;
}

// -- FOOD CATEGORIES -----------------------------------------------------------
export async function getFoodCategories(): Promise<FoodCategory[]> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute('SELECT id, name, description, created_at AS createdAt FROM food_categories');
    return rows as any[];
  }
  return [];
}

export async function getFoodCategoryById(id: string): Promise<FoodCategory | null> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute('SELECT id, name, description, created_at AS createdAt FROM food_categories WHERE id = ?', [id]);
    const cats = rows as any[];
    return cats.length ? cats[0] : null;
  }
  return null;
}

// -- SHOPPING CART -------------------------------------------------------------
export async function getCartItems(userId: string): Promise<ShoppingCartItem[]> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute(
      `SELECT sc.id, sc.user_id AS userId, sc.product_id AS productId, sc.quantity,
              p.id AS productId, p.name, p.description, p.price, p.image, p.category, p.stock
       FROM shopping_carts sc
       JOIN products p ON sc.product_id = p.id
       WHERE sc.user_id = ?`,
      [userId]
    );
    return (rows as any[]).map(r => ({
      id: r.id,
      userId: r.userId,
      productId: r.productId,
      quantity: Number(r.quantity),
      product: { id: r.productId, name: r.name, description: r.description, price: Number(r.price), image: r.image, category: r.category, stock: Number(r.stock) }
    }));
  }
  return [];
}

export async function addCartItem(userId: string, productId: string, quantity: number): Promise<boolean> {
  if (isServerWithMySQLAvailable()) {
    try {
      await pool.execute(
        `INSERT INTO shopping_carts (id, user_id, product_id, quantity)
         VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
        [
          `cart_${userId}_${productId}`, userId, productId, quantity, quantity
        ]
      );
      return true;
    } catch (err) {
      console.error('Error adding cart item:', err);
      return false;
    }
  }
  return false;
}

export async function updateCartItem(userId: string, productId: string, quantity: number): Promise<boolean> {
  if (isServerWithMySQLAvailable()) {
    try {
      await pool.execute(
        'UPDATE shopping_carts SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
      return true;
    } catch (err) {
      console.error('Error updating cart item:', err);
      return false;
    }
  }
  return false;
}

export async function removeCartItem(userId: string, productId: string): Promise<boolean> {
  if (isServerWithMySQLAvailable()) {
    try {
      await pool.execute(
        'DELETE FROM shopping_carts WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
      return true;
    } catch (err) {
      console.error('Error removing cart item:', err);
      return false;
    }
  }
  return false;
}

export async function clearCart(userId: string): Promise<boolean> {
  if (isServerWithMySQLAvailable()) {
    try {
      await pool.execute('DELETE FROM shopping_carts WHERE user_id = ?', [userId]);
      return true;
    } catch (err) {
      console.error('Error clearing cart:', err);
      return false;
    }
  }
  return false;
}

// -- ADDRESSES -----------------------------------------------------------------
export async function getAddresses(userId: string): Promise<Address[]> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute(
      'SELECT * FROM addresses WHERE user_id = ?',
      [userId]
    );
    return rows as any[];
  }
  return [];
}

export async function getAddressById(id: string): Promise<Address | null> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute(
      'SELECT * FROM addresses WHERE id = ?',
      [id]
    );
    const addrs = rows as any[];
    return addrs.length ? addrs[0] : null;
  }
  return null;
}

// Additional CRUD (create/update/delete) can be implemented similarly

// -- ADD ADDRESS -------------------------------------------------------------
export async function addAddress(address: Address): Promise<boolean> {
  if (isServerWithMySQLAvailable()) {
    try {
      await pool.execute(
        'INSERT INTO addresses (id, user_id, full_name, street, city, postal_code, country, phone, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          address.id,
          address.userId,
          address.fullName,
          address.street,
          address.city,
          address.postalCode,
          address.country,
          address.phone || null,
          address.isDefault ? 1 : 0,
          address.createdAt,
        ]
      );
      return true;
    } catch (err) {
      console.error('Error adding address:', err);
      return false;
    }
  }
  return false;
}

// -- ORDERS & ORDER ITEMS ------------------------------------------------------
export async function getOrders(userId: string): Promise<Order[]> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE user_id = ?',
      [userId]
    );
    return (rows as any[]).map(r => ({
      id: r.id,
      userId: r.user_id,
      totalPrice: Number(r.total_price),
      shippingAddressId: r.shipping_address_id,
      status: r.status,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }
  return [];
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    const orders = rows as any[];
    return orders.length ? orders[0] : null;
  }
  return null;
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute(
      `SELECT oi.id, oi.order_id AS orderId, oi.product_id AS productId, oi.quantity, oi.price,
              p.id AS pId, p.name, p.description, p.price AS pPrice, p.image, p.category, p.stock
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return (rows as any[]).map(r => ({
      id: r.id,
      orderId: r.orderId,
      productId: r.productId,
      quantity: Number(r.quantity),
      price: Number(r.price),
      product: { id: r.pId, name: r.name, description: r.description, price: Number(r.pPrice), image: r.image, category: r.category, stock: Number(r.stock) }
    }));
  }
  return [];
}

// -- ADD ORDER ---------------------------------------------------------------
export async function addOrder(order: Order & { items: OrderItem[]; shippingAddressId?: string }): Promise<boolean> {
  if (isServerWithMySQLAvailable()) {
    try {
      await pool.execute(
        'INSERT INTO orders (id, user_id, total_price, shipping_address_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [order.id, order.userId, order.totalPrice, order.shippingAddressId || null, order.status, order.createdAt]
      );
      for (const item of order.items) {
        await pool.execute(
          'INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
          [item.id, order.id, item.productId, item.quantity, item.price]
        );
      }
      return true;
    } catch (err) {
      console.error('Error adding order:', err);
      return false;
    }
  }
  return false;
}

// -- USER MEALS ------------------------------------------------------------
export async function getUserMeals(userId: string): Promise<UserMeal[]> {
  if (isServerWithMySQLAvailable()) {
    const [mealsRows] = await pool.execute(
      `SELECT id, user_id AS userId, name, meal_date AS mealDate, meal_time AS mealTime,
              total_calories AS totalCalories, total_protein AS totalProtein,
              total_carbs AS totalCarbs, total_fat AS totalFat, created_at AS createdAt
       FROM user_meals WHERE user_id = ?`,
      [userId]
    );
    const meals = mealsRows as any[];
    const result: UserMeal[] = [];
    for (const m of meals) {
      const [foodRows] = await pool.execute(
        `SELECT umf.id, umf.meal_id AS mealId, umf.food_id AS foodId, umf.grams,
                f.id AS fId, f.name, f.calories, f.protein, f.carbs, f.fat, f.category, f.image
         FROM user_meal_foods umf
         JOIN foods f ON umf.food_id = f.id
         WHERE umf.meal_id = ?`,
        [m.id]
      );
      const foodsItems = (foodRows as any[]).map(r => ({
        id: r.id,
        mealId: r.mealId,
        foodId: r.foodId,
        grams: Number(r.grams),
        food: {
          id: r.fId,
          name: r.name,
          calories: Number(r.calories),
          protein: Number(r.protein),
          carbs: Number(r.carbs),
          fat: Number(r.fat),
          portion: Number(r.portion || 0),
          category: r.category,
          image: r.image
        }
      }));
      result.push({
        id: m.id,
        userId: m.userId,
        name: m.name,
        mealDate: m.mealDate,
        mealTime: m.mealTime,
        totalCalories: Number(m.totalCalories),
        totalProtein: Number(m.totalProtein),
        totalCarbs: Number(m.totalCarbs),
        totalFat: Number(m.totalFat),
        createdAt: m.createdAt,
        foods: foodsItems
      });
    }
    return result;
  }
  return [];
}

export async function addUserMeal(meal: UserMeal): Promise<boolean> {
  if (isServerWithMySQLAvailable()) {
    try {
      await pool.execute(
        `INSERT INTO user_meals (id, user_id, name, meal_date, meal_time, total_calories, total_protein, total_carbs, total_fat)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [meal.id, meal.userId, meal.name, meal.mealDate, meal.mealTime, meal.totalCalories, meal.totalProtein, meal.totalCarbs, meal.totalFat]
      );
      for (const item of meal.foods || []) {
        await pool.execute(
          `INSERT INTO user_meal_foods (id, meal_id, food_id, grams)
           VALUES (?, ?, ?, ?)`,
          [item.id, item.mealId, item.foodId, item.grams]
        );
      }
      return true;
    } catch (err) {
      console.error('Error adding user meal:', err);
      return false;
    }
  }
  return false;
}

// -- CONSULTATIONS ------------------------------------------------------------
export async function getConsultations(): Promise<Consultation[]> {
  if (isServerWithMySQLAvailable()) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, phone, service, message, status, created_at AS createdAt, updated_at AS updatedAt FROM consultations'
    );
    return (rows as any[]).map(r => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      service: r.service,
      message: r.message,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));
  }
  return [];
}

export async function addConsultation(consultation: Consultation): Promise<boolean> {
  if (isServerWithMySQLAvailable()) {
    try {
      await pool.execute(
        'INSERT INTO consultations (id, name, email, phone, service, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [consultation.id, consultation.name, consultation.email, consultation.phone, consultation.service, consultation.message, consultation.status, consultation.createdAt]
      );
      return true;
    } catch (err) {
      console.error('Error adding consultation:', err);
      return false;
    }
  }
  return false;
}

// Other tables (generated_menus, consultations, etc.) can be implemented analogously


