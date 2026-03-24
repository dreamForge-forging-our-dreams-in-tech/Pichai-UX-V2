console.log('Hello There.');

import './overwrites/custom_elements.js';

import './button/simpleButton.js';

import { GithubIntergration } from './Github Intergration/functions.js';
import './Github Intergration/Elements/githubIssues.js';
import './Github Intergration/Elements/githubRepos.js';
import './Github Intergration/Elements/githubLogin.js';

import './cardviews/storeCardview.js';

import './navigation/navigation_rail.js';

let github_intergration = new GithubIntergration();

github_intergration.initializeRenderService().then((result) => {
    console.log(result);
});