import { GithubIntergration } from "../GithubIntergration.js";
let github_intergration = new GithubIntergration();

// Create a class for the element
class githubIssues extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
    }

    add_controls() {
        this.id = this.id || 'github-issues-' + Math.floor(Math.random() * 10000); // generate random id if no id is set, to allow multiple instances of the element on the same page

        let labels = document.createElement('github-labels');

        labels.classList.add('hideScrollbar');

        labels.style.zIndex = '999';
        labels.style.bottom = '8px';
        labels.style.left = '8px';
        labels.style.position = 'fixed';

        labels.style.margin = '0px';
        labels.style.flex = '1';

        labels.setAttribute('for', this.id);

        customElements.whenDefined('github-labels').then(() => {
            if (typeof labels.add_label === 'function') {
                labels.add_label('All');
            } else {
                console.error("add_label is still not defined on github-labels");
            }
        });

        this.appendChild(labels);
    }

    connectedCallback() {
        this.add_controls();
        this.reloadIssues();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.reloadIssues();
    }

    pageChanged(item, index) {
        item = item.getAttribute('href'); // get the name of the label that was clicked on
        if (item == 'All') {
            this.setAttribute('repoUrl', 'https://api.github.com/repos/dreamForge-forging-our-dreams-in-tech/The-Magic-Garden/issues?state=all&per_page=100');
        } else {
            this.setAttribute('repoUrl', 'https://api.github.com/repos/dreamForge-forging-our-dreams-in-tech/The-Magic-Garden/issues?state=all&per_page=100&labels=' + item);
        }
        this.reloadIssues();
    }

    addTile(title, price, release, shortDescription, imageSrc, storeUrl) {
        let tile = document.createElement('store-tile');
        tile.setAttribute('name', title);
        tile.setAttribute('price', price);
        tile.setAttribute('release', release);
        tile.setAttribute('shortDescription', shortDescription);
        tile.setAttribute('imageSrc', imageSrc);
        tile.setAttribute('storeUrl', storeUrl);

        this.appendChild(tile);
    }

    reloadIssues() {
        for (let i of [...this.children]) {
            if (i.tagName.toLowerCase() == 'store-tile') {
                i.remove();
            }
        }

        //check if the service is active and only load issues if its able to talk to the service
        github_intergration.initializeRenderService().then((result) => {
            let issues = github_intergration.loadGitHubIssues(this.getAttribute('repoUrl'));

            issues.then(issuesJSON => {
                for (const issueNumber in issuesJSON) {
                    const issue = issuesJSON[issueNumber];

                    this.addTile(
                        issue.title,
                        'Free, Subscription or Donations',
                        issue.created_at,
                        issue.body || 'No description available.',
                        'https://opengraph.githubassets.com/random-token/' + issue.repository_url.split('/').slice(-2).join('/') + '/issues/' + issue.number,
                        issue.html_url
                    );
                }
            });
        });
    }
}

customElements.define("github-issues", githubIssues);