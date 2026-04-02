import { get_fetch } from "../Functions/fetch_get.js";

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

    async get_issue(issueNumber, repoUrl = 'https://api.github.com/repos/dreamForge-forging-our-dreams-in-tech/The-Magic-Garden/issues?state=all&per_page=100') {
        return new Promise((resolve) => {
            let issues = this.loadGitHubIssues(repoUrl);

            issues.then(issuesJSON => {
                resolve(issuesJSON[issueNumber]);
            });
        });
    }

    async get_comments(issue_number, repoUrl = 'https://api.github.com/repos/dreamForge-forging-our-dreams-in-tech/The-Magic-Garden/issues') {
        return new Promise(async (resolve) => {
            const issuePayload = {
                repoUrl: repoUrl,
                issueNumber: issue_number,
            };

            try {
                const response = await fetch('https://github-app-a49q.onrender.com/get_comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // 👈 Tells Render you are sending JSON
                    },
                    body: JSON.stringify(issuePayload) // 👈 Turns the JS object into a string
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    resolve(errorData.error || response.statusText);
                    throw new Error(`Server error: ${errorData.error || response.statusText}`);
                }

                const data = await response.json();
                resolve(data);
                console.log('✅ comments succesfully retrieved.', data);

            } catch (error) {
                console.error('❌ Failed to get comments:', error);
            }
        });
    }

    async loadGitHubIssues(url = 'https://api.github.com/repos/dreamForge-forging-our-dreams-in-tech/The-Magic-Garden/issues?state=all&per_page=100') {

        try {
            // Point this to your Render URL (e.g., https://your-app.onrender.com/api/issues)
            // If testing locally, use 'http://localhost:3000/api/issues'
            const issues = await get_fetch(`https://github-app-a49q.onrender.com/api/issues?origin=${encodeURIComponent(url)}`)

            // Loop through issues and create a json
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
        try {
            const repos = await get_fetch(`https://api.github.com/orgs/${orgName}/repos?per_page=100`)

            let reposJSON = {};

            repos.forEach(repo => {
                reposJSON[repo.name] = repo;
            });

            return reposJSON;

        } catch (error) {
            console.error("Error:", error);
        }
    }

    async list_labels(orgName = 'dreamForge-forging-our-dreams-in-tech', repo = 'The-Magic-Garden') { // retrieves a lists of all github repos for a org and displays them in the provided container.
        try {
            const labels = await get_fetch(`https://api.github.com/repos/${orgName}/${repo}/labels`)

            let labelsJSON = {};

            labels.forEach(label => {
                labelsJSON[label.name] = label;
            });

            return labelsJSON;

        } catch (error) {
            console.error("Error:", error);
        }
    }

    async create_comment(body, issue_number, owner, repoUrl) {
        const issuePayload = {
            issueNumber: issue_number,
            body: body,
            owner: owner,
            repo: repoUrl
        };

        try {
            const response = await fetch('https://github-app-a49q.onrender.com/create_comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // 👈 Tells Render you are sending JSON
                },
                body: JSON.stringify(issuePayload) // 👈 Turns the JS object into a string
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Server error: ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Issue successfully created on GitHub!', data);

        } catch (error) {
            console.error('❌ Failed to submit issue:', error);
        }
    }

        async create_issue(orgname, repo, title, body, labels) {
        const issuePayload = {
            owner: orgname,
            repo: repo,
            title: title,
            body: body,
            labels: [labels]
        };

        try {
            const response = await fetch('https://github-app-a49q.onrender.com/create_issue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // 👈 Tells Render you are sending JSON
                },
                body: JSON.stringify(issuePayload) // 👈 Turns the JS object into a string
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Server error: ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Issue successfully created on GitHub!', data);

        } catch (error) {
            console.error('❌ Failed to submit issue:', error);
        }
    }
}

export { GithubIntergration }