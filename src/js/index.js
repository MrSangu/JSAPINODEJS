import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {DOME,loaderIcon,clearLoader} from './views/base';
import * as SearchView from './views/SearchView';
import * as RecipeView from './views/RecipeView';
import * as ListView from './views/ListView';
import * as LikesView from './views/LikesView';

/*Global State Of the App
1. Search Object
2. Current Recepie Object
3. Shopping List Object
4. Liked Recepies
*/const state={};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Search Controller
const ctrlSearch =async ()=> {

  //1. Get Query From Instance
  const query= SearchView.getInput();

  //2. New Search Object And Add To State
  if(query)
  {
    state.search= new Search(query);
  }
  //3. Prepare UI For Recepies
    SearchView.clearInputs();
    SearchView.clearResults();
    loaderIcon(DOME.parentResult);
try
{
//4. Search For Recepies
  await state.search.getResults();
//5. Display Results On The UI
  clearLoader();
  SearchView.searchViewAll(state.search.result);
  SearchView.removeHighligh();
}
catch (e)
{
  console.log(`Cannot Process Results${e}`);
  clearLoader();
}


};

DOME.searchForm.addEventListener('submit',e=>{
  e.preventDefault();
  ctrlSearch();
});

DOME.resPages.addEventListener('click',el=>{
  const btn= el.target.closest('.btn-inline');
  if(btn){
    const pageGoTo=parseInt(btn.dataset.goto,10);
    SearchView.clearResults();
    SearchView.searchViewAll(state.search.result,pageGoTo);
  }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Recipe Controller

  const ctrlRecipe=async ()=>{
    //Get ID from url
    const id= window.location.hash.replace('#','');
    if (id) {
      //Prepare UI
      RecipeView.clearRecipeResults();
      loaderIcon(DOME.viewRecipe);

      if(state.search) SearchView.highLightSearch(id);

      //Create new recipe object
      state.recipe= new Recipe(id);
      try
      {
        //Get recipe data
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        // Calculate Preparation Time and Servings
        state.recipe.calPrepareTime();
        state.recipe.numOfServings();

        clearLoader();
        // Display Data
        RecipeView.renderRecipe(state.recipe,state.likes.isLiked(id));

      }
      catch (e)
      {
        alert(e);
      }

    }
  };
 // window.addEventListener('hashchange',ctrlRecipe);
 // window.addEventListener('load',ctrlRecipe);
['hashchange','load'].forEach(event=>window.addEventListener(event,ctrlRecipe));



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//List Controller
const ctrlList=()=>{
  if(!state.list)
  {
    state.list=new List();
  }

    state.recipe.ingredients.forEach(el=>{
      const item= state.list.addShoppingItem(el.count,el.unit,el.ingredient);
      ListView.shoppingView(item);
    });

};

//List Event handlers
DOME.shoppingView.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteShoppingItem(id);

        // Delete from UI
        ListView.deleteItem(id);
    // Handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//testing

//like controller
const ctrlLike=()=>{
  if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        LikesView.toggleLike(true);
        // Add like to UI list
        LikesView.renderLikesList(newLike);
      }
      else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        LikesView.toggleLike(false);
        // Remove like from UI list
        LikesView.deleteLikesItem(currentID)
    }
    LikesView.toggleLikeIcon(state.likes.getNumLikes());
  };

// Restore liked recipes on page load
  window.addEventListener('load',()=>{
    state.likes = new Likes();
    state.likes.readStorage();
    LikesView.toggleLikeIcon(state.likes.getNumLikes());
    state.likes.likes.forEach(like=> LikesView.renderLikesList(like))
  });


  //Recipe Button Clicks
  DOME.viewRecipe.addEventListener('click', button=>{
  if (button.target.matches('.btn-dec, .btn-dec *'))
  {
    state.recipe.servingButtons('dec');
    RecipeView.updatedServAndIng(state.recipe);
  }
  else if(button.target.matches('.btn-inc, .btn-inc *'))
  {
    state.recipe.servingButtons('inc');
    RecipeView.updatedServAndIng(state.recipe);
  }
  else if (button.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    ctrlList();
  }
  else if (button.target.matches('.recipe__love, .recipe__love *')) {
    ctrlLike();
  }
  });
