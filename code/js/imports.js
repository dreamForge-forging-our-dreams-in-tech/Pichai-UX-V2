console.log('Hello There.');

import './overwrites/custom_elements.js';

import './elements/button/simpleButton.js';

import { GithubIntergration } from './Github Intergration/GithubIntergration.js';
import './Github Intergration/Elements/githubIssues.js';
import './Github Intergration/Elements/githubRepos.js';
import './Github Intergration/Elements/githubLogin.js';

import './elements/cardviews/storeCardview.js';

import './elements/navigation/navigation_rail.js';


//make a startup call to the render service once the site has loaded
let github_intergration = new GithubIntergration();

github_intergration.initializeRenderService().then((result) => {
    console.log(result);
});