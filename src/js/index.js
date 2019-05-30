import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { element, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';




//Global state of the app 
const state = {}
window.state = state;

//********** Search controller **************//
const controlSearch = async () => {
    // get query from view 
    const query = searchView.getInput();

    if (query) {
        //new search object and add to state
        state.search = new Search(query);

        //prepa UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(element.searchResults);


        try {
            //search for recipes
            await state.search.getResults();

            //Render results on UI
            clearLoader();
            searchView.renderResults(state.search.results);
        } catch (error) {
            alert('something went wrong with the search');
            clearLoader();
        }

    }
}




element.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})


element.resultsPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const pageToGoTo = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.results, pageToGoTo);
    }

})


//********** Recipe controller **************//
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //prepa UI for changes 
        renderLoader(element.recipePage);
        recipeView.clearResults();

        //highlighr selected results 
        if (state.search) searchView.highlightResults(id);


        //Create new recipe object 
        state.recipe = new Recipe(id)
        window.recipe = state.recipe;

        try {
            //Get recipe data and parse ingredient
            await state.recipe.getRecipe(); //we use await because the getRecipe function returns a promise
            state.recipe.parseIngredients();
            // calculte servings and cooking time 
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe 
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));


        } catch (error) {
            console.log(error)
            alert('cant get recipe');
        }



    }
}



//********** Shopping list controller **************//
const controlList = () => {
    //create new list if there is no list already 
    if (!state.list) state.list = new List();

    //add ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listView.renderList(item);
    });
}

// handle delete and update list items 
element.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {

        //delete from state
        state.list.deleteItem(id);

        //delete from UI 
        listView.deleteItem(id);

        //handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val)
    }
});






//********** Like controller **************//

//TESTING 
state.likes = new Likes();
likeView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentId = state.recipe.id;

    if (!state.likes.isLiked(currentId)) {
        //add like to the state
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.img);
        //toggle the like button
        likeView.toggleLikeBtn(true);
        //add like to UI list
        console.log(state.likes);
    } else {
        //remove like from the state 
        state.likes.deleteLike(currentId);

        //toggle the like button 
        likeView.toggleLikeBtn(false);
        //remove like from ui list 
        console.log(state.likes);
    }
    likeView.toggleLikeMenu(state.likes.getNumLikes());


}







['hashchange', 'load'].forEach(event => { window.addEventListener(event, controlRecipe) });

//handeling recipe btn clicks 
element.recipePage.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease servings
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
        }


    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //increase servings 
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
        //add ingredients to shopping list 
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
        //handle the likes
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }

})
