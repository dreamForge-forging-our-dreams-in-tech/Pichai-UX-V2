import { NavigationRail } from '../../elements/navigation/navigation_rail.js';

import { GithubIntergration } from "../GithubIntergration.js";
let github_intergration = new GithubIntergration();

// Create a class for the element
class GithubLabels extends NavigationRail {

    constructor() {
        // Always call super first in constructor
        super();
    }

    add_label(label) {
        let option = document.createElement('a');
        option.innerHTML = label;
        option.href = label;

        this.appendChild(option);
    }

    async connectedCallback() {
        this.classList.add('tabBarHolder');

        github_intergration.list_labels().then(labelJSON => {
            for (const labelName in labelJSON) {
                const label = labelJSON[labelName];

                this.add_label(label.name);
            }
        });
    }
}

customElements.define("github-labels", GithubLabels);