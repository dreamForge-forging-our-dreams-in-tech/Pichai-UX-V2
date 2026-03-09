//NOTE: still file still refrences to the old name which is tab-bar

// Create a class for the element
class NavigationRail extends HTMLElement {
    /** @description 
* The tabbar element allows you to navigate between pages or viewpager pages
*/

    /** @usage 
     * Navigating between pages
    */

    static observedAttributes = ["direction", 'index', 'for'];

    constructor() {
        // Always call super first in constructor
        super();
    }

    connectedCallback() {
        let i;
        let index = this.getAttribute('index') || 0;
        let keys = this.children;
        let forAttr = this.getAttribute('for');

        this.classList.add('tabBarHolder');

        this.style.gridTemplateColumns = `repeat(` + keys.length + `, 1fr)`;

        if (this.getAttribute('direction') == 'vertical') {
            this.classList.add('verticalTabbar');
        }

        if (!forAttr == '') {
            addForConnection(this, forAttr);
        }

        for (i of keys) {
            i.setAttribute('index', index);

            //automatically select href refrencing to page url.
            if (i.href == window.location.href) {
                i.classList.add('current');
            }

            if (!forAttr == '') {
                let element = document.getElementById(forAttr);
                let el = element.children[parseInt(i.getAttribute('index'))];

                if (el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) {
                    i.classList.add('current');
                }
            }

            i.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (!this.classList.contains('current')) {

                    try {
                        i.parentNode.getElementsByClassName('current')[0].classList.remove('current');
                    } catch (e) { }
                    this.classList.add('current');
                }
            });

            index++
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.getAttribute('direction') == 'vertical') {
            this.classList.add('verticalTabbar');
        } else {
            this.classList.remove('verticalTabbar');
        }

        if (!this.getAttribute('for') == '') {
            addForConnection(this, this.getAttribute('for'));
        } else {
            removeForConnection(this, this.getAttribute('for'));
        }
    }
}

function addForConnection(e, e2) {
    let element = document.getElementById(e2);
    let i;

    //fires the pageChanged function on the connected for element, it executes what the developer put into the pageChanged function/callback.
    element.pageChanged();
}

function removeForConnection(e, e2) {
    let element = document.getElementById(e2);
    let i;

    for (i of e.children) {
        i.removeEventListener('click', function () { }, false);
    }
}

customElements.define("navigation-rail", NavigationRail);  