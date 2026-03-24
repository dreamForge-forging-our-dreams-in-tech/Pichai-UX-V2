import { GithubIntergration } from "../functions.js";
let github_intergration = new GithubIntergration();

// Create a class for the element
class githubIssues extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        this.reloadIssues();
    }

    pageChanged(index, item) {
        this.setAttribute('repoUrl', '')
    }

    reloadIssues(labels = 'All') {
        //check if the service is active and only load issues if its able to talk to the service
        this.innerHTML = 'Loading Github issues...'
        github_intergration.initializeRenderService().then((result) => {
            let issues = github_intergration.loadGitHubIssues(this.getAttribute('repoUrl'));

            issues.then(issuesJSON => {
                for (const issueNumber in issuesJSON) {
                    const issue = issuesJSON[issueNumber];

                    let tile = document.createElement('store-tile');
                    tile.setAttribute('name', issue.title);
                    tile.setAttribute('price', 'Free, Subscription or Donations');
                    tile.setAttribute('release', issue.created_at);
                    tile.setAttribute('shortDescription', issue.body || 'No description available.');
                    tile.setAttribute('imageSrc', 'https://opengraph.githubassets.com/random-token/' + issue.repository_url.split('/').slice(-2).join('/') + '/issues/' + issue.number);
                    tile.setAttribute('storeUrl', issue.html_url);

                    this.appendChild(tile);
                }
            });
        });
    }
}

customElements.define("github-issues", githubIssues);