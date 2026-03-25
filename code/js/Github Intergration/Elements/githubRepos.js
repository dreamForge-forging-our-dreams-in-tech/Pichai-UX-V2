import { GithubIntergration } from "../functions.js";
let github_intergration = new GithubIntergration();

// Create a class for the element
class GithubRepos extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        let repos = github_intergration.listReposWithLogos(this.getAttribute('orgName'));

        repos.then(reposJSON => {
            for (const repoName in reposJSON) {
                const repo = reposJSON[repoName];

                let tile = document.createElement('store-tile');
                tile.setAttribute('name', repo.name);
                tile.setAttribute('price', 'Free, Subscription or Donations');
                tile.setAttribute('release', repo.created_at);
                tile.setAttribute('shortDescription', repo.description || 'No description available.');
                tile.setAttribute('imageSrc', 'https://opengraph.githubassets.com/random-token/' + repo.full_name);
                tile.setAttribute('storeUrl', repo.html_url);

                this.appendChild(tile);
            }
        });
    }
}

customElements.define("github-repositories", GithubRepos);