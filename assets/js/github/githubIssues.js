// Create a class for the element
class githubIssues extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        let issues = loadGitHubIssues();

        issues.then(issuesJSON => {
            for (const issueNumber in issuesJSON) {
                const issue = issuesJSON[issueNumber];

                console.log(issue.labels);

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


async function loadGitHubIssues() {

    try {

        // Point this to your Render URL (e.g., https://your-app.onrender.com/api/issues)
        // If testing locally, use 'http://localhost:3000/api/issues'
        const response = await fetch('https://github-app-a49q.onrender.com/api/issues');

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