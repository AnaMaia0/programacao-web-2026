/* ============================================================
   RecipeFolio — app.js
   Programação Web · Trabalho em Grupo 1 · UFOPA
   ============================================================ */

// ── CONSTANTES ────────────────────────────────────────────────
const API_BASE = 'https://www.themealdb.com/api/json/v1/1/';
const TRANSLATE_BASE = 'https://api.mymemory.translated.net/get';
const FAV_KEY = 'recipefolio_favorites';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

var HOME_TERMS = [
    'carbonara', 'tiramisu', 'paella', 'pizza margherita', 'sushi',
    'pad thai', 'beef wellington', 'ramen', 'lasagna', 'risotto',
    'croissant', 'tacos', 'chicken tikka', 'chocolate cake', 'cheesecake',
    'steak', 'creme brulee', 'biryani', 'pho', 'bibimbap'
];

// ── DICIONÁRIOS ───────────────────────────────────────────────
var CATEGORIA_PT = {
    'Beef': 'Carne Bovina', 'Chicken': 'Frango', 'Dessert': 'Sobremesa', 'Lamb': 'Cordeiro',
    'Miscellaneous': 'Diversas', 'Pasta': 'Massas', 'Pork': 'Porco', 'Seafood': 'Frutos do Mar',
    'Side': 'Acompanhamento', 'Starter': 'Entrada', 'Vegan': 'Vegano', 'Vegetarian': 'Vegetariano',
    'Breakfast': 'Café da Manhã', 'Goat': 'Cabra'
};

var AREA_PT = {
    'American': 'Americana', 'British': 'Britânica', 'Canadian': 'Canadense', 'Chinese': 'Chinesa',
    'Croatian': 'Croata', 'Dutch': 'Holandesa', 'Egyptian': 'Egípcia', 'Filipino': 'Filipina',
    'French': 'Francesa', 'Greek': 'Grega', 'Indian': 'Indiana', 'Irish': 'Irlandesa',
    'Italian': 'Italiana', 'Jamaican': 'Jamaicana', 'Japanese': 'Japonesa', 'Kenyan': 'Queniana',
    'Malaysian': 'Malaia', 'Mexican': 'Mexicana', 'Moroccan': 'Marroquina', 'Polish': 'Polonesa',
    'Portuguese': 'Portuguesa', 'Russian': 'Russa', 'Spanish': 'Espanhola', 'Thai': 'Tailandesa',
    'Tunisian': 'Tunisiana', 'Turkish': 'Turca', 'Vietnamese': 'Vietnamita', 'Brazilian': 'Brasileira',
    'Uruguayan': 'Uruguaia', 'Argentinian': 'Argentina', 'Saudi Arabian': 'Árabe Saudita', 'Unknown': 'Outra'
};

// ── DICIONÁRIO: MEDIDAS E DESCRIÇÕES ─────────────────────────
var MEDIDAS_PT = {
    // Colheres e xícaras
    'tbs': 'colh. sopa', 'tbsp': 'colh. sopa', 'tsp': 'colh. chá',
    'cup': 'xícara', 'cups': 'xícaras',
    // Pesos e volumes
    'g': 'g', 'kg': 'kg', 'ml': 'ml', 'l': 'l', 'oz': 'oz', 'lb': 'lb',
    // Unidades
    'piece': 'unidade', 'pieces': 'unidades',
    'slice': 'fatia', 'slices': 'fatias',
    'rashers': 'fatias', 'rasher': 'fatia',
    'can': 'lata', 'Can': 'lata', 'jar': 'pote', 'Jar': 'pote',
    'packet': 'pacote', 'Packet': 'pacote', 'bottle': 'garrafa',
    'clove': 'dente', 'cloves': 'dentes',
    'stalk': 'talo', 'stalks': 'talos',
    'sprig': 'ramo', 'sprigs': 'ramos',
    'knob': 'pedacinho', 'Knob': 'Pedacinho',
    'stick': 'tablete', 'Stick': 'Tablete',
    // Quantidades descritivas
    'dash': 'pitada', 'Dash': 'Pitada',
    'pinch': 'pitada', 'Pinch': 'Pitada',
    'handful': 'punhado', 'Handful': 'Punhado',
    'bunch': 'maço', 'Bunch': 'Maço',
    'drizzle': 'fio de', 'Drizzle': 'Fio de',
    'dusting': 'polvilhado', 'Dusting': 'Polvilhado',
    'splash': 'um toque de', 'Splash': 'Um toque de',
    'squeeze': 'espremido', 'Squeeze': 'Espremido',
    'generous': 'generoso', 'Generous': 'Generoso',
    // Preparo (que aparecem na medida)
    'beaten': 'batidos', 'Beaten': 'Batidos',
    'chopped': 'picado', 'Chopped': 'Picado',
    'diced': 'em cubos', 'Diced': 'Em cubos',
    'minced': 'picado fino', 'Minced': 'Picado fino',
    'grated': 'ralado', 'Grated': 'Ralado',
    'sliced': 'fatiado', 'Sliced': 'Fatiado',
    'whole': 'inteiro', 'Whole': 'Inteiro',
    'crushed': 'esmagado', 'Crushed': 'Esmagado',
    'ground': 'moído', 'Ground': 'Moído',
    'dried': 'seco', 'Dried': 'Seco',
    'fresh': 'fresco', 'Fresh': 'Fresco',
    'frozen': 'congelado', 'Frozen': 'Congelado',
    'cooked': 'cozido', 'Cooked': 'Cozido',
    'raw': 'cru', 'Raw': 'Cru',
    'peeled': 'descascado', 'Peeled': 'Descascado',
    'deveined': 'limpo', 'Deveined': 'Limpo',
    // Tamanhos
    'large': 'grande', 'Large': 'Grande',
    'medium': 'médio', 'Medium': 'Médio',
    'small': 'pequeno', 'Small': 'Pequeno',
    // Frases
    'to taste': 'a gosto', 'To Taste': 'A gosto',
    'to serve': 'para servir', 'To Serve': 'Para servir',
    'as needed': 'quanto baste', 'As Needed': 'Quanto baste',
    'for garnish': 'para decorar', 'For Garnish': 'Para decorar',
    'for frying': 'para fritar', 'For Frying': 'Para fritar',
    'for greasing': 'para untar', 'For Greasing': 'Para untar'
};

// ── DICIONÁRIO: TAGS ──────────────────────────────────────────
var TAGS_PT = {
    'Meat': 'Carne', 'Stew': 'Ensopado', 'Soup': 'Sopa', 'Salad': 'Salada',
    'Baking': 'Assado no Forno', 'Grilling': 'Grelhado', 'Frying': 'Frito',
    'Roasting': 'Assado', 'Steaming': 'Cozido no Vapor', 'Boiling': 'Cozido',
    'Slow Cooker': 'Panela Elétrica', 'Pressure Cooker': 'Panela de Pressão',
    'BBQ': 'Churrasco', 'Barbecue': 'Churrasco',
    'Vegetarian': 'Vegetariano', 'Vegan': 'Vegano',
    'Seafood': 'Frutos do Mar', 'Fish': 'Peixe', 'Chicken': 'Frango',
    'Beef': 'Carne Bovina', 'Pork': 'Porco', 'Lamb': 'Cordeiro',
    'Dessert': 'Sobremesa', 'Sweet': 'Doce', 'Savory': 'Salgado',
    'Breakfast': 'Café da Manhã', 'Brunch': 'Brunch',
    'Lunch': 'Almoço', 'Dinner': 'Jantar', 'Snack': 'Lanche',
    'Starter': 'Entrada', 'Appetizer': 'Aperitivo', 'Side Dish': 'Acompanhamento',
    'Spicy': 'Apimentado', 'Mild': 'Suave', 'Comfort Food': 'Comida Caseira',
    'Quick': 'Rápido', 'Easy': 'Fácil', 'Healthy': 'Saudável',
    'Keto': 'Keto', 'Paleo': 'Paleo', 'Gluten-free': 'Sem Glúten',
    'Dairy-free': 'Sem Laticínios', 'LowCarbs': 'Baixo Carboidrato',
    'HighFat': 'Alto Teor de Gordura', 'Low-Fat': 'Baixo Teor de Gordura',
    'Alcoholic': 'Alcoólico', 'Non-Alcoholic': 'Não Alcoólico',
    'Italian': 'Italiana', 'Mexican': 'Mexicana', 'Asian': 'Asiática',
    'Indian': 'Indiana', 'Chinese': 'Chinesa', 'Japanese': 'Japonesa',
    'French': 'Francesa', 'American': 'Americana', 'British': 'Britânica',
    'Mediterranean': 'Mediterrânea', 'Middle Eastern': 'Oriente Médio',
    'Cake': 'Bolo', 'Pie': 'Torta', 'Bread': 'Pão', 'Pasta': 'Massa',
    'Rice': 'Arroz', 'Noodles': 'Macarrão', 'Pizza': 'Pizza',
    'Sandwich': 'Sanduíche', 'Burger': 'Hambúrguer',
    'Smoothie': 'Vitamina', 'Juice': 'Suco', 'Cocktail': 'Coquetel',
    'Creamy': 'Cremoso', 'Crispy': 'Crocante', 'Tender': 'Macio',
    'One Pot': 'Panela Única', '30 Minutes': '30 Minutos',
    'Make Ahead': 'Pode Preparar Antes', 'Freezer Friendly': 'Pode Congelar'
};

var INGREDIENTES_PT = {
    // Proteínas e carnes
    'Chicken': 'Frango', 'Beef': 'Carne Bovina', 'Pork': 'Porco', 'Lamb': 'Cordeiro',
    'Salmon': 'Salmão', 'Tuna': 'Atum', 'Shrimp': 'Camarão', 'Prawns': 'Camarões', 'Fish': 'Peixe',
    'Cod': 'Bacalhau', 'Turkey': 'Peru', 'Duck': 'Pato', 'Bacon': 'Bacon', 'Ham': 'Presunto',
    'Sausage': 'Linguiça', 'Chorizo': 'Chorizo', 'Pancetta': 'Panceta',
    'Mince': 'Carne Moída', 'Ground Beef': 'Carne Moída', 'Steak': 'Bife',
    'Beef Fillet': 'Filé de Carne Bovina', 'Chicken Fillet': 'Filé de Frango',
    'Pork Fillet': 'Filé de Porco', 'Chicken Breast': 'Peito de Frango',
    'Chicken Thighs': 'Coxas de Frango', 'Chicken Legs': 'Pernas de Frango',
    'Beef Mince': 'Carne Bovina Moída', 'Pork Mince': 'Carne de Porco Moída',
    'Lamb Mince': 'Carne de Cordeiro Moída', 'Veal': 'Vitela',
    'Parma Ham': 'Presunto Parma', 'Prosciutto': 'Prosciutto', 'Serrano Ham': 'Presunto Serrano',
    'Pepperoni': 'Pepperoni', 'Salami': 'Salame', 'Anchovies': 'Anchovas',
    'Crab': 'Caranguejo', 'Lobster': 'Lagosta', 'Mussels': 'Mexilhões', 'Clams': 'Mariscos',
    'Scallops': 'Vieiras', 'Squid': 'Lula', 'Octopus': 'Polvo',
    // Ovos
    'Egg': 'Ovo', 'Eggs': 'Ovos', 'Egg Yolks': 'Gemas de Ovo', 'Egg Yolk': 'Gema de Ovo',
    'Egg Whites': 'Claras de Ovo', 'Egg White': 'Clara de Ovo',
    'Beaten Eggs': 'Ovos Batidos', 'Beaten Egg Yolks': 'Gemas Batidas',
    'Free-range Eggs': 'Ovos Caipiras',
    // Laticínios
    'Milk': 'Leite', 'Butter': 'Manteiga', 'Cheese': 'Queijo', 'Cream': 'Creme de Leite',
    'Yogurt': 'Iogurte', 'Yoghurt': 'Iogurte', 'Sour Cream': 'Creme Azedo',
    'Cream Cheese': 'Cream Cheese', 'Parmesan': 'Parmesão', 'Mozzarella': 'Muçarela',
    'Ricotta': 'Ricota', 'Cheddar': 'Cheddar', 'Gruyere': 'Gruyère', 'Feta': 'Feta',
    'Heavy Cream': 'Creme de Leite Fresco', 'Double Cream': 'Creme de Leite',
    'Single Cream': 'Creme de Leite Light', 'Whipping Cream': 'Creme para Chantilly',
    'Mascarpone': 'Mascarpone', 'Brie': 'Brie', 'Gouda': 'Gouda', 'Emmental': 'Emmental',
    'Cottage Cheese': 'Cottage', 'Crème Fraîche': 'Crème Fraîche',
    'Buttermilk': 'Leitelho', 'Condensed Milk': 'Leite Condensado',
    'Evaporated Milk': 'Leite Evaporado', 'Skim Milk': 'Leite Desnatado',
    // Vegetais
    'Onion': 'Cebola', 'Onions': 'Cebolas', 'Garlic': 'Alho', 'Tomato': 'Tomate',
    'Tomatoes': 'Tomates', 'Cherry Tomatoes': 'Tomates-Cereja', 'Potato': 'Batata',
    'Potatoes': 'Batatas', 'Carrot': 'Cenoura', 'Carrots': 'Cenouras', 'Celery': 'Aipo',
    'Spinach': 'Espinafre', 'Lettuce': 'Alface', 'Broccoli': 'Brócolis', 'Kale': 'Couve',
    'Mushroom': 'Cogumelo', 'Mushrooms': 'Cogumelos', 'Zucchini': 'Abobrinha',
    'Courgette': 'Abobrinha', 'Eggplant': 'Berinjela', 'Aubergine': 'Berinjela',
    'Bell Pepper': 'Pimentão', 'Red Pepper': 'Pimentão Vermelho',
    'Green Pepper': 'Pimentão Verde', 'Yellow Pepper': 'Pimentão Amarelo',
    'Chili': 'Pimenta', 'Chilli': 'Pimenta', 'Jalapeno': 'Jalapeño', 'Jalapeño': 'Jalapeño',
    'Spring Onions': 'Cebolinha', 'Spring Onion': 'Cebolinha',
    'Green Onions': 'Cebolinha', 'Green Onion': 'Cebolinha',
    'Leek': 'Alho-Poró', 'Leeks': 'Alho-Poró', 'Fennel': 'Erva-Doce',
    'Corn': 'Milho', 'Sweetcorn': 'Milho Verde', 'Peas': 'Ervilhas',
    'Cucumber': 'Pepino', 'Cabbage': 'Repolho', 'Red Cabbage': 'Repolho Roxo',
    'Cauliflower': 'Couve-Flor', 'Asparagus': 'Aspargo', 'Artichoke': 'Alcachofra',
    'Sweet Potato': 'Batata-Doce', 'Pumpkin': 'Abóbora', 'Butternut Squash': 'Abóbora',
    'Beetroot': 'Beterraba', 'Radish': 'Rabanete', 'Turnip': 'Nabo',
    'Bok Choy': 'Pak Choi', 'Bamboo Shoots': 'Broto de Bambu',
    'Bean Sprouts': 'Broto de Feijão', 'Edamame': 'Edamame',
    'Garlic Cloves': 'Dentes de Alho', 'Garlic Clove': 'Dente de Alho',
    'Shallot': 'Chalota', 'Shallots': 'Chalotas',
    'Sun-Dried Tomatoes': 'Tomates Secos', 'Sundried Tomatoes': 'Tomates Secos',
    'Tomato Concasse': 'Tomate Concassé', 'Vine Tomatoes': 'Tomates de Videira',
    'Rocket': 'Rúcula', 'Arugula': 'Rúcula', 'Watercress': 'Agrião',
    'Brussels Sprouts': 'Couves-de-Bruxelas', 'Pak Choi': 'Pak Choi',
    'Mangetout': 'Vagem Torta', 'Sugar Snap Peas': 'Ervilhas-Tortas',
    'Chestnut Mushrooms': 'Cogumelos-Castanha', 'Portobello Mushrooms': 'Cogumelos Portobello',
    'Shiitake Mushrooms': 'Cogumelos Shiitake', 'Button Mushrooms': 'Cogumelos-de-Paris',
    // Frutas
    'Lemon': 'Limão', 'Lime': 'Lima', 'Orange': 'Laranja', 'Apple': 'Maçã', 'Banana': 'Banana',
    'Strawberry': 'Morango', 'Coconut': 'Coco', 'Mango': 'Manga', 'Pineapple': 'Abacaxi',
    'Avocado': 'Abacate', 'Blueberry': 'Mirtilo', 'Raspberry': 'Framboesa',
    'Cranberry': 'Cranberry', 'Grape': 'Uva', 'Peach': 'Pêssego', 'Pear': 'Pera',
    'Plum': 'Ameixa', 'Cherry': 'Cereja', 'Kiwi': 'Kiwi', 'Pomegranate': 'Romã',
    'Passionfruit': 'Maracujá', 'Papaya': 'Mamão', 'Melon': 'Melão', 'Watermelon': 'Melancia',
    'Fig': 'Figo', 'Date': 'Tâmara', 'Dried Apricots': 'Damascos Secos', 'Raisins': 'Uvas Passas',
    // Grãos, massas e farinhas
    'Flour': 'Farinha de Trigo', 'Plain Flour': 'Farinha de Trigo',
    'Self-raising Flour': 'Farinha com Fermento', 'Wholemeal Flour': 'Farinha Integral',
    'Rice': 'Arroz', 'Brown Rice': 'Arroz Integral', 'Arborio Rice': 'Arroz Arbóreo',
    'Basmati Rice': 'Arroz Basmati', 'Jasmine Rice': 'Arroz Jasmim',
    'Pasta': 'Massa', 'Spaghetti': 'Espaguete', 'Penne': 'Penne', 'Fettuccine': 'Fettuccine',
    'Tagliatelle': 'Tagliatelle', 'Linguine': 'Linguine', 'Rigatoni': 'Rigatoni',
    'Lasagne Sheets': 'Lâminas de Lasanha', 'Lasagna Sheets': 'Lâminas de Lasanha',
    'Bread': 'Pão', 'White Bread': 'Pão Branco', 'Sourdough': 'Pão de Fermentação Natural',
    'Breadcrumbs': 'Farinha de Rosca', 'Panko Breadcrumbs': 'Panko',
    'Oats': 'Aveia', 'Cornstarch': 'Amido de Milho', 'Cornflour': 'Amido de Milho',
    'Semolina': 'Semolina', 'Polenta': 'Polenta', 'Couscous': 'Cuscuz',
    'Tortilla': 'Tortilha', 'Noodles': 'Macarrão', 'Rice Noodles': 'Macarrão de Arroz',
    'Phyllo Pastry': 'Massa Filo', 'Puff Pastry': 'Massa Folhada',
    'Shortcrust Pastry': 'Massa Quebrada', 'Filo Pastry': 'Massa Filo',
    // Temperos e especiarias
    'Salt': 'Sal', 'Pepper': 'Pimenta-do-reino', 'Black Pepper': 'Pimenta-do-reino',
    'White Pepper': 'Pimenta Branca', 'Sugar': 'Açúcar', 'Brown Sugar': 'Açúcar Mascavo',
    'Icing Sugar': 'Açúcar de Confeiteiro', 'Caster Sugar': 'Açúcar Refinado',
    'Powdered Sugar': 'Açúcar de Confeiteiro', 'Demerara Sugar': 'Açúcar Demerara',
    'Olive Oil': 'Azeite de Oliva', 'Oil': 'Óleo', 'Vegetable Oil': 'Óleo Vegetal',
    'Sesame Oil': 'Óleo de Gergelim', 'Coconut Oil': 'Óleo de Coco',
    'Sunflower Oil': 'Óleo de Girassol', 'Rapeseed Oil': 'Óleo de Colza',
    'Basil': 'Manjericão', 'Parsley': 'Salsinha', 'Thyme': 'Tomilho', 'Rosemary': 'Alecrim',
    'Oregano': 'Orégano', 'Bay Leaves': 'Louro', 'Bay Leaf': 'Folha de Louro',
    'Mint': 'Hortelã', 'Dill': 'Endro', 'Tarragon': 'Estragão', 'Chives': 'Cebolinho',
    'Sage': 'Sálvia', 'Marjoram': 'Manjerona', 'Lemongrass': 'Capim-Limão',
    'Kaffir Lime Leaves': 'Folhas de Limão-Cafre', 'Curry Leaves': 'Folhas de Curry',
    'Cumin': 'Cominho', 'Paprika': 'Páprica', 'Turmeric': 'Açafrão-da-terra',
    'Cinnamon': 'Canela', 'Ginger': 'Gengibre', 'Coriander': 'Coentro',
    'Nutmeg': 'Noz-Moscada', 'Cloves': 'Cravo', 'Cardamom': 'Cardamomo',
    'Chilli Powder': 'Pimenta em Pó', 'Cayenne Pepper': 'Pimenta Caiena',
    'Allspice': 'Pimenta da Jamaica', 'Star Anise': 'Anis-Estrelado',
    'Saffron': 'Açafrão', 'Sumac': 'Sumagre', 'Za\'atar': 'Za\'atar',
    'Garam Masala': 'Garam Masala', 'Curry Powder': 'Curry em Pó',
    'Five Spice': 'Cinco Especiarias', 'Smoked Paprika': 'Páprica Defumada',
    'Vanilla': 'Baunilha', 'Vanilla Extract': 'Extrato de Baunilha',
    'Mixed Spice': 'Mistura de Especiarias', 'Mixed Herbs': 'Ervas Mistas',
    'Fennel Seeds': 'Sementes de Erva-Doce', 'Mustard Seeds': 'Sementes de Mostarda',
    'Coriander Seeds': 'Sementes de Coentro', 'Cumin Seeds': 'Sementes de Cominho',
    'Black Mustard Seeds': 'Sementes de Mostarda Preta',
    'Fenugreek': 'Feno-Grego', 'Asafoetida': 'Assafétida',
    'Chilli Flakes': 'Flocos de Pimenta', 'Red Chilli': 'Pimenta Vermelha',
    'Green Chilli': 'Pimenta Verde', 'Scotch Bonnet': 'Pimenta Scotch Bonnet',
    // Molhos e condimentos
    'Soy Sauce': 'Molho de Soja', 'Fish Sauce': 'Molho de Peixe',
    'Oyster Sauce': 'Molho de Ostras', 'Hoisin Sauce': 'Molho Hoisin',
    'Tomato Sauce': 'Molho de Tomate', 'Tomato Paste': 'Extrato de Tomate',
    'Tomato Puree': 'Purê de Tomate', 'Passata': 'Passata',
    'Honey': 'Mel', 'Vinegar': 'Vinagre', 'Red Wine Vinegar': 'Vinagre de Vinho Tinto',
    'White Wine Vinegar': 'Vinagre de Vinho Branco', 'Balsamic Vinegar': 'Vinagre Balsâmico',
    'Apple Cider Vinegar': 'Vinagre de Maçã',
    'Mustard': 'Mostarda', 'Dijon Mustard': 'Mostarda Dijon',
    'English Mustard': 'Mostarda Inglesa', 'Whole Grain Mustard': 'Mostarda em Grãos',
    'Ketchup': 'Ketchup', 'Mayonnaise': 'Maionese',
    'Worcestershire Sauce': 'Molho Inglês', 'Hot Sauce': 'Molho Apimentado',
    'Sriracha': 'Sriracha', 'Miso Paste': 'Pasta de Missô', 'Tahini': 'Tahine',
    'Pesto': 'Pesto', 'Harissa': 'Harissa', 'Chimichurri': 'Chimichurri',
    'Teriyaki Sauce': 'Molho Teriyaki', 'Sweet Chilli Sauce': 'Molho Chili Doce',
    'Plum Sauce': 'Molho de Ameixa', 'Black Bean Sauce': 'Molho de Feijão Preto',
    'Tabasco': 'Tabasco', 'Nam Pla': 'Nam Pla',
    // Caldos e líquidos
    'Water': 'Água', 'Stock': 'Caldo', 'Chicken Stock': 'Caldo de Frango',
    'Beef Stock': 'Caldo de Carne', 'Vegetable Stock': 'Caldo de Legumes',
    'Chicken Broth': 'Caldo de Frango', 'Beef Broth': 'Caldo de Carne',
    'Fish Stock': 'Caldo de Peixe', 'Dashi': 'Dashi',
    'Red Wine': 'Vinho Tinto', 'White Wine': 'Vinho Branco', 'Wine': 'Vinho', 'Beer': 'Cerveja',
    'Coconut Milk': 'Leite de Coco', 'Almond Milk': 'Leite de Amêndoa',
    'Orange Juice': 'Suco de Laranja', 'Lemon Juice': 'Suco de Limão',
    'Lime Juice': 'Suco de Lima',
    // Nozes, sementes e leguminosas
    'Almonds': 'Amêndoas', 'Walnuts': 'Nozes', 'Cashews': 'Castanha de Caju',
    'Pine Nuts': 'Pinoli', 'Sesame Seeds': 'Gergelim', 'Sunflower Seeds': 'Semente de Girassol',
    'Pumpkin Seeds': 'Semente de Abóbora', 'Peanuts': 'Amendoim', 'Hazelnuts': 'Avelãs',
    'Pistachios': 'Pistaches', 'Lentils': 'Lentilhas', 'Chickpeas': 'Grão-de-Bico',
    'Black Beans': 'Feijão Preto', 'Kidney Beans': 'Feijão Kidney',
    'White Beans': 'Feijão Branco', 'Cannellini Beans': 'Feijão Cannellini',
    'Butter Beans': 'Feijão Manteiga', 'Pinto Beans': 'Feijão Carioca',
    // Outros
    'Chocolate': 'Chocolate', 'Cocoa Powder': 'Cacau em Pó', 'Dark Chocolate': 'Chocolate Amargo',
    'White Chocolate': 'Chocolate Branco', 'Milk Chocolate': 'Chocolate ao Leite',
    'Baking Powder': 'Fermento em Pó', 'Baking Soda': 'Bicarbonato de Sódio',
    'Yeast': 'Fermento Biológico', 'Gelatin': 'Gelatina', 'Agar Agar': 'Ágar-Ágar',
    'Tofu': 'Tofu', 'Tempeh': 'Tempeh',
    'Olives': 'Azeitonas', 'Black Olives': 'Azeitonas Pretas', 'Green Olives': 'Azeitonas Verdes',
    'Capers': 'Alcaparras',
    'Maple Syrup': 'Xarope de Bordo', 'Golden Syrup': 'Xarope Dourado',
    'Treacle': 'Melado', 'Molasses': 'Melado de Cana',
    'Zest of Lemon': 'Raspas de Limão', 'Lemon Zest': 'Raspas de Limão',
    'Orange Zest': 'Raspas de Laranja', 'Lime Zest': 'Raspas de Lima',
    'Soda Water': 'Água com Gás',
    'Wonton Wrappers': 'Massa de Wonton', 'Dumpling Wrappers': 'Massa de Dumpling',
    'Nori': 'Nori', 'Seaweed': 'Alga Marinha', 'Wakame': 'Wakame',
    'Mirin': 'Mirin', 'Sake': 'Sake', 'Rice Wine': 'Vinho de Arroz',
    'Coconut Cream': 'Creme de Coco', 'Coconut Flakes': 'Flocos de Coco',
    'Dried Cranberries': 'Cranberries Secas', 'Dried Cherries': 'Cerejas Secas',
    'Poppy Seeds': 'Sementes de Papoula', 'Caraway Seeds': 'Sementes de Alcaravia',
    'Vanilla Pod': 'Fava de Baunilha', 'Vanilla Bean': 'Fava de Baunilha',
    'Beef Dripping': 'Gordura Bovina', 'Lard': 'Banha de Porco',
    'Ghee': 'Ghee', 'Clarified Butter': 'Manteiga Clarificada',
    'Cream of Tartar': 'Cremor Tártaro',
    'Arrowroot': 'Araruta', 'Tapioca': 'Tapioca',
    'Rice Vinegar': 'Vinagre de Arroz',
    'Mango Chutney': 'Chutney de Manga', 'Mint Sauce': 'Molho de Hortelã',
    'Redcurrant Jelly': 'Geleia de Groselha Vermelha',
    'Diced Tomatoes': 'Tomates em Cubos', 'Canned Tomatoes': 'Tomates em Lata',
    'Chopped Tomatoes': 'Tomates Picados',
    'Iceberg Lettuce': 'Alface Americana', 'Romaine Lettuce': 'Alface Romana',
    'Mixed Salad Leaves': 'Mix de Folhas para Salada',
    'Spring Roll Wrappers': 'Massa de Rolinho Primavera',
    'Fish Sauce': 'Molho de Peixe', 'Oyster Mushrooms': 'Cogumelos-Ostra'
};

/** Busca tradução no dicionário, case-insensitive. Retorna o original se não encontrar. */
function traduzir(texto, dic) {
    if (!texto) return '';
    var key = Object.keys(dic).find(function (k) {
        return k.toLowerCase() === texto.toLowerCase();
    });
    return key ? dic[key] : texto;
}
function traduzirIngrediente(nome) { return traduzir(nome, INGREDIENTES_PT); }

/**
 * Traduz uma string de medida palavra por palavra usando MEDIDAS_PT.
 * Ex: "2tbsp chopped" → "2colh. sopa picado"
 */
function traduzirMedida(medida) {
    if (!medida || !medida.trim()) return medida;
    // Tenta correspondência exata primeiro
    var exato = MEDIDAS_PT[medida.trim()];
    if (exato) return exato;
    // Substitui cada palavra pelo dicionário, mantendo números e pontuação
    return medida.replace(/[a-zA-ZÀ-ú]+/g, function (palavra) {
        return MEDIDAS_PT[palavra] || palavra;
    });
}

/**
 * Traduz uma tag individual usando TAGS_PT, com fallback para o original.
 */
function traduzirTag(tag) { return TAGS_PT[tag.trim()] || tag.trim(); }

// ── ESTADO ────────────────────────────────────────────────────
var favorites = JSON.parse(localStorage.getItem(FAV_KEY)) || [];
var currentView = 'home';
var currentLetter = 'A';
var lastQuery = '';
var cacheTraducoes = {}; // cache em memória para evitar chamadas repetidas

// ── SELETORES DOM ─────────────────────────────────────────────
var searchForm = document.getElementById('search-form');
var searchInput = document.getElementById('search-input');
var searchBtn = document.getElementById('search-btn');
var tabHome = document.getElementById('tab-home');
var tabCatalog = document.getElementById('tab-catalog');
var tabFavorites = document.getElementById('tab-favorites');
var favCount = document.getElementById('fav-count');
var mealsGrid = document.getElementById('meals-grid');
var loader = document.getElementById('loader');
var loaderText = document.getElementById('loader-text');
var errorState = document.getElementById('error-state');
var errorMessage = document.getElementById('error-message');
var retryBtn = document.getElementById('retry-btn');
var emptyState = document.getElementById('empty-state');
var emptyIcon = document.getElementById('empty-icon');
var emptyTitle = document.getElementById('empty-title');
var emptyDesc = document.getElementById('empty-desc');
var sectionHeader = document.getElementById('section-header');
var sectionLabel = document.getElementById('section-label');
var alphaWrapper = document.getElementById('alpha-wrapper');
var alphaBar = document.getElementById('alpha-bar');
var modalOverlay = document.getElementById('modal-overlay');
var modalClose = document.getElementById('modal-close');
var modalContent = document.getElementById('modal-content');
var logoBtn = document.getElementById('logo-btn');

// ── HELPERS DE UI ─────────────────────────────────────────────
function showLoader(msg) {
    loaderText.textContent = msg || 'Carregando receitas…';
    loader.hidden = false;
    mealsGrid.innerHTML = '';
    errorState.hidden = true;
    emptyState.hidden = true;
    sectionHeader.hidden = true;
}
function hideLoader() { loader.hidden = true; }
function showError(msg) { errorMessage.textContent = msg; errorState.hidden = false; }
function showEmpty(icon, title, desc) {
    emptyIcon.textContent = icon;
    emptyTitle.textContent = title;
    emptyDesc.textContent = desc || '';
    emptyState.hidden = false;
}
function updateBadge() { favCount.textContent = favorites.length; }

// ── FAVORITOS ─────────────────────────────────────────────────
function isFavorite(id) {
    return favorites.some(function (f) { return f.idMeal === id; });
}
function toggleFavorite(meal) {
    if (isFavorite(meal.idMeal)) {
        favorites = favorites.filter(function (f) { return f.idMeal !== meal.idMeal; });
    } else {
        favorites.push({
            idMeal: meal.idMeal, strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb,
            strCategory: meal.strCategory, strArea: meal.strArea
        });
    }
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    updateBadge();
}

// ── TRADUÇÃO ──────────────────────────────────────────────────
/**
 * Chama a MyMemory API para traduzir um chunk de texto (en → pt-BR).
 * Fallback: retorna o original se a API falhar.
 */
async function traduzirChunk(texto) {
    if (!texto || !texto.trim()) return texto;
    if (cacheTraducoes[texto]) return cacheTraducoes[texto];
    try {
        var resp = await fetch(TRANSLATE_BASE + '?q=' + encodeURIComponent(texto) + '&langpair=en|pt-BR&de=roberta.mmendes@gmail.com');
        if (!resp.ok) return texto;
        var data = await resp.json();
        var resultado = (data.responseStatus === 200) ? data.responseData.translatedText : texto;
        if (resultado && resultado !== texto) cacheTraducoes[texto] = resultado;
        return resultado;
    } catch (e) {
        return texto;
    }
}

/**
 * Traduz texto longo dividindo em parágrafos. Race com timeout de 12s:
 * se a API demorar demais, retorna o original sem travar a interface.
 */
async function traduzirTexto(texto) {
    if (!texto) return '';
    var MAX = 480;

    var traduzirComTimeout = function (t) {
        return Promise.race([
            traduzirChunk(t),
            new Promise(function (resolve) { setTimeout(function () { resolve(t); }, 12000); })
        ]);
    };

    if (texto.length <= MAX) return traduzirComTimeout(texto);

    var paragrafos = texto.split(/\r?\n+/).filter(function (p) { return p.trim().length > 0; });
    var chunks = [];
    var atual = '';

    for (var i = 0; i < paragrafos.length; i++) {
        var p = paragrafos[i];
        if (p.length > MAX) {
            if (atual) { chunks.push(atual); atual = ''; }
            var frases = p.split(/(?<=[.!?])\s+/);
            var fAtual = '';
            for (var j = 0; j < frases.length; j++) {
                if ((fAtual + frases[j]).length > MAX) {
                    if (fAtual) chunks.push(fAtual.trim());
                    fAtual = frases[j];
                } else {
                    fAtual = fAtual ? fAtual + ' ' + frases[j] : frases[j];
                }
            }
            if (fAtual) chunks.push(fAtual.trim());
        } else if ((atual + '\n' + p).length > MAX) {
            if (atual) chunks.push(atual);
            atual = p;
        } else {
            atual = atual ? atual + '\n' + p : p;
        }
    }
    if (atual) chunks.push(atual);

    var traduzidos = await Promise.all(chunks.map(traduzirComTimeout));
    return traduzidos.join('\n\n');
}

/**
 * Traduz em lote os nomes dos cards ainda não traduzidos.
 * Agrupa nomes em chunks e atualiza o DOM conforme chegam.
 */
async function traduzirNomesCards() {
    var cards = Array.from(mealsGrid.querySelectorAll('.meal-card:not([data-nt])'));
    if (cards.length === 0) return;

    var itens = cards.map(function (card) {
        var h2 = card.querySelector('.meal-card__name');
        return { card: card, h2: h2, nome: h2 ? h2.textContent : '' };
    }).filter(function (it) { return it.nome; });

    // Separa os que já estão no cache
    itens.forEach(function (it) {
        if (cacheTraducoes[it.nome] && it.h2 && it.h2.isConnected) {
            it.h2.textContent = cacheTraducoes[it.nome];
            it.card.dataset.nt = '1';
        }
    });

    var pendentes = itens.filter(function (it) { return !it.card.dataset.nt; });
    if (pendentes.length === 0) return;

    // Traduz em grupos de até 480 chars por request
    var grupos = [];
    var grupo = [];
    var texto = '';
    pendentes.forEach(function (it) {
        if (((texto ? texto + '\n' : '') + it.nome).length > 460) {
            if (grupo.length) grupos.push(grupo);
            grupo = [it]; texto = it.nome;
        } else {
            grupo.push(it);
            texto = texto ? texto + '\n' + it.nome : it.nome;
        }
    });
    if (grupo.length) grupos.push(grupo);

    for (var g = 0; g < grupos.length; g++) {
        var grp = grupos[g];
        var textoGrupo = grp.map(function (it) { return it.nome; }).join('\n');
        try {
            var resultado = await Promise.race([
                traduzirChunk(textoGrupo),
                new Promise(function (resolve) { setTimeout(function () { resolve(textoGrupo); }, 10000); })
            ]);
            var linhas = resultado.split('\n');
            grp.forEach(function (it, idx) {
                var trad = (linhas[idx] || '').trim();
                if (trad && trad !== it.nome) cacheTraducoes[it.nome] = trad;
                if (it.h2 && it.h2.isConnected) {
                    it.h2.textContent = cacheTraducoes[it.nome] || it.nome;
                }
                it.card.dataset.nt = '1';
            });
        } catch (e) {
            grp.forEach(function (it) { it.card.dataset.nt = '1'; });
        }
        if (g < grupos.length - 1) {
            await new Promise(function (r) { setTimeout(r, 400); });
        }
    }
}

/**
 * Verifica via thumbnail do YouTube se o vídeo ainda está disponível.
 * Vídeos removidos retornam uma imagem placeholder de 120×90 px.
 */
function verificarVideoYT(url) {
    return new Promise(function (resolve) {
        if (!url) { resolve(false); return; }
        var match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (!match) { resolve(false); return; }
        var id = match[1];
        var img = new Image();
        var timer = setTimeout(function () { resolve(true); }, 5000); // timeout → assume disponível
        img.onload = function () {
            clearTimeout(timer);
            // thumbnail padrão de vídeos removidos tem largura 120px
            resolve(img.naturalWidth > 120);
        };
        img.onerror = function () { clearTimeout(timer); resolve(false); };
        img.src = 'https://img.youtube.com/vi/' + id + '/mqdefault.jpg';
    });
}

// ── API ───────────────────────────────────────────────────────
async function searchMeals(query) {
    showLoader('Buscando "' + query + '"…');
    lastQuery = query;
    currentView = 'search';
    updateTabs(null);
    try {
        var response = await fetch(API_BASE + 'search.php?s=' + encodeURIComponent(query));
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var data = await response.json();
        var meals = data.meals || [];
        meals.sort(function (a, b) {
            return a.strMeal.localeCompare(b.strMeal, 'pt-BR', { sensitivity: 'base' });
        });
        hideLoader();
        if (meals.length === 0) {
            showEmpty('🔍', 'Nenhuma receita encontrada', 'Tente outro termo de busca.');
            return;
        }
        sectionLabel.textContent = meals.length + ' resultado' + (meals.length !== 1 ? 's' : '') + ' para "' + query + '"';
        sectionHeader.hidden = false;
        renderMeals(meals);
    } catch (err) {
        hideLoader();
        showError('Não foi possível realizar a busca. Verifique sua conexão.');
    }
}

async function loadHomePage() {
    showLoader('Carregando receitas em destaque…');
    alphaWrapper.hidden = true;
    try {
        var promises = HOME_TERMS.map(function (termo) {
            return fetch(API_BASE + 'search.php?s=' + encodeURIComponent(termo))
                .then(function (r) { return r.ok ? r.json() : { meals: null }; })
                .catch(function () { return { meals: null }; });
        });
        var results = await Promise.all(promises);
        var allMeals = [];
        var seenIds = {};
        for (var r = 0; r < results.length; r++) {
            var grupo = results[r].meals;
            if (!grupo) continue;
            for (var m = 0; m < grupo.length; m++) {
                var meal = grupo[m];
                if (!seenIds[meal.idMeal]) { seenIds[meal.idMeal] = true; allMeals.push(meal); }
            }
        }
        allMeals.sort(function (a, b) {
            return a.strMeal.localeCompare(b.strMeal, 'pt-BR', { sensitivity: 'base' });
        });
        hideLoader();
        if (allMeals.length === 0) {
            showEmpty('🍽️', 'Sem receitas disponíveis', 'Verifique sua conexão com a internet.');
            return;
        }
        sectionLabel.textContent = allMeals.length + ' receitas em destaque';
        sectionHeader.hidden = false;
        renderMeals(allMeals);
    } catch (err) {
        hideLoader();
        showError('Não foi possível carregar a página inicial. Verifique sua conexão.');
    }
}

async function loadCatalogByLetter(letter) {
    currentLetter = letter;
    showLoader('Carregando receitas com a letra ' + letter + '…');
    var botoes = alphaBar.querySelectorAll('.alpha-btn');
    for (var i = 0; i < botoes.length; i++) {
        botoes[i].classList.toggle('is-active', botoes[i].dataset.letter === letter);
    }
    try {
        var response = await fetch(API_BASE + 'search.php?f=' + letter.toLowerCase());
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var data = await response.json();
        var meals = data.meals || [];
        meals.sort(function (a, b) {
            return a.strMeal.localeCompare(b.strMeal, 'pt-BR', { sensitivity: 'base' });
        });
        hideLoader();
        if (meals.length === 0) {
            showEmpty('📋', 'Nenhuma receita com a letra ' + letter, 'Escolha outra letra na barra acima.');
            return;
        }
        sectionLabel.textContent = meals.length + ' receita' + (meals.length !== 1 ? 's' : '') + ' com a letra ' + letter;
        sectionHeader.hidden = false;
        renderMeals(meals);
    } catch (err) {
        hideLoader();
        showError('Não foi possível carregar o catálogo. Verifique sua conexão.');
    }
}

async function getMealDetails(id) {
    try {
        var response = await fetch(API_BASE + 'lookup.php?i=' + id);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        var data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (err) {
        return null;
    }
}

// ── BARRA DE LETRAS ───────────────────────────────────────────
function renderAlphabetBar() {
    alphaBar.innerHTML = '';
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < ALPHABET.length; i++) {
        var letter = ALPHABET[i];
        var btn = document.createElement('button');
        btn.className = 'alpha-btn' + (letter === currentLetter ? ' is-active' : '');
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.setAttribute('aria-label', 'Receitas com a letra ' + letter);
        btn.addEventListener('click', (function (l) {
            return function () { loadCatalogByLetter(l); };
        })(letter));
        fragment.appendChild(btn);
    }
    alphaBar.appendChild(fragment);
}

// ── RENDERIZAÇÃO DE CARDS ─────────────────────────────────────
function createMealCard(meal) {
    var card = document.createElement('article');
    card.className = 'meal-card';
    card.dataset.id = meal.idMeal;

    var favAtivo = isFavorite(meal.idMeal);
    var catPT = traduzir(meal.strCategory || '', CATEGORIA_PT);
    var areaPT = traduzir(meal.strArea || '', AREA_PT);

    card.innerHTML =
        '<img class="meal-card__thumb" src="' + meal.strMealThumb +
        '" alt="' + meal.strMeal + '" loading="lazy">' +
        '<button class="fav-btn ' + (favAtivo ? 'is-fav' : '') + '" data-id="' + meal.idMeal + '"' +
        ' aria-label="' + (favAtivo ? 'Remover dos favoritos' : 'Adicionar aos favoritos') + '">' +
        (favAtivo ? '♥' : '♡') + '</button>' +
        '<div class="meal-card__body">' +
        '<h2 class="meal-card__name">' + meal.strMeal + '</h2>' +
        '<div class="meal-card__meta">' +
        (catPT ? '<span class="meta-tag meta-tag--accent">' + catPT + '</span>' : '') +
        (areaPT ? '<span class="meta-tag">' + areaPT + '</span>' : '') +
        '</div>' +
        '</div>';

    card.addEventListener('click', function (e) {
        if (e.target.closest('.fav-btn')) return;
        openModal(meal.idMeal);
    });
    var favBtn = card.querySelector('.fav-btn');
    favBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleFavorite(meal);
        var ativo = isFavorite(meal.idMeal);
        favBtn.classList.toggle('is-fav', ativo);
        favBtn.textContent = ativo ? '♥' : '♡';
        favBtn.setAttribute('aria-label', ativo ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
        if (currentView === 'favorites') renderFavoritesView();
    });
    return card;
}

function renderMeals(meals) {
    mealsGrid.innerHTML = '';
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < meals.length; i++) fragment.appendChild(createMealCard(meals[i]));
    mealsGrid.appendChild(fragment);
    // Traduz nomes dos cards em background (sem bloquear a renderização)
    if (currentView !== 'catalog') traduzirNomesCards();
}

function renderFavoritesView() {
    mealsGrid.innerHTML = '';
    errorState.hidden = true;
    emptyState.hidden = true;
    if (favorites.length === 0) {
        sectionHeader.hidden = true;
        showEmpty('♡', 'Sem favoritos ainda', 'Explore as receitas e clique no ♡ para salvar.');
        return;
    }
    sectionLabel.textContent = favorites.length + ' receita' + (favorites.length !== 1 ? 's' : '') + ' favorita' + (favorites.length !== 1 ? 's' : '');
    sectionHeader.hidden = false;
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < favorites.length; i++) fragment.appendChild(createMealCard(favorites[i]));
    mealsGrid.appendChild(fragment);
    traduzirNomesCards();
}

// ── MODAL ─────────────────────────────────────────────────────
async function openModal(id) {
    modalContent.innerHTML =
        '<div class="loader" style="padding:3rem 0"><div class="loader__spinner"></div>' +
        '<p class="loader__text">Carregando detalhes…</p></div>';
    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';

    var meal = await getMealDetails(id);
    if (!meal) {
        modalContent.innerHTML =
            '<div class="error-state" style="padding:3rem 1.5rem">' +
            '<span class="error-state__icon">⚠️</span>' +
            '<p class="error-state__msg">Não foi possível carregar os detalhes.</p></div>';
        return;
    }

    // ── Extrai ingredientes (strIngredient1–20 / strMeasure1–20) ──────────
    var ingredientes = [];
    for (var i = 1; i <= 20; i++) {
        var nome = meal['strIngredient' + i];
        var medida = meal['strMeasure' + i];
        if (nome && nome.trim()) ingredientes.push({ nome: nome.trim(), medida: (medida || '').trim() });
    }

    // Tags traduzidas (categoria, área e strTags)
    var tagsHTML = '';
    if (meal.strCategory) tagsHTML += '<span class="meta-tag meta-tag--accent">' + traduzir(meal.strCategory, CATEGORIA_PT) + '</span>';
    if (meal.strArea) tagsHTML += '<span class="meta-tag">' + traduzir(meal.strArea, AREA_PT) + '</span>';
    if (meal.strTags) {
        meal.strTags.split(',').forEach(function (t) {
            var tag = t.trim();
            if (tag) tagsHTML += '<span class="meta-tag">' + traduzirTag(tag) + '</span>';
        });
    }

    // HTML dos ingredientes — medidas e nomes traduzidos pelo dicionário imediatamente
    var ingHTML = ingredientes.map(function (it, idx) {
        var medidaPT = traduzirMedida(it.medida);
        return '<div class="ingredient-item" id="moding-' + idx + '">' +
            (medidaPT ? '<span class="measure">' + medidaPT + '</span> ' : '') +
            traduzirIngrediente(it.nome) + '</div>';
    }).join('');

    var favAtivo = isFavorite(meal.idMeal);

    // Renderiza o modal (instruções em inglês por ora, spinner indica tradução)
    modalContent.innerHTML =
        '<img class="modal__thumb" src="' + meal.strMealThumb + '" alt="' + meal.strMeal + '">' +
        '<div class="modal__body">' +
        '<div class="modal__header">' +
        '<h2 class="modal__title" id="modal-nome">' + meal.strMeal + '</h2>' +
        '<button class="modal__fav-btn ' + (favAtivo ? 'is-fav' : '') + '" id="modal-fav-btn" data-id="' + meal.idMeal + '">' +
        (favAtivo ? '♥ Salvo' : '♡ Salvar') +
        '</button>' +
        '</div>' +
        '<div class="modal__tags">' + tagsHTML + '</div>' +
        '<div class="modal__divider"></div>' +
        '<p class="modal__section-title">Ingredientes</p>' +
        '<div class="ingredients-grid">' + ingHTML + '</div>' +
        '<div class="modal__divider"></div>' +
        '<p class="modal__section-title">Modo de Preparo</p>' +
        '<p class="translating-tag" id="modal-spin">Traduzindo para português…</p>' +
        '<p class="modal__instructions" id="modal-instrucoes">' + (meal.strInstructions || '') + '</p>' +
        (meal.strYoutube ? '<a class="modal__youtube" id="modal-yt" href="' + meal.strYoutube + '" target="_blank" rel="noopener noreferrer" style="display:none">▶ Assistir no YouTube</a>' : '') +
        '</div>';

    // Evento de favorito
    var modalFavBtn = document.getElementById('modal-fav-btn');
    if (modalFavBtn) {
        modalFavBtn.addEventListener('click', function () {
            toggleFavorite(meal);
            var ativo = isFavorite(meal.idMeal);
            modalFavBtn.classList.toggle('is-fav', ativo);
            modalFavBtn.textContent = ativo ? '♥ Salvo' : '♡ Salvar';
            var card = mealsGrid.querySelector('[data-id="' + meal.idMeal + '"]');
            if (card) {
                var btn = card.querySelector('.fav-btn');
                if (btn) { btn.classList.toggle('is-fav', ativo); btn.textContent = ativo ? '♥' : '♡'; }
            }
            if (currentView === 'favorites') renderFavoritesView();
        });
    }

    // ── Captura referências ANTES dos awaits (evita apontar para elementos antigos) ──
    var nomeEl = document.getElementById('modal-nome');
    var instrEl = document.getElementById('modal-instrucoes');
    var spinEl = document.getElementById('modal-spin');
    var ytEl = document.getElementById('modal-yt');

    // ── 1. Traduz nome em background ─────────────────────────────────────
    traduzirChunk(meal.strMeal).then(function (nomePT) {
        if (nomeEl && nomeEl.isConnected && nomePT && nomePT !== meal.strMeal) {
            nomeEl.textContent = nomePT;
        }
    }).catch(function () { });

    // ── 2. Traduz ingredientes não cobertos pelo dicionário ───────────────
    var semDicionario = ingredientes.filter(function (it) {
        return traduzirIngrediente(it.nome) === it.nome && !cacheTraducoes[it.nome];
    });
    if (semDicionario.length > 0) {
        var textoIng = semDicionario.map(function (it) { return it.nome; }).join('\n');
        if (textoIng.length <= 480) {
            traduzirChunk(textoIng).then(function (resultado) {
                var linhas = resultado.split('\n');
                semDicionario.forEach(function (it, idx) {
                    var trad = (linhas[idx] || '').trim();
                    if (trad && trad !== it.nome) cacheTraducoes[it.nome] = trad;
                });
                // Atualiza os elementos dos ingredientes no DOM com nome e medida traduzidos
                ingredientes.forEach(function (it, idx) {
                    var el = document.getElementById('moding-' + idx);
                    if (el && el.isConnected) {
                        var nomePT = cacheTraducoes[it.nome] || traduzirIngrediente(it.nome);
                        var medidaPT = traduzirMedida(it.medida);
                        el.innerHTML = (medidaPT ? '<span class="measure">' + medidaPT + '</span> ' : '') + nomePT;
                    }
                });
            }).catch(function () { });
        }
    }

    // ── 3. Traduz instruções ──────────────────────────────────────────────
    if (meal.strInstructions) {
        traduzirTexto(meal.strInstructions).then(function (traduzido) {
            // Verifica se elementos ainda estão no DOM (modal pode ter sido fechado)
            if (instrEl && instrEl.isConnected) instrEl.textContent = traduzido;
            if (spinEl && spinEl.isConnected) spinEl.remove(); // remove definitivamente
        }).catch(function () {
            if (spinEl && spinEl.isConnected) spinEl.remove();
        });
    } else {
        if (spinEl) spinEl.remove();
    }

    // ── 4. Verifica disponibilidade do vídeo no YouTube ──────────────────
    if (meal.strYoutube && ytEl) {
        verificarVideoYT(meal.strYoutube).then(function (disponivel) {
            if (ytEl.isConnected) {
                if (disponivel) {
                    ytEl.style.display = ''; // mostra o link
                } else {
                    ytEl.remove(); // vídeo indisponível: remove o link
                }
            }
        });
    }
}

function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
}

// ── VIEWS ─────────────────────────────────────────────────────
function updateTabs(activeId) {
    tabHome.classList.toggle('tab--active', activeId === 'home');
    tabCatalog.classList.toggle('tab--active', activeId === 'catalog');
    tabFavorites.classList.toggle('tab--active', activeId === 'favorites');
}

function switchView(view) {
    currentView = view;
    emptyState.hidden = true;
    errorState.hidden = true;
    loader.hidden = true;
    searchInput.value = '';
    lastQuery = '';

    if (view === 'home') {
        updateTabs('home');
        alphaWrapper.hidden = true;
        loadHomePage();
    } else if (view === 'catalog') {
        updateTabs('catalog');
        alphaWrapper.hidden = false;
        atualizarTopAlphaBar();
        loadCatalogByLetter(currentLetter);
    } else if (view === 'favorites') {
        updateTabs('favorites');
        alphaWrapper.hidden = true;
        mealsGrid.innerHTML = '';
        emptyState.hidden = true;
        sectionHeader.hidden = false;
        renderFavoritesView();
    }
}

// ── EVENTOS ───────────────────────────────────────────────────
tabHome.addEventListener('click', function () { switchView('home'); });
tabCatalog.addEventListener('click', function () { switchView('catalog'); });
tabFavorites.addEventListener('click', function () { switchView('favorites'); });

searchForm.addEventListener('submit', function (e) {
    e.preventDefault(); //Impede o recarregamento padrão da página ao enviar o formulário

    var q = searchInput.value.trim();
    if (q) {
        alphaWrapper.hidden = true;
        searchMeals(q);
    }
});

retryBtn.addEventListener('click', function () {
    if (currentView === 'home') loadHomePage();
    else if (currentView === 'catalog') loadCatalogByLetter(currentLetter);
    else if (currentView === 'search' && lastQuery) searchMeals(lastQuery);
    else loadHomePage();
});

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
});

logoBtn.addEventListener('click', function (e) {
    e.preventDefault();
    switchView('home');
});

// ── POSICIONAMENTO DINÂMICO DA BARRA DE LETRAS ────────────────
/**
 * Recalcula o `top` da alpha-wrapper somando a altura real do header
 * e das abas. Resolve o "floating" em diferentes tamanhos de tela.
 */
function atualizarTopAlphaBar() {
    var headerEl = document.querySelector('.header');
    if (headerEl) {
        alphaWrapper.style.top = (headerEl.offsetHeight - 1) + 'px';
    }
}
window.addEventListener('resize', atualizarTopAlphaBar);

// ── INICIALIZAÇÃO ─────────────────────────────────────────────
updateBadge();
renderAlphabetBar();
atualizarTopAlphaBar(); // garante top correto desde o início
loadHomePage();