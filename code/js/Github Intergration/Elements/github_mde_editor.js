import { GithubIntergration } from "../GithubIntergration.js";
let github_intergration = new GithubIntergration();

// Create a class for the element
class GithubMde extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();

        this.issue = null;
    }

    async renderComments(issueNumber, wrapper) {
        let divider = document.createElement('hr');
        wrapper.appendChild(divider);

        let comments = await github_intergration.get_comments(issueNumber);
        for (let i in comments) {
            console.log(comments[i])    
            divider.setAttribute('titletext', 'Comments: ' + (parseInt(i) + 1));

            let comment = document.createElement('github-mde');
            comment.style.width = '100%';
            comment.style.marginBottom = '16px';
            // comment.children[0].getElementsByClassName('dialog-content')[0].remove(); // remove the info section with the repo and label selectors, since we dont need to show that for comments
            comment.setAttribute('readonly', 'true');

            comment.setAttribute('issueTitle', 'Comment by ' + this.issue.user); // set the title of the comment to the username of the commenter
            comment.setAttribute('issueBody', this.issue.body); // set the body of the comment to the body of the issue, since the comment endpoint returns the issue body instead of the comment body for some reason.

            wrapper.appendChild(comment);
        }
    }

    async connectedCallback() {
        if (this.hasAttribute('issuenumber') || window.location.search.includes('issueNumber')) { // if the element has an issue number attribute or the url includes github-mde? then we assume we are trying to view an issue or comment rather than create a new one, and we load the issue or comment instead of showing the editor.
            let issueNumber = this.getAttribute('issuenumber') || new URLSearchParams(window.location.search).get('issueNumber');

            this.issue = await github_intergration.get_issue(issueNumber);
        }

        const wrapper = document.createElement('div');
        wrapper.classList.add('dialog-wrapper');

        const title = document.createElement('h2');
        title.textContent = this.getAttribute('issueTitle') || (this.getAttribute('comments') == 'true' ? 'View issue and comments' : 'Create a new issue or comment');
        title.classList.add('dialog-title');

        const info = document.createElement('div');
        info.style.width = 'calc(100% - 16px)';
        info.classList.add('dialog-content', 'row');

        let labels = document.createElement('github-labels');

        labels.classList.add('hideScrollbar');
        labels.style.margin = '0px';
        labels.style.flex = '1';
        labels.style.borderRadius = 'var(--border-radius-short)';

        let repos_select = document.createElement('select');
        repos_select.classList.add('tabBarHolder'); // apply same styling as the label selector
        github_intergration.listReposWithLogos(this.getAttribute('orgName')).then(reposJSON => {
            for (const repoName in reposJSON) {
                const repo = reposJSON[repoName];

                let option = document.createElement('option');
                option.innerHTML = repo.name;

                repos_select.append(option);
            }
        });

        repos_select.style.margin = '0px';
        repos_select.style.color = 'white';
        repos_select.style.borderRadius = 'var(--border-radius-short)';

        info.append(labels, repos_select);

        const issue_title = document.createElement('div');
        issue_title.classList.add('dialog-content');

        let title_input = document.createElement('input');
        title_input.classList.add('tabBarHolder');
        title_input.placeholder = 'Issue or comment title';
        title_input.value = this.issue ? this.issue.title : ''; // set the title of the issue if the issue number was provided.

        title_input.style.borderRadius = 'var(--border-radius-short)';
        title_input.style.width = 'calc(100% - 16px)';
        title_input.style.margin = '0px';
        title_input.style.padding = '8px';

        issue_title.append(title_input);

        const content = document.createElement('div');
        content.classList.add('dialog-content-end');

        let mde_editor = document.createElement('textarea');
        mde_editor.id = 'mde_eitor';
        mde_editor.classList.add('tabBarHolder');
        mde_editor.placeholder = 'Issue or comment body';
        mde_editor.value = this.getAttribute('issueBody') || (this.issue ? this.issue.body : ''); // set the body of the issue if the issue number was provided.

        mde_editor.style.width = 'calc(100% - 16px)';
        mde_editor.style.padding = '8px';
        mde_editor.style.margin = '0px';
        mde_editor.style.height = '250px'
        mde_editor.style.resize = 'vertical';
        mde_editor.style.borderTopLeftRadius = 'var(--border-radius-short)';
        mde_editor.style.borderTopRightRadius = 'var(--border-radius-short)';

        content.append(mde_editor);

        const button = document.createElement('simple-button');
        button.classList.add('dialog-button');

        button.innerHTML = 'Post'; // for clarity and safety this should be controlled by us, the developers of the theme/engine.

        button.addEventListener('click', () => {
            github_intergration.create_issue('dreamForge-forging-our-dreams-in-tech', 'The-Magic-Garden', title_input.value, mde_editor.value, labels.getElementsByClassName('current')[0].getAttribute('href'));
        });

        if (this.getAttribute('readonly') == 'true') {
            title_input.setAttribute('readonly', 'true');
            mde_editor.setAttribute('readonly', 'true');
            button.style.display = 'none';
            labels.setAttribute('readonly', 'true');
        }

        wrapper.append(title, info, issue_title, content, button);

        if (this.getAttribute('comments') == 'true') {
            this.renderComments(this.issue.number, wrapper);
        }

        this.appendChild(wrapper);

    }
}

customElements.define("github-mde", GithubMde);