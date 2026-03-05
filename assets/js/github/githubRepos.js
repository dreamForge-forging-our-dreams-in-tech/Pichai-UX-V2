// Create a class for the element
class GithubRepos extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        let repos = listReposWithLogos(this.getAttribute('orgName'));

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

async function listReposWithLogos(orgName, container) { // retrieves a lists of all github repos for a org and displays them in the provided container.
        const url = `https://api.github.com/orgs/${orgName}/repos?per_page=100`;

        try {
            const response = await fetch(url);
            const repos = await response.json();

            let reposJSON = {};

            repos.forEach(repo => {
                reposJSON[repo.name] = repo;
            });

            return reposJSON;

        } catch (error) {
            console.error("Error:", error);
        }
    }