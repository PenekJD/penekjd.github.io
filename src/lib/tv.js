/** TV - simple small lib for page-render by JS components 
 * Creator: PenekJD
*/
console.time('Execution Time');
var $tv = {
    config: {
        renderAll: false,
        waitForEveryone: false
    },
    imports: [],
    links: {},
    linksLoaded: 0,
    isInitialized: false,
    $afterMethods: [],

    setComponent: async function(comp){
        this.links = {...this.links, [comp.name]: comp};
        this.linksLoaded++;
        if ( this.linksLoaded === this.imports.length ) {
            this.isInitialized = true;
            
            if (this.config.waitForEveryone) {
                this.startRender();
            }
            
            this.afterRender();
        }
    },

    import: async function(arg){
        this.imports.push(arg);
    },

    extendClass: function(classObject) {
        classObject.prototype.$rerender = function(){
            
        }
        classObject.prototype.$ = function(attributeCode){
            return this.getAttribute(attributeCode) ?? '';
        }
        classObject.prototype.$setVar = function(code, value){
            this.$vars = this.$vars ? this.$vars : {};
            if (this.$vars[code]) {
                return;
            }
            this.$vars[code] = value;
        }
        classObject.prototype.$var = function(code){
            return this.$vars[code];
        }
        classObject.prototype.$click = function(code, callback){
            if (!code || typeof callback !== 'function') {
                return;
            }
            /* Bind methods after all tv-components render */
            $tv.$after(() => {
                let clickTargets = this.querySelectorAll('['+code+']');
                let extendedCallback = () => {
                    callback.call(this);
                    this.$rerender();
                }
                clickTargets.forEach(
                    clickTarget => clickTarget.addEventListener('click', extendedCallback)
                );
            });
        }
        return classObject;
    },

    initTv: async function(){
        let self = this;
        $tv.imports = $tv.imports.filter((el, idx) => {
            if (!self.config.renderAll) {
                let checkComponent = document.querySelector(el.define);
                if (!checkComponent) { return false; }
            }
            setTimeout(() => {
                let newScript = document.createElement('script');
    
                newScript.setAttribute('type', 'text/javascript');
                newScript.src = el.file+'.js';
                el.idx = idx;
        
                document.head.appendChild(newScript);

                if (this.config.waitForEveryone) {
                    return;
                }
                newScript.onload = () => {
                    this.renderComponent(el.file);
                }
            }, 0);
            return true;
        });
    },

    startRender: async function(){
        let self = this;
        $tv.imports.forEach(async (el) => {
            let strName = el.file.split('/');
            strName = strName[strName.length-1];
            let extendedClass = self.extendClass($tv.links[strName]);
            customElements.define(el.define, extendedClass);
        });
    },

    renderComponent: async function(filePath){
        let self = this;
        let componentClassSource = $tv.imports.find((el) => {
            return el.file === filePath;
        });
        if (!componentClassSource) {
            return;
        }

        let strName = componentClassSource.file.split('/');
            strName = strName[strName.length-1];
        let extendedClass = self.extendClass($tv.links[strName]);
            customElements.define(componentClassSource.define, extendedClass);
            console.log(filePath);
    },

    startPending: (function(){
        window.addEventListener('load', async function(){
            $tv.initTv();
        });
    })(),

    afterRender: async function(){
        console.log("All rendered");
        console.timeEnd('Execution Time');
        this.$afterMethods.forEach(async (callback) => callback());
    },

    setConfig: function(config){
        let self = this;
        self.config = { ...self.config, ...config };
    },

    $bind: function(componentName, component){
        if (this[componentName] || !component) {
            return;
        }
        this[componentName] = component;
    },

    $after: function(callback){
        if (typeof callback !== 'function') {
            return;
        }
        this.$afterMethods.push(callback);
    }
}