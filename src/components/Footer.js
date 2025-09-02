class Footer extends HTMLElement {
    constructor() {
        super();

        let sendDataAttribute = this.$('extend-data');
        this.$setVar('test', 1);

        this.$click('target-click', function() {
            this.$vars.test++;
            console.log(this.$vars.test);
        });

        this.innerHTML = /*html*/`
            <div>
                <span>PenekJD</span>
                <div>Powered by <a href="/pages/tvjs.html">tv.js</a> + <a href="https://alpinejs.dev/" target="_blank">AlpineJS</a></div>
                <div target-click style="font-size:8px;">Languager v.1.2.1</div>
            </div>
            
        `;
    }
}
$tv.setComponent(Footer);