import { element } from './base'


export const getInput = () => element.searchInput.value;


export const clearInput = () => {
    element.searchInput.value = '';
}


export const clearResults = () => {
    element.searchResList.innerHTML = '';
    element.resultsPages.innerHTML = '';
}


export const highlightResults = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'))
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');

}


const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, curr) => {
            if (acc + curr.length < limit) {
                newTitle.push(curr);
            }
            return acc + curr.length
        }, 0);

        return `${newTitle.join(' ')} ...`
    }
    return title;


}



export const renderRecipe = recipe => {
    const markup = ` <li>
                        <a class="results__link " href="#${recipe.recipe_id}">
                            <figure class="results__fig">
                                <img src="${recipe.image_url}" alt="${recipe.title}">
                            </figure>
                            <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                            </div>
                         </a>
                    </li>`;

    element.searchResList.insertAdjacentHTML('beforeend', markup);

}




const creatButton = (page, type) => `

                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                    <span>Page ${ type === 'prev' ? page - 1 : page + 1}</span>    
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${ type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>

`;




const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        //render the next page button
        button = creatButton(page, 'next')
    } else if (page < pages) {
        //render the next and the previous buttons
        button = `
        ${creatButton(page, 'next')}
        ${creatButton(page, 'prev')}
        `
    } else if (page === pages) {
        //render the prev button 
        button = creatButton(page, 'prev')
    }
    element.resultsPages.insertAdjacentHTML('afterbegin', button);

};


export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //prepa the pages
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    //render the button for every page
    renderButtons(page, recipes.length, resPerPage);

}