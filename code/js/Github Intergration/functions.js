class GithubIntergration {
    constructor() {

    }

    initializeRenderService() { // checks if the render service is active and starts it if it isnt active yet
            return new Promise((resolve, reject) => {
                fetch('https://github-app-a49q.onrender.com/ping')
                    .then(response => {
                        resolve('Service is awake!', response.status);
                    })
                    .catch(err => console.error('Error waking up service:', err));
            });
    }

    async loadGitHubIssues(url = 'https://api.github.com/repos/dreamForge-forging-our-dreams-in-tech/The-Magic-Garden/issues?state=all&per_page=100') {

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

    async listReposWithLogos(orgName) { // retrieves a lists of all github repos for a org and displays them in the provided container.
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
}

export { GithubIntergration }