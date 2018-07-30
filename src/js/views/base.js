export const DOME= {
  searchForm:document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  viewResultList: document.querySelector('.results__list'),
  parentResult: document.querySelector('.results'),
  resPages: document.querySelector('.results__pages'),
  viewRecipe: document.querySelector('.recipe'),
  shoppingView: document.querySelector('.shopping__list'),
  likesMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list')

}

export const elementStrings={
  loader:'loader'
};

export const loaderIcon= parent => {
const loader =`<div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
 parent.insertAdjacentHTML('afterbegin',loader);
  };

  export const clearLoader=()=>{
    const loader=document.querySelector(`.${elementStrings.loader}`);
    if(loader) loader.parentElement.removeChild(loader);
  }
