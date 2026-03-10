/* =========================================================
   INDIAN RECIPE FINDER  ·  script.js  (FINAL)
   - Embedded DB of 55+ dishes  (no API needed)
   - Register / Login / Logout  (localStorage)
   - Category tabs + keyword search
   - Recipe modal with ingredients, steps, YouTube link
   ========================================================= */

/* ---------- Storage keys ---------- */
var KEYS = { USERS:'irf_users', EMAIL:'irf_email', NAME:'irf_name' };

/* ---------- Tiny helpers ---------- */
function byId(id)  { return document.getElementById(id); }
function qsa(sel)  { return document.querySelectorAll(sel); }
function goTo(url) { window.location.href = url; }

function getUsers()         { return JSON.parse(localStorage.getItem(KEYS.USERS)||'[]'); }
function saveUsers(u)       { localStorage.setItem(KEYS.USERS, JSON.stringify(u)); }
function getEmail()         { return localStorage.getItem(KEYS.EMAIL); }
function getUname()         { return localStorage.getItem(KEYS.NAME)||'Chef'; }
function saveSession(e,n)   { localStorage.setItem(KEYS.EMAIL,e); localStorage.setItem(KEYS.NAME,n); }
function clearSession()     { localStorage.removeItem(KEYS.EMAIL); localStorage.removeItem(KEYS.NAME); }

function showMsg(id, txt, ok) {
  var el = byId(id);
  if(!el) return;
  el.textContent = txt;
  el.className = ok ? 'auth-success show' : 'auth-error show';
}

function esc(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ---------- Page detection ---------- */
function whichPage() {
  var p = window.location.pathname.toLowerCase();
  if (p.indexOf('register') !== -1) return 'register';
  if (p.indexOf('home')     !== -1) return 'home';
  return 'login';
}

/* =========================================================
   RECIPE DATABASE
   ========================================================= */
var DB = [
  /* ── North Indian ── */
  {id:'n01',cat:'North Indian',name:'Butter Chicken',
   img:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80',
   tags:['Non-Veg','Popular','Gravy'],
   ingredients:['Chicken 500g','Butter 3 tbsp','Tomato Puree 1 cup','Cream ½ cup','Onion 2','Ginger-Garlic Paste 2 tbsp','Garam Masala 1 tsp','Chilli Powder 1 tsp','Kasuri Methi 1 tbsp','Salt to taste'],
   steps:['Marinate chicken in yogurt, chilli powder and garam masala for 1 hour.',
          'Grill or pan-fry marinated chicken until golden. Set aside.',
          'Sauté onions in butter until golden. Add ginger-garlic paste.',
          'Add tomato puree and spices. Simmer 15 min until oil separates.',
          'Blend gravy smooth. Add cooked chicken pieces.',
          'Stir in cream and kasuri methi. Simmer 5 min. Serve with naan.'],
   yt:'https://youtu.be/a03U45jFxOI?si=ycXX1jOuwN4gPjPY'},

  {id:'n02',cat:'North Indian',name:'Dal Makhani',
   img:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80',
   tags:['Vegetarian','Lentils','Creamy'],
   ingredients:['Black Urad Dal 1 cup','Rajma 2 tbsp','Butter 3 tbsp','Tomato 3','Onion 2','Ginger-Garlic Paste 1 tbsp','Cream 4 tbsp','Garam Masala 1 tsp','Cumin 1 tsp','Salt to taste'],
   steps:['Soak dal and rajma overnight. Pressure cook 6 whistles.',
          'Sauté cumin in butter. Add onions until dark brown.',
          'Add ginger-garlic, tomatoes, spices. Cook 15 min.',
          'Add dal to gravy. Simmer 45 min stirring often.',
          'Finish with cream and extra butter. Serve with naan.'],
   yt:'dal+makhani+recipe'},

  {id:'n03',cat:'North Indian',name:'Palak Paneer',
   img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
   tags:['Vegetarian','Greens','Gravy'],
   ingredients:['Spinach 500g','Paneer 250g','Onion 2','Tomato 2','Ginger 1 inch','Garlic 4 cloves','Green Chilli 2','Cream 2 tbsp','Garam Masala 1 tsp','Butter 2 tbsp','Salt to taste'],
   steps:['Blanch spinach 2 min in boiling water. Blend smooth.',
          'Sauté cumin in butter. Add onions until golden.',
          'Add ginger, garlic, tomatoes and spices. Cook 10 min.',
          'Add spinach puree. Mix well.',
          'Add paneer cubes. Simmer 5 min. Stir in cream.',
          'Serve with roti or naan.'],
   yt:'palak+paneer+recipe'},

  {id:'n04',cat:'North Indian',name:'Chicken Tikka Masala',
   img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80',
   tags:['Non-Veg','Gravy','Spicy'],
   ingredients:['Chicken 600g','Yogurt ½ cup','Tikka Masala 3 tbsp','Tomato Puree 1 cup','Onion 2','Cream ¼ cup','Butter 2 tbsp','Kasuri Methi 1 tbsp','Lemon Juice 2 tbsp','Salt to taste'],
   steps:['Marinate chicken with yogurt, tikka masala, lemon juice for 4 hours.',
          'Grill chicken until charred. Set aside.',
          'Sauté onions in butter. Add tomato puree. Simmer 15 min.',
          'Add tikka masala spices and grilled chicken.',
          'Pour in cream. Simmer 10 min until thick.',
          'Garnish with coriander. Serve with rice or naan.'],
   yt:'chicken+tikka+masala+recipe'},

  {id:'n05',cat:'North Indian',name:'Chole Bhature',
   img:'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80',
   tags:['Vegetarian','Street Favourite','Chickpeas'],
   ingredients:['Chickpeas 2 cups (soaked)','Maida 2 cups','Yogurt ½ cup','Onion 2','Tomato 3','Ginger-Garlic Paste 2 tbsp','Chole Masala 2 tbsp','Oil for frying','Salt to taste'],
   steps:['Pressure cook chickpeas with tea bag and salt for 5 whistles.',
          'Sauté onions dark. Add ginger-garlic, tomatoes, spices.',
          'Add chickpeas. Mash a few to thicken. Simmer 20 min.',
          'Knead bhatura dough with maida, yogurt, yeast. Rest 2 hours.',
          'Roll bhaturas and deep fry until golden and puffed.',
          'Serve hot chole with bhaturas, onion, and pickles.'],
   yt:'chole+bhature+recipe'},

  {id:'n06',cat:'North Indian',name:'Rajma Chawal',
   img:'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80',
   tags:['Vegetarian','Rice','Comfort Food'],
   ingredients:['Kidney Beans 1½ cups (soaked)','Basmati Rice 2 cups','Onion 2','Tomato 3','Ginger-Garlic Paste 2 tbsp','Rajma Masala 2 tbsp','Cumin 1 tsp','Ghee 2 tbsp','Salt to taste'],
   steps:['Pressure cook rajma until soft (6 whistles).',
          'Sauté cumin in ghee. Add onions until golden.',
          'Add ginger-garlic, tomatoes, rajma masala. Cook 15 min.',
          'Add rajma with cooking liquid. Simmer 20 min.',
          'Mash some beans to thicken gravy.',
          'Cook basmati rice separately. Serve rajma over rice.'],
   yt:'rajma+chawal+recipe'},

  {id:'n07',cat:'North Indian',name:'Aloo Gobi',
   img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
   tags:['Vegetarian','Dry Sabzi','Everyday'],
   ingredients:['Potato 3','Cauliflower 1 medium','Onion 1','Tomato 2','Ginger 1 inch','Turmeric ½ tsp','Cumin 1 tsp','Coriander Powder 1 tsp','Amchur ½ tsp','Oil 3 tbsp','Coriander leaves'],
   steps:['Cut potato and cauliflower into florets.',
          'Heat oil. Crackle cumin. Add onions until light brown.',
          'Add ginger, tomatoes and all spices. Cook 5 min.',
          'Add potato. Cover and cook 8 min.',
          'Add cauliflower. Mix gently. Cook 15 min until tender.',
          'Sprinkle amchur and fresh coriander. Serve with roti.'],
   yt:'aloo+gobi+recipe'},

  {id:'n08',cat:'North Indian',name:'Shahi Paneer',
   img:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80',
   tags:['Vegetarian','Rich','Festive'],
   ingredients:['Paneer 300g','Cashews ¼ cup','Onion 2','Tomato 2','Cream ½ cup','Cardamom 3','Cloves 4','Saffron pinch','Rose Water 1 tsp','Ghee 3 tbsp','Salt to taste'],
   steps:['Soak cashews 30 min. Blend to smooth paste.',
          'Sauté whole spices in ghee. Add onions until golden.',
          'Add tomatoes. Cook until mushy. Blend the mixture smooth.',
          'Strain back into pan. Add cashew paste.',
          'Add paneer and saffron. Simmer 8 min.',
          'Stir in cream and rose water. Serve with roti.'],
   yt:'shahi+paneer+recipe'},

  {id:'n09',cat:'North Indian',name:'Rogan Josh',
   img:'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=500&q=80',
   tags:['Non-Veg','Kashmiri','Aromatic'],
   ingredients:['Lamb 700g','Yogurt 1 cup','Onion 3','Kashmiri Chilli 4','Cardamom 4','Cloves 5','Fennel Powder 2 tsp','Ginger Powder 1 tsp','Mustard Oil 4 tbsp','Salt to taste'],
   steps:['Heat mustard oil until smoking. Add whole spices.',
          'Add onions. Cook very dark — 20 min.',
          'Add lamb. Sear on high heat until browned.',
          'Add Kashmiri chilli, fennel, ginger powder, yogurt.',
          'Cover and slow cook 1 hour until tender.',
          'Serve with steamed rice or naan.'],
   yt:'rogan+josh+recipe'},

  {id:'n10',cat:'North Indian',name:'Sarson Ka Saag & Makki Roti',
   img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
   tags:['Vegetarian','Punjabi','Winter'],
   ingredients:['Mustard Leaves 500g','Spinach 200g','Makki Flour 2 cups','Onion 2','Garlic 6','Ginger 2 inches','Green Chilli 3','Butter 4 tbsp','Jaggery 1 tbsp','Salt to taste'],
   steps:['Cook mustard, spinach with salt and water 30 min.',
          'Blend coarsely with ginger, garlic, green chilli.',
          'Sauté onions in butter until caramelized. Add saag.',
          'Cook on low heat 20 min stirring regularly. Add jaggery.',
          'For makki roti: knead maize flour with warm water. Make thick rotis.',
          'Cook rotis on tawa. Serve with saag and white butter.'],
   yt:'sarson+ka+saag+recipe'},

  /* ── South Indian ── */
  {id:'s01',cat:'South Indian',name:'Masala Dosa',
   img:'https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&q=80',
   tags:['Vegetarian','Breakfast','Crispy'],
   ingredients:['Dosa Rice 2 cups','Urad Dal ½ cup','Chana Dal 2 tbsp','Potato 4','Onion 2','Green Chilli 3','Mustard Seeds 1 tsp','Turmeric ½ tsp','Curry Leaves','Oil','Salt to taste'],
   steps:['Soak rice, dals overnight. Grind smooth batter. Ferment 10 hours.',
          'Make aloo masala: sauté mustard, onion, chilli, turmeric, mashed potato.',
          'Heat griddle. Pour batter and spread thin in circles.',
          'Drizzle oil on edges. Cook until golden and crisp.',
          'Place aloo masala in center. Fold dosa.',
          'Serve with coconut chutney and sambar.'],
   yt:'masala+dosa+recipe'},

  {id:'s02',cat:'South Indian',name:'Idli with Sambar',
   img:'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80',
   tags:['Vegetarian','Breakfast','Steamed'],
   ingredients:['Idli Rice 2 cups','Urad Dal ½ cup','Fenugreek Seeds ½ tsp','Toor Dal 1 cup','Mixed Vegetables 2 cups','Sambar Powder 2 tbsp','Tamarind small ball','Mustard Seeds','Curry Leaves','Salt to taste'],
   steps:['Soak rice, urad dal with fenugreek. Grind smooth. Ferment overnight.',
          'Steam in idli moulds 12 minutes.',
          'Sambar: cook toor dal with vegetables, tamarind, sambar powder.',
          'Temper with mustard, curry leaves, dried chilli.',
          'Simmer sambar 15 min until vegetables are soft.',
          'Serve soft idlis with hot sambar and coconut chutney.'],
   yt:'idli+sambar+recipe'},

  {id:'s03',cat:'South Indian',name:'Kerala Fish Curry',
   img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80',
   tags:['Non-Veg','Coastal','Coconut'],
   ingredients:['Fish 500g','Coconut Milk 1 cup','Kokum or Tamarind','Onion 2','Tomato 2','Ginger 1 inch','Garlic 5','Green Chilli 3','Turmeric 1 tsp','Red Chilli Powder 2 tsp','Coconut Oil 3 tbsp','Curry Leaves'],
   steps:['Heat coconut oil. Crackle mustard and curry leaves.',
          'Add onion, ginger, garlic, green chilli. Sauté until soft.',
          'Add tomatoes, turmeric, chilli powder. Cook 10 min.',
          'Pour coconut milk and add kokum. Bring to simmer.',
          'Gently add fish. Cook 12 min — do not stir much.',
          'Serve with red parboiled rice.'],
   yt:'kerala+fish+curry+recipe'},

  {id:'s04',cat:'South Indian',name:'Medu Vada',
   img:'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80',
   tags:['Vegetarian','Snack','Breakfast'],
   ingredients:['Urad Dal 1 cup','Green Chilli 2','Ginger 1 inch','Curry Leaves','Black Pepper 1 tsp','Coconut 2 tbsp','Rice Flour 1 tbsp','Salt to taste','Oil for frying'],
   steps:['Soak urad dal 4 hours. Grind to thick fluffy batter.',
          'Add green chilli, ginger, curry leaves, pepper, coconut.',
          'Wet hands. Shape batter into rings (donut shape).',
          'Slide gently into hot oil.',
          'Fry on medium until golden brown.',
          'Serve hot with sambar and coconut chutney.'],
   yt:'medu+vada+recipe'},

  {id:'s05',cat:'South Indian',name:'Chicken Chettinad',
   img:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80',
   tags:['Non-Veg','Spicy','Aromatic'],
   ingredients:['Chicken 750g','Onion 3','Tomato 3','Ginger-Garlic Paste 3 tbsp','Fennel Seeds 2 tsp','Peppercorns 2 tsp','Star Anise 2','Coconut ¼ cup','Red Chilli 5','Coconut Oil 4 tbsp','Curry Leaves'],
   steps:['Dry roast fennel, pepper, star anise, red chilli. Grind with coconut.',
          'Sauté onions in coconut oil until very dark.',
          'Add ginger-garlic and tomatoes. Cook until oil separates.',
          'Add chicken and ground masala. Mix thoroughly.',
          'Add 1 cup water. Cover and cook 30 min.',
          'Garnish with curry leaves. Serve with rice or parotta.'],
   yt:'chettinad+chicken+recipe'},

  {id:'s06',cat:'South Indian',name:'Rava Upma',
   img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
   tags:['Vegetarian','Breakfast','Quick'],
   ingredients:['Semolina 1 cup','Onion 1','Green Chilli 2','Mustard Seeds 1 tsp','Urad Dal 1 tsp','Ginger ½ inch','Curry Leaves','Mixed Vegetables 1 cup','Water 2½ cups','Ghee 2 tbsp','Salt to taste'],
   steps:['Dry roast rava on low heat until fragrant (5 min). Set aside.',
          'Sauté mustard, urad dal in ghee until golden.',
          'Add onion, green chilli, ginger, curry leaves. Cook until soft.',
          'Add vegetables and cook 3 min.',
          'Pour water with salt. Bring to rolling boil.',
          'Slowly add roasted rava while stirring constantly. Cook 3 min. Serve hot.'],
   yt:'rava+upma+recipe'},

  {id:'s07',cat:'South Indian',name:'Uttapam',
   img:'https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&q=80',
   tags:['Vegetarian','Breakfast','Thick'],
   ingredients:['Dosa Batter 2 cups','Onion 1','Tomato 1','Green Chilli 1','Capsicum ¼','Carrot (grated)','Fresh Coriander','Oil 2 tbsp','Salt to taste'],
   steps:['Prepare thick fermented dosa batter.',
          'Heat tawa. Pour thick ladle of batter.',
          'Scatter onion, tomato, chilli, capsicum, carrot on top.',
          'Drizzle oil around edges.',
          'Cover and cook 3 min until base is golden.',
          'Flip carefully. Cook other side 1 min. Serve with chutney.'],
   yt:'uttapam+recipe'},

  {id:'s08',cat:'South Indian',name:'Lemon Rice',
   img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
   tags:['Vegetarian','Rice','Tangy'],
   ingredients:['Cooked Rice 3 cups','Lemon Juice 3 tbsp','Mustard Seeds 1 tsp','Urad Dal 1 tsp','Green Chilli 2','Curry Leaves','Turmeric 1 tsp','Peanuts ¼ cup','Oil 2 tbsp','Salt to taste'],
   steps:['Heat oil. Fry peanuts until golden.',
          'Add mustard, urad dal. Let splutter.',
          'Add green chilli, curry leaves. Sauté 1 min.',
          'Add turmeric. Remove from heat.',
          'Pour over cooked rice. Add lemon juice, salt, peanuts.',
          'Mix gently. Serve with papad and pickle.'],
   yt:'lemon+rice+recipe'},

  /* ── Street Food ── */
  {id:'sf01',cat:'Street Food',name:'Samosa',
   img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
   tags:['Vegetarian','Crispy','Classic'],
   ingredients:['Maida 2 cups','Potato 4 (boiled)','Green Peas ½ cup','Ginger 1 inch','Green Chilli 2','Cumin 1 tsp','Amchur 1 tsp','Garam Masala 1 tsp','Ajwain ½ tsp','Oil + Salt','Coriander leaves'],
   steps:['Make dough with maida, ajwain, salt, oil and water. Rest 30 min.',
          'Mix mashed potato, peas, ginger, chilli, cumin, amchur, garam masala.',
          'Roll dough thin. Shape into cones. Fill with potato mixture.',
          'Seal edges tightly with water.',
          'Deep fry on medium heat until golden and crispy.',
          'Serve hot with green chutney and tamarind chutney.'],
   yt:'samosa+recipe'},

  {id:'sf02',cat:'Street Food',name:'Pani Puri (Gol Gappe)',
   img:'https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&q=80',
   tags:['Vegetarian','Chaat','Tangy'],
   ingredients:['Sooji 1 cup','Maida 2 tbsp','Baking Soda pinch','Boiled Potato 2','Boiled Chickpeas ½ cup','Mint 1 cup','Green Chilli 2','Tamarind Chutney','Black Salt 1 tsp','Cumin Powder 1 tsp','Chaat Masala 1 tsp'],
   steps:['Mix sooji, maida, salt. Knead stiff dough. Rest 30 min.',
          'Roll thin and cut small circles. Deep fry until puffed.',
          'Pani: blend mint, green chilli, lemon juice, cumin, black salt. Strain.',
          'Filling: mash potato with chickpeas, chaat masala, salt.',
          'Make hole in each puri. Fill with potato mixture.',
          'Dip in pani and eat immediately!'],
   yt:'pani+puri+recipe'},

  {id:'sf03',cat:'Street Food',name:'Pav Bhaji',
   img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
   tags:['Vegetarian','Mumbai','Street Classic'],
   ingredients:['Mixed Vegetables 3 cups','Pav Buns 8','Onion 2','Tomato 4','Capsicum 1','Butter 5 tbsp','Pav Bhaji Masala 3 tbsp','Ginger-Garlic Paste 1 tbsp','Lemon','Coriander','Salt to taste'],
   steps:['Pressure cook all vegetables until very soft.',
          'Melt butter in wide pan. Sauté onions until golden.',
          'Add ginger-garlic, capsicum, tomatoes. Cook 15 min.',
          'Add cooked vegetables. Mash everything together.',
          'Add pav bhaji masala. Cook on high 10 min.',
          'Toast pav in butter. Serve bhaji topped with butter, onion, lemon.'],
   yt:'pav+bhaji+recipe'},

  {id:'sf04',cat:'Street Food',name:'Veg Chowmein (Indian Street Style)',
   img:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80',
   tags:['Vegetarian','Indo-Chinese','Quick'],
   ingredients:['Noodles 200g','Cabbage 1 cup','Carrot 1','Capsicum 1','Onion 1','Spring Onion','Soy Sauce 2 tbsp','Green Chilli Sauce 1 tbsp','Ketchup 2 tbsp','Vinegar 1 tsp','Ginger-Garlic Paste 1 tbsp','Oil 3 tbsp'],
   steps:['Boil noodles with salt until just done. Drain and rinse. Toss with oil.',
          'Heat wok on high. Fry ginger-garlic 30 sec.',
          'Add onion. Stir fry 1 min. Add all vegetables.',
          'Stir fry on high heat 2-3 min. Keep vegetables crunchy.',
          'Add soy sauce, chilli sauce, ketchup, vinegar, salt, pepper.',
          'Add noodles. Toss on high heat 2 min. Garnish with spring onion.'],
   yt:'veg+chowmein+indian+street+style'},

  {id:'sf05',cat:'Street Food',name:'Egg Roll (Kolkata Style)',
   img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80',
   tags:['Non-Veg','Kolkata Special','Wrap'],
   ingredients:['Maida 2 cups','Egg 4','Onion 2 (sliced)','Green Chilli 2','Kasundi Mustard','Ketchup','Chaat Masala','Lemon Juice','Oil 4 tbsp','Salt to taste'],
   steps:['Knead soft dough with maida, oil, salt. Rest 20 min.',
          'Roll thin parathas. Cook on tawa with oil.',
          'Beat egg with salt. Pour over cooking paratha. Flip once set.',
          'Lay paratha egg-side up. Place sliced onion, green chilli.',
          'Sprinkle chaat masala and lemon juice.',
          'Add kasundi and ketchup. Roll tightly in paper. Serve immediately.'],
   yt:'kolkata+egg+roll+recipe'},

  {id:'sf06',cat:'Street Food',name:'Vada Pav (Mumbai Burger)',
   img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
   tags:['Vegetarian','Mumbai','Iconic'],
   ingredients:['Potato 5 (boiled mashed)','Pav Buns 6','Besan 1 cup','Mustard Seeds 1 tsp','Green Chilli 3','Ginger 1 inch','Garlic 4 cloves','Turmeric ½ tsp','Dry Garlic Chutney','Green Chutney','Oil for frying'],
   steps:['Temper mustard in oil. Add mashed potato, chilli, ginger, garlic, turmeric, coriander.',
          'Shape potato mixture into balls.',
          'Make besan batter with salt, turmeric, water.',
          'Dip potato balls in batter. Deep fry until golden.',
          'Slice pav. Apply green chutney and dry garlic chutney.',
          'Place vada inside pav. Serve with fried green chilli.'],
   yt:'vada+pav+recipe'},

  {id:'sf07',cat:'Street Food',name:'Aloo Chaat',
   img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80',
   tags:['Vegetarian','Chaat','Tangy'],
   ingredients:['Potato 4 (boiled cubed)','Tamarind Chutney 3 tbsp','Green Chutney 2 tbsp','Yogurt ½ cup','Chaat Masala 1 tsp','Red Chilli ½ tsp','Sev (chickpea noodles)','Pomegranate seeds','Coriander leaves'],
   steps:['Shallow fry boiled potato cubes until crispy.',
          'Place fried potatoes on plate.',
          'Drizzle tamarind chutney and green chutney.',
          'Spoon yogurt on top.',
          'Sprinkle chaat masala, red chilli, cumin powder.',
          'Top with sev, pomegranate seeds, and fresh coriander. Eat immediately!'],
   yt:'aloo+chaat+recipe'},

  {id:'sf08',cat:'Street Food',name:'Bhel Puri',
   img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80',
   tags:['Vegetarian','Mumbai Chaat','Crunchy'],
   ingredients:['Puffed Rice 3 cups','Sev 1 cup','Papdi 10 (crushed)','Potato 1 (boiled diced)','Onion 1','Tomato 1','Tamarind Chutney 3 tbsp','Green Chutney 2 tbsp','Chaat Masala 1 tsp','Coriander leaves'],
   steps:['Mix puffed rice with sev and crushed papdi.',
          'Add potato, onion, and tomato. Mix gently.',
          'Drizzle tamarind chutney and green chutney.',
          'Sprinkle chaat masala and red chilli powder.',
          'Add pomegranate seeds and fresh coriander.',
          'Mix and serve immediately — it gets soggy quickly!'],
   yt:'bhel+puri+recipe'},

  {id:'sf09',cat:'Street Food',name:'Onion Pakora (Bhajiya)',
   img:'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80',
   tags:['Vegetarian','Monsoon Snack','Crispy'],
   ingredients:['Onion 4 (thin sliced)','Besan 1½ cups','Green Chilli 3','Coriander leaves','Ginger 1 inch','Red Chilli 1 tsp','Turmeric ¼ tsp','Ajwain ½ tsp','Baking Soda pinch','Salt to taste','Oil for frying'],
   steps:['Mix sliced onion with salt. Squeeze to release water.',
          'Add besan, green chilli, ginger, coriander, spices.',
          'Add baking soda. Mix. Thick batter — add little water if needed.',
          'Heat oil. Drop spoonfuls into hot oil.',
          'Fry on medium until golden and crispy.',
          'Serve hot with green chutney and chai!'],
   yt:'onion+pakora+recipe'},

  {id:'sf10',cat:'Street Food',name:'Dahi Puri',
   img:'https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&q=80',
   tags:['Vegetarian','Chaat','Creamy'],
   ingredients:['Puri shells 16','Yogurt 1 cup (chilled whisked)','Boiled Potato 2','Boiled Chickpeas ½ cup','Tamarind Chutney','Green Chutney','Sev','Chaat Masala','Red Chilli Powder','Pomegranate seeds','Coriander'],
   steps:['Make a hole in top of each puri.',
          'Mix potato and chickpeas with chaat masala and salt.',
          'Fill each puri with potato-chickpea mixture.',
          'Spoon generous yogurt over each puri.',
          'Drizzle tamarind and green chutney.',
          'Top with sev, pomegranate, chaat masala, chilli. Serve immediately.'],
   yt:'dahi+puri+recipe'},

  {id:'sf11',cat:'Street Food',name:'Veg Spring Roll',
   img:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
   tags:['Vegetarian','Indo-Chinese','Crispy'],
   ingredients:['Spring Roll Sheets 12','Cabbage 2 cups','Carrot 1','Capsicum 1','Bean Sprouts ½ cup','Spring Onion','Soy Sauce 2 tbsp','Ginger-Garlic Paste 1 tbsp','Black Pepper 1 tsp','Cornflour (for sealing)','Oil for frying'],
   steps:['Stir fry ginger-garlic. Add all vegetables on high heat 3 min.',
          'Add soy sauce, pepper, salt. Keep vegetables crunchy. Cool completely.',
          'Place spring roll sheet flat. Add filling near one edge.',
          'Fold sides in. Roll tightly. Seal edge with cornflour paste.',
          'Deep fry until golden and crispy on all sides.',
          'Serve with sweet chilli sauce or schezwan sauce.'],
   yt:'veg+spring+roll+recipe'},

  {id:'sf12',cat:'Street Food',name:'Chicken Kati Roll',
   img:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80',
   tags:['Non-Veg','Kolkata','Wrap'],
   ingredients:['Paratha dough (maida)','Chicken 300g','Egg 2','Onion 2 (sliced)','Green Chilli 2','Chaat Masala','Lemon Juice','Green Chutney','Ginger-Garlic Paste 1 tbsp','Tandoori Spice 2 tbsp','Salt to taste'],
   steps:['Marinate chicken with ginger-garlic, tandoori spice, salt. Cook until done.',
          'Roll thin parathas. Break egg over paratha while cooking.',
          'Flip once. Cook egg side until set.',
          'Lay paratha egg-side up. Place chicken pieces.',
          'Add sliced onion, green chilli, drizzle chutney.',
          'Sprinkle chaat masala and lemon juice. Roll tightly and serve.'],
   yt:'chicken+kati+roll+recipe'},

  /* ── Mughlai ── */
  {id:'m01',cat:'Mughlai',name:'Hyderabadi Dum Biryani',
   img:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
   tags:['Non-Veg','Rice','Festive'],
   ingredients:['Basmati Rice 2 cups','Chicken 750g','Yogurt 1 cup','Fried Onion 1 cup','Saffron + warm milk','Mint Leaves large bunch','Ginger-Garlic Paste 3 tbsp','Biryani Masala 3 tbsp','Whole Spices','Ghee 4 tbsp','Rose Water 1 tbsp'],
   steps:['Marinate chicken with yogurt, biryani masala, ginger-garlic, fried onion, mint, saffron for 4 hours.',
          'Cook rice in boiling water with whole spices until 70% done. Drain.',
          'Layer marinated chicken in heavy pot.',
          'Top with partially cooked rice. Add saffron milk, fried onion, mint.',
          'Seal pot with dough. Cook on high 5 min, then lowest flame 40 min.',
          'Rest 15 min before opening. Serve with raita.'],
   yt:'hyderabadi+dum+biryani+recipe'},

  {id:'m02',cat:'Mughlai',name:'Seekh Kebab',
   img:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80',
   tags:['Non-Veg','Grilled','Starter'],
   ingredients:['Minced Lamb 500g','Onion 1 (squeezed dry)','Ginger-Garlic Paste 2 tbsp','Green Chilli 3','Coriander & Mint leaves','Garam Masala 1 tsp','Red Chilli 1 tsp','Roasted Cumin 1 tsp','Egg 1','Oil for basting'],
   steps:['Squeeze all moisture from onion in cloth.',
          'Mix minced lamb with all ingredients. Knead 10 min.',
          'Refrigerate 1 hour.',
          'Shape around skewers into long cylinders.',
          'Grill or pan fry, rotating and basting with oil until cooked.',
          'Serve with mint chutney, onion rings, and lemon.'],
   yt:'seekh+kebab+recipe'},

  {id:'m03',cat:'Mughlai',name:'Tandoori Chicken',
   img:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80',
   tags:['Non-Veg','Grilled','Classic'],
   ingredients:['Chicken 1 kg (cut pieces)','Yogurt 1 cup','Kashmiri Chilli 2 tsp','Tandoori Masala 3 tbsp','Ginger-Garlic Paste 3 tbsp','Lemon Juice 3 tbsp','Mustard Oil 3 tbsp','Cumin Powder 1 tsp','Garam Masala 1 tsp','Salt to taste'],
   steps:['Make deep cuts in chicken pieces.',
          'First marinate: lemon juice, chilli, salt. Rest 30 min.',
          'Second marinate: yogurt, tandoori masala, ginger-garlic, oils, spices. Refrigerate 4-6 hours.',
          'Cook in preheated oven 220°C for 25-30 min, turning once.',
          'For smokiness: place hot coal in center, drizzle ghee, cover 2 min.',
          'Serve with mint chutney, sliced onion, lemon.'],
   yt:'tandoori+chicken+recipe'},

  {id:'m04',cat:'Mughlai',name:'Shahi Korma',
   img:'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=500&q=80',
   tags:['Non-Veg','Rich Gravy','Aromatic'],
   ingredients:['Chicken or Lamb 700g','Onion 3 (fried golden)','Yogurt 1 cup','Cashew-Almond Paste ¼ cup','Cream ¼ cup','Cardamom 4','Cloves 5','Cinnamon 1','Saffron in milk','Rose Water 1 tbsp','Ghee 4 tbsp'],
   steps:['Blend fried onions, yogurt, and cashew paste together.',
          'Heat ghee. Add whole spices.',
          'Add the blended paste. Cook 15 min.',
          'Add meat pieces. Sear on high.',
          'Reduce heat. Add saffron milk and rose water.',
          'Cover and slow cook 45 min until very tender. Finish with cream.'],
   yt:'shahi+korma+recipe'},

  /* ── Vegetarian ── */
  {id:'v01',cat:'Vegetarian',name:'Paneer Butter Masala',
   img:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80',
   tags:['Vegetarian','Gravy','Restaurant Style'],
   ingredients:['Paneer 300g','Tomato 4','Onion 2','Cashews ¼ cup','Butter 3 tbsp','Cream ¼ cup','Kasuri Methi 1 tbsp','Cardamom 2','Garam Masala 1 tsp','Red Chilli 1 tsp','Honey 1 tsp','Salt to taste'],
   steps:['Boil onion, tomato, cashews together until soft. Blend smooth.',
          'Melt butter. Add cardamom. Pour blended gravy through strainer.',
          'Cook gravy on medium 15 min until thickened.',
          'Add all spices, kasuri methi, honey, salt.',
          'Add paneer cubes. Stir in cream.',
          'Simmer 5 min. Serve with naan or paratha.'],
   yt:'paneer+butter+masala+recipe'},

  {id:'v02',cat:'Vegetarian',name:'Dal Tadka',
   img:'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80',
   tags:['Vegetarian','Everyday','Lentils'],
   ingredients:['Toor Dal 1 cup','Chana Dal ¼ cup','Tomato 2','Onion 1','Garlic 5','Green Chilli 2','Cumin Seeds 2 tsp','Dried Red Chilli 2','Turmeric 1 tsp','Ghee 3 tbsp','Coriander','Salt to taste'],
   steps:['Pressure cook both dals with turmeric, tomato, and salt (4 whistles).',
          'Mash dal well.',
          'Heat ghee. Crackle cumin and mustard seeds.',
          'Add dried red chilli, garlic, onion. Fry until golden.',
          'Pour this tadka over the dal.',
          'Garnish with coriander. Serve with rice or roti.'],
   yt:'dal+tadka+recipe'},

  {id:'v03',cat:'Vegetarian',name:'Paneer Tikka',
   img:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80',
   tags:['Vegetarian','Grilled','Starter'],
   ingredients:['Paneer 400g cubed','Capsicum 2','Onion 2','Yogurt 1 cup','Ginger-Garlic Paste 2 tbsp','Tikka Masala 2 tbsp','Red Chilli 1 tsp','Kasuri Methi 1 tbsp','Mustard Oil 2 tbsp','Lemon Juice 2 tbsp','Chaat Masala 1 tsp'],
   steps:['Mix yogurt, ginger-garlic paste, tikka masala, chilli, kasuri methi, oils, lemon.',
          'Marinate paneer, capsicum, onion cubes for 2 hours.',
          'Thread paneer and vegetables on skewers alternately.',
          'Grill at 220°C for 15-18 min until charred on edges.',
          'Sprinkle chaat masala and lemon juice.',
          'Serve with mint chutney and onion rings.'],
   yt:'paneer+tikka+recipe'},

  {id:'v04',cat:'Vegetarian',name:'Chana Masala',
   img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80',
   tags:['Vegetarian','Protein Rich','Spicy'],
   ingredients:['Chickpeas 2 cups (soaked overnight)','Onion 2','Tomato 3','Ginger 2 inches','Garlic 6','Chole Masala 2 tbsp','Cumin 1 tsp','Bay Leaf 2','Amchur 1 tsp','Ghee 2 tbsp','Coriander'],
   steps:['Pressure cook chickpeas with tea bag and salt (5 whistles).',
          'Sauté cumin and bay leaf in ghee. Add onions until dark brown.',
          'Add ginger, garlic, tomatoes. Cook until oil separates.',
          'Add chole masala, amchur. Mix well.',
          'Add chickpeas. Mash a few to thicken. Simmer 20 min.',
          'Serve with bhature or rice.'],
   yt:'chana+masala+recipe'},

  {id:'v05',cat:'Vegetarian',name:'Baingan Bharta',
   img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
   tags:['Vegetarian','Smoky','North Indian'],
   ingredients:['Large Eggplant 1','Onion 2','Tomato 3','Green Chilli 2','Garlic 4','Ginger 1 inch','Red Chilli 1 tsp','Garam Masala ½ tsp','Turmeric ¼ tsp','Mustard Oil 2 tbsp','Coriander'],
   steps:['Roast eggplant directly over gas flame until charred all over.',
          'Cool, peel skin. Mash smoky flesh with garlic.',
          'Heat mustard oil. Crackle cumin. Add onion until golden.',
          'Add ginger, green chilli, tomatoes, spices. Cook 12 min.',
          'Add mashed baingan. Cook 8 min.',
          'Add garam masala and coriander. Serve with roti.'],
   yt:'baingan+bharta+recipe'},

  /* ── Indian Sweets ── */
  {id:'sw01',cat:'Indian Sweets',name:'Gulab Jamun',
   img:'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80',
   tags:['Sweets','Festive','Deep Fried'],
   ingredients:['Khoya 1 cup','Maida 3 tbsp','Baking Powder ¼ tsp','Milk 2 tbsp','Sugar 2 cups','Water 1 cup','Cardamom ½ tsp','Rose Water 1 tsp','Saffron few strands','Oil for frying'],
   steps:['Sugar syrup: boil sugar, water, cardamom, saffron, rose water until one-string consistency. Keep warm.',
          'Knead khoya with maida, baking powder, milk into smooth dough.',
          'Divide into small equal balls. Roll smooth without cracks.',
          'Deep fry on medium-low heat until dark golden brown.',
          'Immediately drop hot jamuns into warm sugar syrup.',
          'Soak at least 2 hours before serving. Serve warm.'],
   yt:'gulab+jamun+recipe'},

  {id:'sw02',cat:'Indian Sweets',name:'Gajar Halwa (Carrot Halwa)',
   img:'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80',
   tags:['Sweets','Winter Special','Pudding'],
   ingredients:['Carrot 1 kg (grated)','Full Fat Milk 1 litre','Sugar ¾ cup','Ghee 4 tbsp','Cardamom 1 tsp','Cashews ¼ cup','Raisins 2 tbsp','Almonds (sliced)','Khoya ½ cup'],
   steps:['Cook grated carrots in milk on medium heat stirring often.',
          'Continue until milk is completely absorbed — 45-60 min.',
          'Add ghee and sugar. Cook on high 10 min.',
          'Add cardamom and khoya. Mix.',
          'Cook until halwa leaves sides of pan.',
          'Fry cashews and raisins in ghee. Mix in. Serve warm.'],
   yt:'gajar+halwa+recipe'},

  {id:'sw03',cat:'Indian Sweets',name:'Rice Kheer',
   img:'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80',
   tags:['Sweets','Festive','Pudding'],
   ingredients:['Basmati Rice ¼ cup (soaked)','Full Fat Milk 1 litre','Sugar ½ cup','Cardamom 1 tsp','Saffron few strands','Cashews 3 tbsp','Almonds 3 tbsp','Pistachio 2 tbsp','Rose Water 1 tsp'],
   steps:['Boil milk in heavy pan stirring continuously.',
          'Add soaked, drained rice. Cook on medium stirring often.',
          'When rice is soft and milk thickens (30-40 min), add sugar.',
          'Cook 10 more min. Add saffron and cardamom.',
          'Add rose water.',
          'Garnish with all nuts. Serve warm or chilled.'],
   yt:'kheer+recipe'},

  {id:'sw04',cat:'Indian Sweets',name:'Jalebi',
   img:'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80',
   tags:['Sweets','Crispy','Street Favourite'],
   ingredients:['Maida 1 cup','Cornflour 2 tbsp','Yogurt 2 tbsp','Yeast ½ tsp','Turmeric ¼ tsp','Sugar 1½ cups','Water ¾ cup','Saffron','Rose Water','Cardamom','Oil for frying'],
   steps:['Mix maida, cornflour, yogurt, yeast, turmeric with water to batter. Ferment 8 hours.',
          'Make sugar syrup with saffron, cardamom to single thread. Keep warm.',
          'Pour batter in squeeze bottle or piping bag.',
          'Squeeze spiral shapes into hot oil. Fry until light golden and crisp.',
          'Remove and dip in warm sugar syrup for 30 seconds.',
          'Remove from syrup and serve immediately — crispy outside, juicy inside!'],
   yt:'jalebi+recipe'},

  {id:'sw05',cat:'Indian Sweets',name:'Besan Ladoo',
   img:'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80',
   tags:['Sweets','Festive','Easy'],
   ingredients:['Besan 2 cups','Ghee ½ cup','Powdered Sugar ¾ cup','Cardamom 1 tsp','Cashews 3 tbsp','Raisins 2 tbsp'],
   steps:['Heat ghee in heavy pan. Add besan.',
          'Roast besan on low heat stirring continuously until golden and fragrant — 20-25 min.',
          'Remove from heat. Cool until just warm.',
          'Add powdered sugar, cardamom, cashews, raisins. Mix well.',
          'Grease hands with ghee. Shape into round ladoos.',
          'Let cool completely. Lasts 2 weeks.'],
   yt:'besan+ladoo+recipe'},

  {id:'sw06',cat:'Indian Sweets',name:'Rasgulla',
   img:'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80',
   tags:['Sweets','Bengali','Milk Based'],
   ingredients:['Full Fat Milk 2 litres','Lemon Juice 3 tbsp','Sugar 2 cups','Water 5 cups','Cardamom 2 pods','Rose Water 1 tsp'],
   steps:['Boil milk. Add lemon juice slowly while stirring — milk curdles.',
          'Drain chhena through muslin. Wash to remove sourness.',
          'Knead chhena very smooth 10 min.',
          'Divide into small smooth balls — no cracks.',
          'Boil sugar-water syrup. Add cardamom.',
          'Add chhena balls. Cover and cook 15-18 min on medium. They double in size. Add rose water. Serve chilled.'],
   yt:'rasgulla+recipe'},

  {id:'sw07',cat:'Indian Sweets',name:'Mango Kulfi',
   img:'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&q=80',
   tags:['Sweets','Ice Cream','Summer'],
   ingredients:['Mango Pulp 2 cups','Full Fat Milk 1 litre','Condensed Milk ½ cup','Cream ¼ cup','Sugar 3 tbsp','Cardamom ½ tsp','Pistachio 3 tbsp','Saffron few strands'],
   steps:['Boil milk until reduced to half stirring frequently — 20-25 min.',
          'Cool. Add condensed milk, cream, sugar.',
          'Add mango pulp, saffron, cardamom. Blend smooth.',
          'Pour into kulfi moulds. Add pistachio on top.',
          'Cover with foil. Freeze 6-8 hours.',
          'Run warm water outside mould to unmould. Serve immediately.'],
   yt:'mango+kulfi+recipe'},

  /* ── Indian Breads ── */
  {id:'b01',cat:'Indian Breads',name:'Aloo Paratha',
   img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
   tags:['Vegetarian','Breakfast','Stuffed'],
   ingredients:['Wheat Flour 2 cups','Potato 4 (boiled mashed)','Green Chilli 2','Ginger 1 inch','Cumin 1 tsp','Amchur ½ tsp','Garam Masala ½ tsp','Coriander','Ghee for cooking','Salt to taste'],
   steps:['Knead wheat flour with water into soft dough. Rest 20 min.',
          'Mix mashed potato with green chilli, ginger, cumin, amchur, garam masala, coriander, salt.',
          'Flatten a dough ball. Place filling in center.',
          'Gather edges and seal. Gently roll into thick paratha.',
          'Cook on hot tawa. Apply ghee on both sides until golden spots appear.',
          'Serve hot with yogurt, butter, and pickle.'],
   yt:'aloo+paratha+recipe'},

  {id:'b02',cat:'Indian Breads',name:'Garlic Butter Naan',
   img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
   tags:['Vegetarian','Tandoor Style','Restaurant'],
   ingredients:['Maida 2 cups','Yogurt ¼ cup','Yeast 1 tsp','Sugar 1 tsp','Salt to taste','Oil 2 tbsp','Garlic 6 cloves (minced)','Butter 4 tbsp','Fresh Coriander','Nigella Seeds'],
   steps:['Mix yeast, sugar in warm water. Let foam 10 min.',
          'Combine maida, salt, yogurt, oil, yeast mixture. Knead smooth. Rest 2 hours.',
          'Divide into balls. Roll into tear-drop shapes.',
          'Sprinkle nigella seeds and garlic.',
          'Cook in very hot pan until bubbles appear. Flip and cook.',
          'Brush immediately with garlic butter and coriander. Serve hot.'],
   yt:'garlic+naan+recipe'},

  {id:'b03',cat:'Indian Breads',name:'Puri',
   img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
   tags:['Vegetarian','Deep Fried','Festive'],
   ingredients:['Wheat Flour 2 cups','Sooji 2 tbsp','Oil 1 tbsp','Salt to taste','Oil for deep frying'],
   steps:['Mix flour, sooji, oil, salt. Add water gradually to make firm dough.',
          'Rest dough 20-30 min.',
          'Divide into small balls. Roll into small circles.',
          'Heat oil until very hot.',
          'Slide puri gently into oil. Press lightly with spatula — it puffs up.',
          'Flip and cook 30 seconds more. Drain. Serve immediately with chole or aloo.'],
   yt:'puri+recipe'},

  {id:'b04',cat:'Indian Breads',name:'Laccha Paratha',
   img:'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80',
   tags:['Vegetarian','Layered','Flaky'],
   ingredients:['Maida 2 cups','Ghee 4 tbsp','Salt to taste','Oil for cooking'],
   steps:['Make soft dough with maida, ghee, salt, water. Rest 30 min.',
          'Roll a ball into thin disc.',
          'Spread ghee generously. Fold into pleats like a fan.',
          'Roll the pleated strip into a coil. Press flat.',
          'Roll gently into paratha.',
          'Cook on tawa with ghee until golden on both sides. Scrunch with hands to separate layers.'],
   yt:'laccha+paratha+recipe'},

  /* ── Drinks & Rice ── */
  {id:'d01',cat:'Drinks & Rice',name:'Mango Lassi',
   img:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80',
   tags:['Drink','Summer','Sweet'],
   ingredients:['Mango Pulp 1 cup','Yogurt 1 cup','Milk ½ cup','Sugar 3 tbsp','Cardamom ¼ tsp','Ice cubes','Rose Water few drops','Pistachio to garnish'],
   steps:['Blend mango pulp, yogurt, milk, sugar, cardamom until smooth.',
          'Add ice cubes and blend again.',
          'Taste and adjust sweetness.',
          'Add rose water. Blend briefly.',
          'Pour into glasses.',
          'Garnish with chopped pistachio and mango slice. Serve chilled.'],
   yt:'mango+lassi+recipe'},

  {id:'d02',cat:'Drinks & Rice',name:'Masala Chai',
   img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
   tags:['Drink','Hot','Everyday'],
   ingredients:['Milk 1½ cups','Water ½ cup','Tea Leaves 2 tsp','Sugar 2 tsp','Ginger 1 inch','Cardamom 3 pods','Cloves 2','Black Pepper 2','Cinnamon ½ inch'],
   steps:['Crush cardamom, cloves, pepper with ginger.',
          'Add water to pan with all spices. Bring to boil.',
          'Add tea leaves. Boil 2 min.',
          'Add milk and sugar. Bring to full boil.',
          'Reduce heat and simmer 3-4 min until chai darkens and froths.',
          'Strain into cups. Serve with biscuits or samosa!'],
   yt:'masala+chai+recipe'},

  {id:'d03',cat:'Drinks & Rice',name:'Matar Pulao',
   img:'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
   tags:['Vegetarian','Rice','Everyday'],
   ingredients:['Basmati Rice 2 cups (soaked)','Green Peas 1 cup','Onion 1','Bay Leaf 2','Cardamom 3','Cloves 4','Cumin 1 tsp','Ghee 2 tbsp','Salt to taste','Water 3½ cups'],
   steps:['Soak basmati rice 30 min. Drain.',
          'Heat ghee. Add whole spices and cumin.',
          'Add onion. Sauté until light golden.',
          'Add peas. Sauté 2 min.',
          'Add rice. Stir gently 2 min.',
          'Add water and salt. Boil then cover and cook on lowest heat 15 min. Rest 5 min before fluffing.'],
   yt:'matar+pulao+recipe'},

  {id:'d04',cat:'Drinks & Rice',name:'Sweet Lassi',
   img:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80',
   tags:['Drink','Summer','Traditional'],
   ingredients:['Yogurt 1½ cups','Milk ½ cup','Sugar 4 tbsp','Cardamom ¼ tsp','Rose Water 1 tsp','Ice cubes','Cream (malai)','Pistachio'],
   steps:['Take thick yogurt in blender.',
          'Blend until completely smooth.',
          'Add milk, sugar, cardamom powder, rose water.',
          'Blend 1-2 min until frothy.',
          'Add ice cubes. Blend briefly.',
          'Pour into tall glasses. Top with fresh cream. Garnish with pistachio.'],
   yt:'sweet+lassi+recipe'},

  {id:'d05',cat:'Drinks & Rice',name:'Nimbu Pani (Indian Lemonade)',
   img:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80',
   tags:['Drink','Summer','Refreshing'],
   ingredients:['Lemon 4','Sugar 4 tbsp','Black Salt ½ tsp','Roasted Cumin ½ tsp','Mint Leaves fresh','Cold Water 3 cups','Ice cubes'],
   steps:['Squeeze all lemons to get juice.',
          'Mix sugar with ¼ cup warm water to make simple syrup.',
          'Combine lemon juice, sugar syrup, black salt, cumin.',
          'Add cold water. Stir well.',
          'Taste and adjust sweetness.',
          'Pour over ice. Add mint leaves. Serve immediately!'],
   yt:'nimbu+pani+recipe'}
];

/* ── Unique categories ── */
var CATS = [];
DB.forEach(function(d) {
  if (CATS.indexOf(d.cat) === -1) CATS.push(d.cat);
});

var CAT_META = {
  'North Indian': { icon:'🥘', color:'#B5231A' },
  'South Indian': { icon:'🌴', color:'#1A7A4A' },
  'Street Food':  { icon:'🔥', color:'#E67E22' },
  'Mughlai':      { icon:'👑', color:'#8B4513' },
  'Vegetarian':   { icon:'🌿', color:'#27AE60' },
  'Indian Sweets':{ icon:'🍬', color:'#D35400' },
  'Indian Breads':{ icon:'🫓', color:'#C0852A' },
  'Drinks & Rice':{ icon:'🥤', color:'#8E44AD' }
};

/* =========================================================
   LOGIN
   ========================================================= */
function initLoginPage() {
  if (getEmail()) { goTo('home.html'); return; }
  initFAQ();

  var form  = byId('login-form');
  var msgEl = byId('login-message');
  if (!form) { console.error('login-form not found'); return; }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = byId('login-email').value.trim().toLowerCase();
    var pass  = byId('login-password').value;

    if (!email || !pass) { showMsg('login-message','Please fill in both fields.', false); return; }

    var users = getUsers();
    var user  = null;
    for (var i=0; i<users.length; i++) {
      if (users[i].email === email) { user = users[i]; break; }
    }

    if (!user) { showMsg('login-message','No account found. Please register first.', false); return; }
    if (user.password !== pass) { showMsg('login-message','Incorrect password. Try again.', false); return; }

    saveSession(user.email, user.name);
    showMsg('login-message', 'Welcome back, '+user.name+'! Redirecting...', true);
    setTimeout(function() { goTo('home.html'); }, 900);
  });
}

/* =========================================================
   REGISTER
   ========================================================= */
function initRegisterPage() {
  if (getEmail()) { goTo('home.html'); return; }
  initFAQ();

  var form  = byId('register-form');
  var msgEl = byId('register-message');
  if (!form) { console.error('register-form not found'); return; }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var name  = byId('reg-name').value.trim();
    var email = byId('reg-email').value.trim().toLowerCase();
    var pass  = byId('reg-password').value;
    var conf  = byId('reg-confirm').value;

    if (!name)  { showMsg('register-message','Please enter your name.', false); return; }
    if (!email) { showMsg('register-message','Please enter your email.', false); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg('register-message','Enter a valid email address.', false); return;
    }
    if (!pass || pass.length < 6) {
      showMsg('register-message','Password must be at least 6 characters.', false); return;
    }
    if (pass !== conf) {
      showMsg('register-message','Passwords do not match.', false); return;
    }

    var users = getUsers();
    for (var i=0; i<users.length; i++) {
      if (users[i].email === email) {
        showMsg('register-message','Email already registered. Please login.', false);
        return;
      }
    }

    users.push({ name:name, email:email, password:pass });
    saveUsers(users);
    showMsg('register-message','Account created! Redirecting to login...', true);
    setTimeout(function() { goTo('index.html'); }, 1200);
  });
}

/* =========================================================
   HOME PAGE
   ========================================================= */
function initHomePage() {
  if (!getEmail()) { goTo('index.html'); return; }

  /* Navbar */
  var nameEl = byId('nav-username');
  var logBtn = byId('logout-btn');
  if (nameEl) nameEl.textContent = getUname();
  if (logBtn) logBtn.addEventListener('click', function() {
    clearSession(); goTo('index.html');
  });

  initFAQ();
  buildTabs();

  /* Search */
  var form  = byId('search-form');
  var input = byId('search-input');
  if (!form) { console.error('search-form not found'); return; }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    doSearch(input.value.trim());
  });

  qsa('.chip').forEach(function(c) {
    c.addEventListener('click', function() { doSearch(this.dataset.query); });
  });

  qsa('[data-search]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      doSearch(this.dataset.search);
      window.scrollTo({ top:0, behavior:'smooth' });
    });
  });

  /* Modal close */
  var closeBtn = byId('modal-close-btn');
  var overlay  = byId('modal-overlay');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay)  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModal();
  });

  /* Load first category */
  loadCat(CATS[0]);
}

/* ── Search ── */
function doSearch(q) {
  q = (q || '').trim();
  if (!q) return;

  var input = byId('search-input');
  if (input) input.value = q;

  qsa('.cat-tab').forEach(function(t) { t.classList.remove('active'); });

  var term = q.toLowerCase();
  var hits = DB.filter(function(r) {
    return r.name.toLowerCase().indexOf(term) !== -1 ||
           r.cat.toLowerCase().indexOf(term)  !== -1 ||
           r.tags.join(' ').toLowerCase().indexOf(term) !== -1 ||
           r.ingredients.join(' ').toLowerCase().indexOf(term) !== -1;
  });

  renderSection(hits, '🔍 Results for "' + q + '"');

  setTimeout(function() {
    var sec = byId('results-section');
    if (sec) sec.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 250);
}

/* ── Tabs ── */
function buildTabs() {
  var bar = byId('cat-tabs');
  if (!bar) return;
  bar.innerHTML = '';

  CATS.forEach(function(cat, i) {
    var m   = CAT_META[cat] || { icon:'🍽️', color:'#B5231A' };
    var btn = document.createElement('button');
    btn.className   = 'cat-tab' + (i === 0 ? ' active' : '');
    btn.dataset.cat = cat;
    btn.textContent = m.icon + ' ' + cat;
    btn.style.setProperty('--cat-color', m.color);
    btn.addEventListener('click', function() {
      qsa('.cat-tab').forEach(function(t) { t.classList.remove('active'); });
      btn.classList.add('active');
      var inp = byId('search-input');
      if (inp) inp.value = '';
      loadCat(cat);
    });
    bar.appendChild(btn);
  });
}

function loadCat(cat) {
  var m     = CAT_META[cat] || { icon:'🍽️' };
  var items = DB.filter(function(r) { return r.cat === cat; });
  renderSection(items, m.icon + ' ' + cat + ' Recipes');
}

/* ── Render cards ── */
function renderSection(items, title) {
  var section = byId('results-section');
  var loading = byId('loading-state');
  var empty   = byId('empty-state');
  var header  = byId('results-header');
  var titleEl = byId('results-title');
  var countEl = byId('results-count');
  var grid    = byId('recipe-grid');

  if (!section || !grid) { console.error('results-section or recipe-grid missing'); return; }

  section.style.display = 'block';
  if (loading) loading.classList.remove('show');
  if (empty)   empty.classList.remove('show');
  grid.innerHTML = '';

  if (!items.length) {
    if (header) header.style.display = 'none';
    if (empty)  empty.classList.add('show');
    var eh = byId('empty-state') && byId('empty-state').querySelector('h3');
    var ep = byId('empty-state') && byId('empty-state').querySelector('p');
    if (eh) eh.textContent = 'No recipes found';
    if (ep) ep.textContent = 'Try a different keyword or pick a category tab.';
    return;
  }

  if (header) header.style.display = 'flex';
  if (titleEl) titleEl.textContent = title;
  if (countEl) countEl.textContent = items.length + ' recipe' + (items.length !== 1 ? 's' : '') + ' available';

  items.forEach(function(dish, i) {
    var card = document.createElement('div');
    card.className = 'recipe-card';
    card.style.animationDelay = (i * 0.05) + 's';
    card.innerHTML =
      '<div class="recipe-card-img-wrap">' +
        '<img class="recipe-card-img" src="' + esc(dish.img) + '" alt="' + esc(dish.name) + '" loading="lazy"' +
        ' onerror="this.src=\'https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&q=80\'" />' +
        '<span class="recipe-card-tag">' + esc(dish.cat) + '</span>' +
        '<span class="recipe-card-indian">🇮🇳 Indian</span>' +
      '</div>' +
      '<div class="recipe-card-body">' +
        '<h3 class="recipe-card-title">' + esc(dish.name) + '</h3>' +
        '<p class="recipe-card-area">🏷️ ' + esc(dish.tags.slice(0,2).join(' · ')) + '</p>' +
        '<button class="btn-view" data-id="' + esc(dish.id) + '">View Recipe →</button>' +
      '</div>';
    grid.appendChild(card);
  });

  qsa('.btn-view').forEach(function(btn) {
    btn.addEventListener('click', function() { openModal(this.dataset.id); });
  });
}

/* =========================================================
   MODAL
   ========================================================= */
function openModal(id) {
  var dish = null;
  for (var i=0; i<DB.length; i++) {
    if (DB[i].id === id) { dish = DB[i]; break; }
  }
  if (!dish) return;

  byId('modal-img').src              = dish.img;
  byId('modal-img').alt              = dish.name;
  byId('modal-title').textContent    = dish.name;
  byId('modal-category').textContent = dish.cat;

  /* Meta tags */
  var meta = byId('modal-meta');
  meta.innerHTML = '';
  dish.tags.forEach(function(t) {
    var s = document.createElement('span');
    s.className   = 'meta-tag';
    s.textContent = t;
    meta.appendChild(s);
  });

  /* Ingredients */
  var ingGrid = byId('modal-ingredients');
  ingGrid.innerHTML = '';
  dish.ingredients.forEach(function(ing) {
    var d = document.createElement('div');
    d.className   = 'ingredient-item';
    d.textContent = ing;
    ingGrid.appendChild(d);
  });

  /* Steps */
  var stepList = byId('modal-steps');
  stepList.innerHTML = '';
  dish.steps.forEach(function(step, i) {
    var li = document.createElement('li');
    li.className = 'step-item';
    li.innerHTML = '<div class="step-num">'+(i+1)+'</div><p class="step-text">'+esc(step)+'</p>';
    stepList.appendChild(li);
  });

  /* YouTube button */
  var videoSec  = byId('video-section');
  var videoWrap = byId('modal-video-wrap');
  var ytUrl     = 'https://www.youtube.com/results?search_query=' + dish.yt;
  videoWrap.innerHTML =
    '<a class="yt-btn" href="' + ytUrl + '" target="_blank" rel="noopener">' +
      '<span class="yt-play">▶</span>' +
      '<span>Watch ' + esc(dish.name) + ' Recipe on YouTube</span>' +
    '</a>';
  if (videoSec) videoSec.style.display = 'block';

  byId('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  var overlay = byId('modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* =========================================================
   FAQ ACCORDION
   ========================================================= */
function initFAQ() {
  qsa('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item   = this.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      qsa('.faq-item.open').forEach(function(x) { x.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* =========================================================
   BOOT
   ========================================================= */
document.addEventListener('DOMContentLoaded', function() {

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  var page = whichPage();
  console.log('Page detected:', page);

  if      (page === 'register') initRegisterPage();
  else if (page === 'home')     initHomePage();
  else                          initLoginPage();
});

window.closeModal = closeModal;
