$tv.setComponent(
    class Hello extends HTMLElement {
        constructor() {
            super();

            this.innerHTML = /*html*/`
                <div class="main-box code c-fff">
                    Main page Hello
                </div>
            `;
        }
    }
);