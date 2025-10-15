const favContainer = document.getElementById('favorites');
const favs = JSON.parse(localStorage.getItem('favorites')) || [];

async function loadFavorites() {
  if (favs.length === 0) {
    favContainer.innerHTML = '<p>Ei suosikkeja vielä.</p>';
    return;
  }

  for (let id of favs) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    const meal = data.meals[0];

    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
      <div class="card shadow-sm h-100">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
          <button class="btn btn-outline-danger" onclick="removeFavorite('${id}')">Poista</button>
        </div>
      </div>`;
    favContainer.appendChild(col);
  }
}

function removeFavorite(id) {
  const updated = favs.filter(f => f !== id);
  localStorage.setItem('favorites', JSON.stringify(updated));
  location.reload();
}

loadFavorites();
