-- FitNutri Sample Data
USE fitnutri;

-- Insertar categorías de productos
INSERT INTO product_categories (id, name, description) VALUES
('cat_supplements', 'Suplementos', 'Proteínas, vitaminas y suplementos deportivos'),
('cat_equipment', 'Equipamiento', 'Equipos y accesorios para entrenamiento');

-- Insertar productos
INSERT INTO products (id, name, description, price, image, category, stock) VALUES
('prod_001', 'Proteína Whey Premium', 'Proteína de suero de alta calidad con 24g de proteína por porción. Sabor chocolate.', 29.99, '/placeholder.svg?height=300&width=300', 'suplementos', 50),
('prod_002', 'Creatina Monohidrato', 'Creatina pura para aumentar la fuerza y el rendimiento muscular. 500g.', 19.99, '/placeholder.svg?height=300&width=300', 'suplementos', 35),
('prod_003', 'Mancuernas Ajustables 20kg', 'Par de mancuernas ajustables de 2 a 20kg cada una. Perfectas para entrenamiento en casa.', 149.99, '/placeholder.svg?height=300&width=300', 'equipamiento', 10),
('prod_004', 'Barras Proteicas (12 uds)', 'Barras de proteína con 20g de proteína y bajo contenido en azúcar. Varios sabores.', 24.99, '/placeholder.svg?height=300&width=300', 'suplementos', 40),
('prod_005', 'Esterilla de Yoga Premium', 'Esterilla antideslizante de 6mm de grosor. Perfecta para yoga y pilates.', 34.99, '/placeholder.svg?height=300&width=300', 'equipamiento', 25),
('prod_006', 'BCAA en Polvo', 'Aminoácidos de cadena ramificada para recuperación muscular. 300g.', 22.99, '/placeholder.svg?height=300&width=300', 'suplementos', 30),
('prod_007', 'Banda de Resistencia Set', 'Set de 5 bandas de resistencia de diferentes intensidades con asas y anclaje para puerta.', 29.99, '/placeholder.svg?height=300&width=300', 'equipamiento', 20),
('prod_008', 'Multivitamínico Deportista', 'Complejo vitamínico especialmente formulado para deportistas. 90 cápsulas.', 19.99, '/placeholder.svg?height=300&width=300', 'suplementos', 45);

-- Insertar categorías de alimentos
INSERT INTO food_categories (id, name, description) VALUES
('cat_proteins', 'Proteínas', 'Carnes, pescados, huevos y lácteos'),
('cat_carbs', 'Carbohidratos', 'Cereales, tubérculos y granos'),
('cat_vegetables', 'Verduras', 'Vegetales y hortalizas'),
('cat_fruits', 'Frutas', 'Frutas frescas y naturales'),
('cat_fats', 'Grasas', 'Aceites, frutos secos y grasas saludables'),
('cat_legumes', 'Legumbres', 'Lentejas, garbanzos y judías'),
('cat_dairy', 'Lácteos', 'Leche, yogur y quesos');

-- Insertar alimentos
INSERT INTO foods (id, name, calories, protein, carbs, fat, portion, category, image) VALUES
('food_001', 'Pechuga de pollo', 165, 31, 0, 3.6, 100, 'proteínas', '/placeholder.svg?height=100&width=100'),
('food_002', 'Arroz blanco', 130, 2.7, 28, 0.3, 100, 'carbohidratos', '/placeholder.svg?height=100&width=100'),
('food_003', 'Huevo entero', 155, 13, 1.1, 11, 100, 'proteínas', '/placeholder.svg?height=100&width=100'),
('food_004', 'Atún en conserva', 116, 25.5, 0, 1, 100, 'proteínas', '/placeholder.svg?height=100&width=100'),
('food_005', 'Patata', 77, 2, 17, 0.1, 100, 'carbohidratos', '/placeholder.svg?height=100&width=100'),
('food_006', 'Aguacate', 160, 2, 8.5, 14.7, 100, 'grasas', '/placeholder.svg?height=100&width=100'),
('food_007', 'Salmón', 208, 20, 0, 13, 100, 'proteínas', '/placeholder.svg?height=100&width=100'),
('food_008', 'Brócoli', 34, 2.8, 6.6, 0.4, 100, 'verduras', '/placeholder.svg?height=100&width=100'),
('food_009', 'Pasta integral', 131, 5.3, 27.2, 0.9, 100, 'carbohidratos', '/placeholder.svg?height=100&width=100'),
('food_010', 'Queso fresco', 98, 14, 3.1, 4.3, 100, 'lácteos', '/placeholder.svg?height=100&width=100'),
('food_011', 'Lentejas', 116, 9, 20, 0.4, 100, 'legumbres', '/placeholder.svg?height=100&width=100'),
('food_012', 'Plátano', 89, 1.1, 22.8, 0.3, 100, 'frutas', '/placeholder.svg?height=100&width=100'),
('food_013', 'Avena', 389, 16.9, 66.3, 6.9, 100, 'carbohidratos', '/placeholder.svg?height=100&width=100'),
('food_014', 'Aceite de oliva', 884, 0, 0, 100, 100, 'grasas', '/placeholder.svg?height=100&width=100'),
('food_015', 'Yogur griego', 97, 9, 3.6, 5, 100, 'lácteos', '/placeholder.svg?height=100&width=100'),
('food_016', 'Ternera magra', 158, 26, 0, 5.4, 100, 'proteínas', '/placeholder.svg?height=100&width=100'),
('food_017', 'Quinoa', 120, 4.4, 21.3, 1.9, 100, 'carbohidratos', '/placeholder.svg?height=100&width=100'),
('food_018', 'Espinacas', 23, 2.9, 3.6, 0.4, 100, 'verduras', '/placeholder.svg?height=100&width=100'),
('food_019', 'Manzana', 52, 0.3, 13.8, 0.2, 100, 'frutas', '/placeholder.svg?height=100&width=100'),
('food_020', 'Almendras', 579, 21.2, 21.6, 49.9, 100, 'grasas', '/placeholder.svg?height=100&width=100');

-- Insertar usuario de ejemplo
INSERT INTO users (id, name, email, password) VALUES
('user_demo', 'Usuario Demo', 'demo@fitnutri.com', '$2b$10$example_hashed_password');

-- Insertar dirección de ejemplo
INSERT INTO addresses (id, user_id, full_name, street, city, postal_code, country, phone, is_default) VALUES
('addr_demo', 'user_demo', 'Usuario Demo', 'Calle Ejemplo 123', 'Madrid', '28001', 'España', '+34 600 000 000', TRUE);

-- Insertar comida de ejemplo
INSERT INTO user_meals (id, user_id, name, meal_date, meal_time, total_calories, total_protein, total_carbs, total_fat) VALUES
('meal_demo', 'user_demo', 'Desayuno Proteico', '2024-01-15', 'breakfast', 450, 35, 25, 18);

-- Insertar alimentos de la comida de ejemplo
INSERT INTO user_meal_foods (id, meal_id, food_id, grams) VALUES
('mf_001', 'meal_demo', 'food_003', 150), -- 1.5 huevos
('mf_002', 'meal_demo', 'food_013', 50),  -- 50g avena
('mf_003', 'meal_demo', 'food_015', 100); -- 100g yogur griego

-- Insertar consulta de ejemplo
INSERT INTO consultations (id, name, email, phone, service, message, status) VALUES
('cons_demo', 'Juan Pérez', 'juan@ejemplo.com', '+34 600 123 456', 'both', 'Necesito ayuda con mi plan de entrenamiento y nutrición para ganar masa muscular.', 'pending');
