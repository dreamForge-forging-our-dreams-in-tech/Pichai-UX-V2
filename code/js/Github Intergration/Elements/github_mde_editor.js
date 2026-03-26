import { GithubIntergration } from "../GithubIntergration.js";
let github_intergration = new GithubIntergration();

// Create a class for the element
class GithubMde extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('dialog-wrapper');

        const title = document.createElement('h2');
        title.textContent = 'Create a new issue or comment';
        title.classList.add('dialog-title');

        const info = document.createElement('div');
        info.style.width = 'calc(100% - 16px)';
        info.classList.add('dialog-content', 'row');

        let labels = document.createElement('navigation-rail');
        github_intergration.list_labels(this.getAttribute('orgName')).then(labelJSON => {
            for (const labelName in labelJSON) {
                const label = labelJSON[labelName];

                let option = document.createElement('a');
                option.innerHTML = label.name;
                label.href = label.name;

                labels.append(option);
            }

            labels.style.gridTemplateColumns = `repeat(` + Object.keys(labelJSON).length + `, 1fr)`; // dynamically calculate size of each item
        });

        labels.classList.add('hideScrollbar');
        labels.style.margin = '0px';
        labels.style.flex = '1';

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

        info.append(labels, repos_select);

        const issue_title = document.createElement('div');
        issue_title.classList.add('dialog-content');

        let title_input = document.createElement('input');
        title_input.classList.add('tabBarHolder');
        title_input.placeholder = 'Issue or comment title';

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
            github_intergration.create_issue('dreamForge-forging-our-dreams-in-tech', 'The-Magic-Garden', title_input.value, mde_editor.value, 'invalid');
        });

        wrapper.append(title, info, issue_title, content, button);

        this.appendChild(wrapper);

    }
}

customElements.define("github-mde", GithubMde);