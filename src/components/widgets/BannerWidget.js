$tv.setComponent(
    class BannerWidget extends HTMLElement {
        constructor() {
            super();

            const year = (new Date()).getFullYear();

            this.innerHTML = /*html*/`
                <div class="title big flx ycenter xcenter" style="height:300px; background-color:#999; color:#444;">
                    100% x 300px
                </div>
            `;
        }
    }
);