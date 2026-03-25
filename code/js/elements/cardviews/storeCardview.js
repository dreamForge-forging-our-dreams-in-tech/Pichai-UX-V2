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

        let nameHolder = document.createElement('h2');
        nameHolder.textContent = this.getAttribute('name') || 'Unknown Product';

        const itemInfo = document.createElement('p');

        let price = this.getAttribute('price');
        let release = this.getAttribute('release');
        let description = this.getAttribute('shortDescription');
        
        if (price) itemInfo.innerHTML += `Price: ${price} <br>`;
        if (release) itemInfo.innerHTML += `Release: ${release} <br>`;
        if (description) itemInfo.innerHTML += `<br>${description}`;

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
        
        this.append(itemIamge, nameHolder, itemInfo, storeButton)
    }
}

customElements.define("store-tile", storeTile);