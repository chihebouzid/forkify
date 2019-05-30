import { element } from './base'

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined'
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
    element.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLike = recipe => {
    const markup = `
        <li>
            <a class="likes__link" href="#${recipe.id}">
                <figure class="likes__fig">
                     <img src="${recipe.img}" alt="${recipe.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${recipe.title}</h4>
                    <p class="likes__author">${recipe.author}</p>
                </div>
            </a>
        </li>
    `
    element.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}