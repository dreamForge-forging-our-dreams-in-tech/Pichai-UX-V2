console.log('Hello There.');

import './button/simpleButton.js';

import './github/githubIssues.js';
import './github/githubRepos.js';
import './github/githubLogin.js';

import './cardviews/storeCardview.js';

import './navigation/navigation_rail.js';

//im very lazy so im just gonna add the tag name as a class to every element in the document
//This will basically apply the css class stylings automatically to the right elements without having to add the class manually.
//To make this work every elements has to have its own CSS class e.g. simple-button becomes .simple-button in the CSS file and so on.
//This is a future for Pichai UX anyways (each element having their own CSS class that developers can access and use regardless of element type)

window.onload = function() {
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        console.log(element.tagName.toLowerCase());
        element.classList.add(element.tagName.toLowerCase());
    });
}