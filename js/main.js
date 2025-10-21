const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (!query) return alert('Kirjoita hakusana!');

  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const data = await res.json();

  resultsDiv.innerHTML = '';

  if (!data.meals) {
    resultsDiv.innerHTML = '<p>Reseptejä ei löytynyt.</p>';
    return;
  }

  data.meals.forEach(meal => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
   col.innerHTML = `
   <div class="card shadow-sm h-100">
    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
     <div class="card-body">
       <h5 class="card-title">${meal.strMeal}</h5>
       <p>
        <button class="btn-primary" onclick="showRecipe('${meal.idMeal}')">Näytä</button>
        <button class="btn-primary" onclick="saveFavorite('${meal.idMeal}')">❤️</button>
      </p>
    </div>
  </div>
 `;
    resultsDiv.appendChild(col);
  });
});

async function showRecipe(id) {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();

  if (!data.meals) {
    alert("Reseptiä ei löytynyt!");
    return;
  }

  const meal = data.meals[0];
  console.log(meal); 

  document.getElementById('recipeModalLabel').textContent = meal.strMeal;
  document.getElementById('recipeImg').src = meal.strMealThumb;

  const ingredientsList = document.getElementById('recipeIngredients');
  ingredientsList.innerHTML = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      const li = document.createElement('li');
      li.textContent = `${ingredient} – ${measure}`;
      ingredientsList.appendChild(li);
    }
  }

  document.getElementById('recipeInstructions').textContent = meal.strInstructions;

  const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
  recipeModal.show();
}

function saveFavorite(id) {
  let favs = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favs.includes(id)) {
    favs.push(id);
    localStorage.setItem('favorites', JSON.stringify(favs));
    alert('Lisätty suosikkeihin!');
  } else {
    alert('On jo suosikeissa.');
  }
}
