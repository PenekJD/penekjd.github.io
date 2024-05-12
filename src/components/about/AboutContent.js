$tv.setComponent(
    class AboutContent extends HTMLElement {
        constructor() {
            super();

            this.innerHTML = /*html*/`
                <div class="main-box code c-fff flx row ycenter">
                    <div class="photo ptop glowing" title="Dmitry Hrynchyk"
                        style="background-image:url('/src/img/ME.jpg');"></div>
                    <div class="flx col">
                        <span class="title large">Dmitry Hrynchyk</span>
                        <span class="small">FrontEnd Developer</span>
                    </div>
                </div>
            `;
        }
    }
);