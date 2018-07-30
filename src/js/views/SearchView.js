import {DOME} from './base';
export const getInput=()=> DOME.searchInput.value;
export const clearInputs=()=> DOME.searchInput.value="";
export const clearResults=()=>{
  DOME.resPages.innerHTML="";
  DOME.viewResultList.innerHTML="";
}

export const titleSort=(title,limit=17)=>{
  const newTitle=[];
  if (title.length>limit) {
    title.split(' ').reduce((acc,cur)=>{
      if(acc+cur.length<=limit)
      {
        newTitle.push(cur);
      }
      return acc + cur.length;
    },0);
    return `${newTitle.join(' ')}...`;
  }
return title;
};

export const removeHighligh=()=>{
  const rArray= Array.from(document.querySelectorAll('.results__link'));
  rArray.forEach(el=>{el.classList.remove('results__link--active');});
}

export const highLightSearch=id=>{
const rArray= Array.from(document.querySelectorAll('.results__link'));
rArray.forEach(el=>{el.classList.remove('results__link--active');});
document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');//('result__link--active') is a CCS element
};


export const searchViewOne= (recipe)=>{
  const markup=`<li>
      <a class="results__link results__link--active" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${titleSort(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
  </li>`;
  DOME.viewResultList.insertAdjacentHTML('beforeend',markup);
}

const createButton=(page, type)=>
`<button class="btn-inline results__btn--${type}" data-goto=${type==='prev'? page-1: page+1}>
<span>Page ${type==='prev'? page-1: page+1 }</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type==='prev' ? 'left' : 'right'}"></use>
    </svg>

</button>`;



const buttonLoader=(page,resPerPage,numOfResults)=>{
  const pages= Math.ceil(numOfResults/resPerPage);
  let button;
  if(page===1 && pages>1)
  {
    //Display Next button on right
    button=createButton(page,'next');
  }
  else if(page<pages)
  {
    //Display Both The Buttons prev and next
    button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
  }
  else if(page===pages&& pages>1)
  {
    //Display prev Button on left
    button=createButton(page,'prev');
  }
  DOME.resPages.insertAdjacentHTML('afterbegin',button);
};


export const searchViewAll=(recipes, page=1, resPerPage=10)=> {
  const start= (page-1)*10;
  const end= resPerPage*page;
  recipes.slice(start,end).forEach(searchViewOne);
  buttonLoader(page,resPerPage,recipes.length);

}
