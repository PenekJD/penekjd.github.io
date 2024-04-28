/** TV - simple small lib for page-render by JS components 
 * Creator: PenekJD
*/
var $tv = {
    config: {
        renderAll: false
    },
    imports: [],
    links: {},
    linksLoaded: 0,
    isInitialized: false,

    setComponent: function(comp){
        this.links = {...this.links, [comp.name]: comp};
        this.linksLoaded++;
        if ( this.linksLoaded === this.imports.length ) {
            this.isInitialized = true;
            this.startRender();
        }
    },

    import: function(arg){
        this.imports.push(arg);
    },

    initTv: function(){
        let self = this;
        $tv.imports = $tv.imports.filter( (el, idx) => {
            if (!self.config.renderAll) {
                let checkComponent = document.querySelector(el.define);
                if (!checkComponent) { return false; }
            }
            let newScript = document.createElement('script');
    
            newScript.setAttribute('type', 'text/javascript');
            newScript.src = el.file+'.js';
            el.idx = idx;
    
            document.head.appendChild(newScript);
            return true;
        });
    },

    startPending: (function(){
        window.addEventListener('load', function(){
            $tv.initTv();
        });
    })(),

    startRender: function(){
        $tv.imports.forEach( el => {
            let strName = el.file.split('/');
            strName = strName[strName.length-1];
            customElements.define(el.define, $tv.links[strName]);
        });
    },

    setConfig: function(config){
        let self = this;
        self.config = { ...self.config, ...config };
    }

}