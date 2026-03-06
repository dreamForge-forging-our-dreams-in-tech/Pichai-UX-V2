// Create a class for the element
class githubIssues extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        this.reloadIssues();
    }

    reloadIssues(labels = 'All') {
        let issues = loadGitHubIssues(this.getAttribute('repoUrl') || 'https://api.github.com/repos/facebook/react/issues?state=all&per_page=100');

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
    }
}

customElements.define("github-issues", githubIssues);


async function loadGitHubIssues(url = 'https://api.github.com/repos/${OWNER}/${REPO}/issues?state=all&per_page=100') {

    try {

        // Point this to your Render URL (e.g., https://your-app.onrender.com/api/issues)
        // If testing locally, use 'http://localhost:3000/api/issues'
        const response = await fetch(`https://github-app-a49q.onrender.com/api/issues?origin=${url}`);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const issues = await response.json();

        // Loop through issues and create HTML elements
        let issuesJSON = {};
        issues.forEach(issue => {
            issuesJSON[issue.number] = issue;
        });

        return issuesJSON;

    } catch (error) {
        console.error("Failed to load issues:", error);
    }
}

// Run the function when the page loads
export { loadGitHubIssues };