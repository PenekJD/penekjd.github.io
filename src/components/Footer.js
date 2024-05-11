$tv.setComponent(
    class Footer extends HTMLElement {
        constructor() {
            super();

            const year = (new Date()).getFullYear();

            this.innerHTML = /*html*/`
                <div class="c-fff flx row btwn code">
                    <div class="flx col tiny ystart">
                        <span>Powered by AlpineJS and tv.js</span>
                        <span>${year}</span>
                    </div>
                </div>
            `;
        }
    }
);