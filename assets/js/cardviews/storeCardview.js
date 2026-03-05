// Create a class for the element
class storeTile extends HTMLElement {

constructor() {
        super();
        // Just initialize, don't manipulate the DOM yet
    }

    connectedCallback() {

        const itemIamge = document.createElement('img');
        itemIamge.src = this.getAttribute('imageSrc') || 'https://via.placeholder.com/150';
        itemIamge.alt = this.getAttribute('name') || 'Product Image';
        this.appendChild(itemIamge);

        let nameHolder = document.createElement('h2');
        nameHolder.textContent = this.getAttribute('name') || 'Unknown Product';
        this.appendChild(nameHolder);

        const itemInfo = document.createElement('p');
        let info = '';
        const price = this.getAttribute('price');
        const release = this.getAttribute('release');
        const description = this.getAttribute('shortDescription');

        if (price) info += `Price: ${price} <br>`;
        if (release) info += `Release: ${release} <br>`;
        if (description) info += `<br>${description}`;

        itemInfo.innerHTML = info;

        this.appendChild(itemInfo);

        // This runs when the element is added to the document
        const storeButton = document.createElement('simple-button');
        storeButton.textContent = "Go to " + this.getAttribute('name');

        storeButton.addEventListener('click', () => {
            const url = this.getAttribute('storeUrl');
            if (url) {
                window.open(url, '_blank');
            } else {
                console.warn('No store URL provided for this tile.');
            }
        });
        
        this.appendChild(storeButton);
    }
}

customElements.define("store-tile", storeTile);