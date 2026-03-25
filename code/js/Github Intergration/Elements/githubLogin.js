

// Create a class for the element
class GithubLogin extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('dialog-wrapper');

        const title = document.createElement('h2');
        title.textContent = 'Login or Register with Github';
        title.classList.add('dialog-title');
        wrapper.appendChild(title);

        const message = document.createElement('div');
        message.innerHTML = `To use some of the features of this website, you need to login or register with your Github account. <br><br>
        Granting access allows this application to read your account information and perform actions on your behalf, such as managing repositories and modifying issues or comments. <br><br>`;
        message.classList.add('dialog-content');
        wrapper.appendChild(message);

        const confirm = document.createElement('div');
        confirm.classList.add('dialog-content-end');
        wrapper.appendChild(confirm);

        const confirmation = document.createElement('input');
        confirmation.type = 'checkbox';
        confirmation.id = 'confirmation';

        confirmation.addEventListener('change', (event) => {
            const button = wrapper.querySelector('simple-button');
            button.style.display = event.target.checked ? 'block' : 'none';
        });

        const confirmationLabel = document.createElement('label');
        confirmationLabel.htmlFor = 'confirmation';
        confirmationLabel.textContent = 'I give permission to provide this site with my Github credentials and am aware that this may be a login with a 3rd party website unaffiliated with dreamForge(check this to show button).';

        confirm.appendChild(confirmation);
        confirm.appendChild(confirmationLabel);

        wrapper.appendChild(confirm);

        const button = document.createElement('simple-button');
        button.style.display = 'none'; // hide the button until the user gives permission
        button.style.marginTop = '8px'; // add some spacing between the checkbox and the button
        button.style.margin = 'auto'; // apply auto margin, because there is no central class use this temporary
        button.innerHTML = 'Authorize with Github'; // for clarity and safety this should be controlled by us, the developers of the theme/engine.

        button.addEventListener('click', () => {
            window.location.href = 'https://github-app-a49q.onrender.com/login?origin=' + window.location.href; // redirect to the backend login route, which will handle the OAuth flow and then redirect back to the original page after successful authentication.
        });

        wrapper.appendChild(button);

        this.appendChild(wrapper);

    }
}

customElements.define("github-login", GithubLogin);