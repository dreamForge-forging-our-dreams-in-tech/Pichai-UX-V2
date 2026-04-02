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
        divider.setAttribute('titletext', 'Comments');
        wrapper.appendChild(divider);

        let create_comment = document.createElement('github-mde');
        create_comment.setAttribute('mode', 'comment');
        create_comment.setAttribute('issueNumber', issueNumber);
        create_comment.setAttribute('issueBody', '');
        create_comment.setAttribute('comments', 'false');
        create_comment.style.width = '100%';
        create_comment.style.marginBottom = '16px';

        wrapper.parentNode.appendChild(create_comment);

        let comments = await github_intergration.get_comments(issueNumber);
        for (let i in comments) {   

            let comment = document.createElement('github-mde');
            comment.style.width = '100%';
            comment.style.marginBottom = '16px';
            comment.setAttribute('readonly', 'true');

            comment.setAttribute('mode', 'comment'); // set the mode to comment so that the element knows to render a comment rather than an issue.
            comment.setAttribute('issueTitle', 'Comment by ' + comments[i].user.login); // set the title of the comment to the username of the commenter
            comment.setAttribute('issueBody', comments[i].body); // set the body of the comment to the body of the issue, since the comment endpoint returns the issue body instead of the comment body for some reason.

            wrapper.parentNode.appendChild(comment);
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

        wrapper.appendChild(title);

        if (this.getAttribute('mode') == 'issue') { // if it is a issue load all items required for issues.

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


            wrapper.appendChild(info);

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

            wrapper.appendChild(issue_title);
        }

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
        wrapper.appendChild(content);

        const button = document.createElement('simple-button');
        button.classList.add('dialog-button');

        button.innerHTML = 'Post'; // for clarity and safety this should be controlled by us, the developers of the theme/engine.

        button.addEventListener('click', () => {
            if (this.getAttribute('mode') == 'comment') {
                github_intergration.create_comment(mde_editor.value, this.issue.number, 'dreamForge-forging-our-dreams-in-tech', 'The-Magic-Garden');
            } else {
                github_intergration.create_issue('dreamForge-forging-our-dreams-in-tech', 'The-Magic-Garden', title_input.value, mde_editor.value, labels.getElementsByClassName('current')[0].getAttribute('href'));
            }
        });

        wrapper.appendChild(button);

        if (this.getAttribute('readonly') == 'true') {
            mde_editor.setAttribute('readonly', 'true');
            button.style.display = 'none';

            if (this.getAttribute('mode') == 'issue') {
                try {
                    title_input.setAttribute('readonly', 'true');
                    labels.setAttribute('readonly', 'true');
                } catch (e) { }
            }

        }

        this.appendChild(wrapper);

        if (this.getAttribute('comments') == 'true') {
            this.renderComments(this.issue.number, wrapper);
        }

    }
}

customElements.define("github-mde", GithubMde);