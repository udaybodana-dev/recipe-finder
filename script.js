const input = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const grid = document.getElementById('results-grid')
const homeBtn = document.getElementById('home-btn')
const modal = document.getElementById('recipe-modal')
const modalContent = document.getElementById('modal-content')
const closeModal = document.getElementById('close-modal')
const savedLink = document.getElementById('view-saved')

const SPOONACULAR_API_KEY = '62491d92c7814883ac5fc2fe8dcff501'

let savedRecipes = JSON.parse(localStorage.getItem('saved_dishes')) || []
let searchCache = []

const localIndianRecipes = [
  {
    idMeal: 'local_1',
    strMeal: 'Paneer Tikka',
    strMealThumb: 'assets/paneer_tikka.png',
    strCategory: 'Vegetarian',
    strArea: 'Indian',
    strInstructions:
      '1. Cut paneer, onions, and bell peppers into cubes.\n2. Marinate them with yogurt, ginger-garlic paste, tikka masala, red chili powder, and lemon juice for 30 minutes.\n3. Skewer the paneer and vegetables alternately.\n4. Grill in an oven, pan, or tandoor at 200°C for 15-20 minutes until edges are charred.\n5. Serve hot with mint chutney and lemon wedges.',
    ingredients: [
      '250g Paneer',
      '1/2 cup Yogurt',
      '1 large Bell Pepper',
      '1 large Onion',
      '2 tbsp Tikka Masala',
      '1 tbsp Lemon Juice',
      '1 tbsp Ginger Garlic Paste'
    ]
  },
  {
    idMeal: 'local_2',
    strMeal: 'Butter Chicken',
    strMealThumb: 'assets/butter_chicken.png',
    strCategory: 'Chicken',
    strArea: 'Indian',
    strInstructions:
      '1. Marinate chicken with yogurt, spices, ginger, and garlic, then bake or grill until cooked.\n2. In a pan, melt butter and sauté onions, ginger, and garlic.\n3. Add tomato puree, cashew paste, chili powder, and garam masala. Simmer into a smooth gravy.\n4. Stir in heavy cream and add the grilled chicken pieces.\n5. Cook on low heat for 10 minutes, garnish with kasuri methi and cream.',
    ingredients: [
      '500g Chicken',
      '50g Butter',
      '1 cup Tomato Puree',
      '1/2 cup Heavy Cream',
      '3 tbsp Yogurt',
      '2 tbsp Cashews Paste',
      '1 tsp Garam Masala'
    ]
  },
  {
    idMeal: 'local_3',
    strMeal: 'Samosa',
    strMealThumb: 'assets/samosa.png',
    strCategory: 'Snack',
    strArea: 'Indian',
    strInstructions:
      '1. Boil and mash potatoes, then sauté with green peas, cumin, coriander powder, garam masala, and green chilies.\n2. Prepare a dough using all-purpose flour (maida), carom seeds (ajwain), ghee, and water.\n3. Roll out the dough, cut into halves, and shape into cones.\n4. Fill the cones with the spiced potato mixture and seal the edges with water.\n5. Deep fry on medium-low heat until golden brown and crispy. Serve with tamarind and green chutney.',
    ingredients: [
      '3 boiled Potatoes',
      '2 cups All-purpose Flour',
      '1/4 cup Green Peas',
      '3 tbsp Ghee',
      '1 tsp Garam Masala',
      '1/2 tsp Carom Seeds'
    ]
  },
  {
    idMeal: 'local_4',
    strMeal: 'Masala Dosa',
    strMealThumb: 'assets/masala_dosa.png',
    strCategory: 'Vegetarian',
    strArea: 'Indian',
    strInstructions:
      '1. Soak rice and urad dal, grind to a smooth batter, and ferment overnight.\n2. Prepare potato bhaji by tempering boiled potatoes with mustard seeds, curry leaves, turmeric, onions, and green chilies.\n3. Heat a non-stick tawa, spread a ladleful of batter in a thin circular motion to make a crepe.\n4. Drizzle butter or oil around the edges and cook until golden brown and crispy.\n5. Place a portion of potato bhaji in the center, fold, and serve hot with coconut chutney and sambar.',
    ingredients: [
      '2 cups Rice Batter',
      '3 boiled Potatoes',
      '1 tsp Mustard Seeds',
      '8-10 Curry Leaves',
      '1 medium Onion',
      '1/2 tsp Turmeric Powder'
    ]
  },
  {
    idMeal: 'local_5',
    strMeal: 'Poha',
    strMealThumb: 'assets/poha.png',
    strCategory: 'Breakfast',
    strArea: 'Indian',
    strInstructions:
      '1. Rinse flattened rice (poha) in a colander under running water until soft, then drain and set aside with a pinch of turmeric and salt.\n2. Heat oil in a pan. Sauté peanuts until crunchy, then remove and set aside.\n3. In the same oil, add mustard seeds, green chilies, curry leaves, and chopped onions. Sauté until onions are translucent.\n4. Add roasted peanuts and the soft poha. Mix gently.\n5. Cover and steam on low heat for 2 minutes.\n6. Garnish with coriander leaves, grated coconut, and lemon juice. Serve hot!',
    ingredients: [
      '2 cups Flattened Rice (Poha)',
      '1 medium Onion (chopped)',
      '1/4 cup Peanuts',
      '1 tsp Mustard Seeds',
      '2 Green Chilies',
      '8-10 Curry Leaves',
      '1/2 tsp Turmeric Powder',
      'Lemon juice'
    ]
  },
  {
    idMeal: 'local_6',
    strMeal: 'Jalebi',
    strMealThumb: 'assets/jalebi.png',
    strCategory: 'Dessert',
    strArea: 'Indian',
    strInstructions:
      '1. Mix all-purpose flour (maida), chickpea flour (besan), baking powder, and yogurt. Let it ferment for 12 hours.\n2. Prepare sugar syrup by boiling sugar and water with cardamom powder and saffron strands until 1-string consistency.\n3. Pour the batter into a squeeze bottle or piping bag with a small nozzle.\n4. Heat ghee or oil in a flat pan. Squeeze the batter in circular spiral shapes directly into the hot oil.\n5. Fry on medium heat until crispy and golden yellow.\n6. Drain and immediately soak the fried jalebis in the warm sugar syrup for 2-3 minutes. Serve hot!',
    ingredients: [
      '1 cup All-purpose Flour',
      '1/2 cup Water',
      '1/2 tsp Cardamom Powder',
      'A pinch of Saffron',
      'Ghee for frying'
    ]
  }
]

function updateSavedCount () {
  const countEl = document.getElementById('saved-count')
  if (countEl) countEl.textContent = savedRecipes.length
}

function showToast (msg, color = '#10b981') {
  const toast = document.createElement('div')
  toast.innerText = msg
  toast.className = 'toast-msg'
  if (color !== '#10b981') toast.style.background = color

  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.opacity = '0'
    setTimeout(() => toast.remove(), 500)
  }, 2500)
}

async function search (query) {
  if (!query) {
    showToast('Enter a dish name!', '#ef4444')
    return
  }
  grid.innerHTML = "<p class='grid-msg'>Searching recipes...</p>"

  let results = []

  const localMatches = localIndianRecipes.filter(
    r =>
      r.strMeal.toLowerCase().includes(query.toLowerCase()) ||
      r.strCategory.toLowerCase().includes(query.toLowerCase())
  )
  if (localMatches.length > 0) {
    results = [...localMatches]
  }

  if (SPOONACULAR_API_KEY && SPOONACULAR_API_KEY !== 'YOUR_API_KEY_HERE') {
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${SPOONACULAR_API_KEY}&number=10`
      )
      if (res.ok) {
        const data = await res.json()
        if (data.results && data.results.length > 0) {
          const spoonMeals = data.results.map(r => ({
            idMeal: `spoon_${r.id}`,
            strMeal: r.title,
            strMealThumb: r.image
          }))
          results = [...results, ...spoonMeals]
        }
      }
    } catch (e) {
      console.warn('Spoonacular fetch failed, moving to fallback:', e)
    }
  }

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    )
    const data = await res.json()
    if (data.meals) {
      const existingNames = new Set(results.map(r => r.strMeal.toLowerCase()))
      const filteredMeals = data.meals.filter(
        m => !existingNames.has(m.strMeal.toLowerCase())
      )
      results = [...results, ...filteredMeals]
    }
  } catch (e) {
    console.error('TheMealDB fetch failed:', e)
  }

  searchCache = results
  render(searchCache)
}

function render (meals) {
  grid.innerHTML = ''
  if (!meals || meals.length === 0) {
    grid.innerHTML =
      "<p class='grid-msg'>Dish not found. Try searching 'Pizza', 'Paneer', 'Samosa', or 'Burger'.</p>"
    return
  }

  meals.forEach(m => {
    const card = document.createElement('div')
    card.className = 'recipe-card'
    card.innerHTML = `<img src="${m.strMealThumb}" alt="${m.strMeal}"><h3>${m.strMeal}</h3>`
    card.onclick = () => openDetails(m.idMeal)
    grid.appendChild(card)
  })
}

async function openDetails (id) {
  try {
    let meal = null
    let ings = []

    if (id.startsWith('local_')) {
      meal = localIndianRecipes.find(r => r.idMeal === id)
      ings = meal.ingredients
    } else if (id.startsWith('spoon_')) {
      const cleanId = id.replace('spoon_', '')
      grid.innerHTML =
        "<p class='grid-msg'>Loading details from Spoonacular...</p>"
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${cleanId}/information?apiKey=${SPOONACULAR_API_KEY}`
      )
      const mealData = await res.json()
      meal = {
        idMeal: id,
        strMeal: mealData.title,
        strMealThumb: mealData.image,
        strCategory: mealData.dishTypes
          ? mealData.dishTypes.join(', ')
          : 'General',
        strArea: mealData.cuisines ? mealData.cuisines.join(', ') : 'Global',
        strInstructions: mealData.instructions
          ? mealData.instructions.replace(/<[^>]*>/g, '')
          : 'Enjoy your meal!'
      }
      ings = mealData.extendedIngredients
        ? mealData.extendedIngredients.map(i => i.original)
        : []
    } else {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      )
      const data = await res.json()
      const dbMeal = data.meals[0]
      meal = dbMeal
      for (let i = 1; i <= 20; i++) {
        const item = dbMeal[`strIngredient${i}`]
        if (item && item.trim()) {
          ings.push(`${dbMeal[`strMeasure${i}`] || ''} ${item}`.trim())
        } else {
          break
        }
      }
    }

    const isSaved = savedRecipes.some(r => r.idMeal === meal.idMeal)

    modalContent.innerHTML = `
            <h2 class="modal-dish-title">${meal.strMeal}</h2>
            <img class="modal-dish-img" src="${meal.strMealThumb}">
            <p><strong>Category:</strong> ${
              meal.strCategory
            } | <strong>Area:</strong> ${meal.strArea}</p>
            <h4 class="modal-sub-title">Ingredients:</h4>
            <ul class="ing-list">${ings.map(i => `<li>${i}</li>`).join('')}</ul>
            <h4 class="modal-sub-title">Steps:</h4>
            <p class="modal-steps-text">${meal.strInstructions}</p>
            <button id="save-recipe-btn" class="save-btn ${
              isSaved ? 'saved' : ''
            }">
                ${isSaved ? '✓ Saved in Book' : '❤ Save Recipe'}
            </button>
        `

    document.getElementById('save-recipe-btn').onclick = () => toggleSave(meal)
    modal.classList.remove('hidden')
  } catch (e) {
    showToast("Can't load details", '#ef4444')
    console.error(e)
  }
}

function toggleSave (meal) {
  const idx = savedRecipes.findIndex(r => r.idMeal === meal.idMeal)
  const btn = document.getElementById('save-recipe-btn')

  if (idx === -1) {
    savedRecipes.push(meal)
    btn.innerText = '✓ Saved in Book'
    btn.classList.add('saved')
    showToast('Recipe Saved! ❤')
  } else {
    savedRecipes.splice(idx, 1)
    btn.innerText = '❤ Save Recipe'
    btn.classList.remove('saved')
    showToast('Removed from Book', '#64748b')
  }

  localStorage.setItem('saved_dishes', JSON.stringify(savedRecipes))
  updateSavedCount()
}

searchBtn.onclick = () => search(input.value)

if (homeBtn) {
  homeBtn.onclick = e => {
    e.preventDefault()
    input.value = ''
    fetchInitialIndian()
  }
}

input.onkeypress = e => {
  if (e.key === 'Enter') search(input.value)
}

savedLink.onclick = e => {
  e.preventDefault()
  render(savedRecipes)
}

closeModal.onclick = () => modal.classList.add('hidden')
window.onclick = e => {
  if (e.target === modal) modal.classList.add('hidden')
}

async function fetchInitialIndian () {
  grid.innerHTML = "<p class='grid-msg'>Cooking up Ghar Ka Khana...</p>"
  try {
    const res = await fetch(
      'https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian'
    )
    let data = await res.json()

    const vegIds = ['52785', '52807', '52868', '52865']
    const nonVegIds = ['52806', '52795']
    const orderedIds = [...vegIds, ...nonVegIds]

    let meals = []

    if (data.meals) {
      const filtered = data.meals.filter(m => orderedIds.includes(m.idMeal))
      filtered.sort(
        (a, b) => orderedIds.indexOf(a.idMeal) - orderedIds.indexOf(b.idMeal)
      )
      meals = filtered
    }

    meals = [...localIndianRecipes, ...meals]

    render(meals)
  } catch (e) {
    render(localIndianRecipes)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateSavedCount()
  fetchInitialIndian()
})
