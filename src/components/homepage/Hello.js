$tv.setComponent(
    class Hello extends HTMLElement {
        constructor() {
            super();

            this.innerHTML = /*html*/`
                <app-banner-widget></app-banner-widget>
                <div class="main-box code c-fff flx row ycenter">
                    <span class="title big">I'm working on it :)</span>
                </div>
                <!--
                <app-blog></app-blog>
                <app-slider></app-slider>-->
                
            `;
        }
    }
);