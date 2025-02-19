class Footer extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
            <div>
                <span>PenekJD</span>
                <div>Powered by <a href="/pages/tvjs.html">tv.js</a> + <a href="https://alpinejs.dev/" target="_blank">AlpineJS</a></div>
                <div style="font-size:8px;">Languager v.1.2.1</div>
            </div>
            
        `;
    }
}
$tv.setComponent(Footer);