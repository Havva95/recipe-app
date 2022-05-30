const API = "https://www.themealdb.com/api/json/v1/1/";
const searchField = document.querySelector(".searchField");
const recipeList = document.querySelector(".recipeList");
const appModal = document.querySelector(".appModal");
const modalClose = document.querySelector(".modalClose");
const mealTitle = document.querySelector(".mealTitle");
const mealPic = document.querySelector(".mealPic");
const mealIngredients = document.querySelector(".mealIngredients");
const mealInstructions = document.querySelector(".mealInstructions");

function handleSearch(e){
    e.preventDefault();
    let query = e.target.recipeSearch.value;
    let recipesUrl = `${API}search.php?s=${query}`;
    fetchData(recipesUrl).then(function(data){
        let results = createResultsHtml(data.meals)
        console.log(results);
        recipeList.innerHTML = results;
    })
    
}

async function fetchData(url){
    let response = await fetch(url);
    let data = await response.json();
    console.log(data.meals);
    return data;
}

function createResultsHtml(data){
    let myhtml;
    if(data === null){
        myhtml = `<h3 class="searchError">No results! Try a different search</h3>`
    }else{
        myhtml = data.map(function(meal){
            return ` <div class="recipeItem" data-id=${meal.idMeal}>
            <div class="recipePic">
              <img
                src=${meal.strMealThumb}
                alt=""
              />
            </div>
            <h2>${meal.strMeal}</h2>
            <h4>${meal.strCategory}</h4>
          </div> `
        }).join("")
    }
    return myhtml;
}


//Implement search functions
searchField.addEventListener("submit", handleSearch);


document.addEventListener("click", handleSearchInfo);

function handleSearchInfo(e){
    
    if(e.target.parentElement.classList.contains("recipeItem")){
        let id = e.target.parentElement.dataset.id;
        let mealUrl = `${API}lookup.php?i=${id}`
        fetchData(mealUrl).then(function(data){
            
            let recipe = data.meals[0];
            appModal.classList.add("active");
            document.body.style.overflow = "hidden";
            mealTitle.innerHTML = `<h2>${recipe.strMeal}</h2> <h4>${recipe.strCategory}</h4>`
            mealPic.innerHTML = `<img src=${recipe.strMealThumb} />`
            mealInstructions.innerText = recipe.strInstructions
            createIngredientList(recipe);
            
        })

    }
}

function createIngredientList(recipe){
    let list= "";
    for(let i = 1; i<=20; i++){
        if(recipe["strIngredient" + i] === "" || recipe["strMeasure" + i] ===null){
            break;
        }
        list += `<li> ${recipe["strIngredient" + i]} - ${recipe["strMeasure" + i]} </li>`
    }
    mealIngredients.innerHTML = `<ul> ${list}</ul>`
}


modalClose.addEventListener("click", function(){
    appModal.classList.remove("active");
    document.body.style.overflow = "auto";
})

