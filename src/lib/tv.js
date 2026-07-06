/** TV - simple small lib for page-render by JS components 
 * Creator: Hrynchyk Dzmitryi
*/
class TvHTMLElement extends HTMLElement {
    LEGACY_HTML = null;
    TV_HTML = '';
    ELEMENT_ATTRIBUTES = [];
    constructor() {
        super();
    }
    bindHtml() {
        this.LEGACY_HTML = this.innerHTML ? Array.from(this.querySelectorAll('*')) : [];
        if (!this.TV_HTML) return;
        this.innerHTML = this.TV_HTML;
        const container = this.LEGACY_HTML.length ? this.querySelector('tv-legacy-html') : null;
        if (!container) {
            this.LEGACY_HTML.forEach((child, idx) => {
                const checkIdxContainer = this.querySelector('tv-legacy-html-' + idx);
                if (!checkIdxContainer) return;
                checkIdxContainer.replaceWith(child);
            });
            return;
        };
        container.replaceWith(...this.LEGACY_HTML);
    }
    connectedCallback() {
        this.bindHtml();
        this.ELEMENT_ATTRIBUTES.forEach(attrConf => {
            for (let keyCode in attrConf) {
                 this.setAttribute(keyCode, attrConf[keyCode]);
            }
        });
    }
}
class TvAlpineHTMLElement extends TvHTMLElement {
    ALPINE_COMPONENT_KEY = null; 
    DEPS = [];
    DEPS_WAIT_NUM = 0;
    DEPS_LOADED = 0;
    constructor() {
        super();
    }
    bindAlpineComponent() {
        if (this.DEPS_WAIT_NUM !== this.DEPS_LOADED) return;
        if (this.ALPINE_COMPONENT_KEY) {
            $tv.$bind(this.ALPINE_COMPONENT_KEY, this[this.ALPINE_COMPONENT_KEY].bind(this)); 
            this.setAttribute('x-data', '$tv.' + this.ALPINE_COMPONENT_KEY);
        }
    }
    connectedCallback() {
        super.connectedCallback();
        let waitForResources = false;
        window.fetchedTvDepsScripts = window.fetchedTvDepsScripts
            ? window.fetchedTvDepsScripts
            : {};

        this.DEPS.forEach(attrConf => {
            for (let keyCode in attrConf) {
                let element = null;
                let srcPath = attrConf[keyCode];
                let srcId = srcPath.split('.')[0].split('/').join('-');
                if (window.fetchedTvDepsScripts[srcId]) return;
                if (keyCode === 'text/css') {
                    element = document.createElement('link');
                    element.href = srcPath;
                    element.rel = 'stylesheet';
                    element.type = keyCode;
                }
                if (keyCode === 'script') {
                    waitForResources = true;
                    this.DEPS_WAIT_NUM = this.DEPS_WAIT_NUM + 1;
                    element = document.createElement('script');
                    element.src = srcPath;
                    element.onload = () => {
                        window.fetchedTvDepsScripts[srcId] = true;
                        this.DEPS_LOADED++;
                        this.bindAlpineComponent();
                    };
                }
                if (!element) return;
                element.id = srcId;
                document.body.appendChild(element);
            }
        });
        if (waitForResources) return;
        this.bindAlpineComponent();
    }
}
var $tv = (function() {
    return {
        domObserver: null,
        config: {
            waitForEveryone: false
        },
        imports: [],
        links: {},
        linksLoaded: 0,
        isInitialized: false,
        renderedComponentsNumber: 0,
        fetchedTags: [],
        fetchedClasses: [],
        cacheBank: {},
        $afterMethods: [],
        $interactMethods: [],

        startPending: (function(){
            window.addEventListener('load', async function(){
                $tv.initTv();
            });
        })(),
        initTv: async function() {
            const registeredTags = this.imports.map(el => el.define).join(', ');
            if (registeredTags) {
                document.querySelectorAll(registeredTags).forEach(element => this.initSingleComponent(element));
            }
            this.startObserver();
        },
        startObserver: function() {
            if (this.domObserver) return;
            this.domObserver = new MutationObserver((mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType !== Node.ELEMENT_NODE) return;
                            this.checkAndHandleNode(node);
                        });
                    }
                }
            });
            this.domObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['loading']
            });
        },
        checkAndHandleNode: function(node) {
            const registeredTags = this.imports.map(el => el.define).join(', ');
            if (!registeredTags) return;
            if (node.matches && node.matches(registeredTags)) {
                this.initSingleComponent(node);
            }
            if (node.querySelectorAll) {
                const foundNested = node.querySelectorAll(registeredTags);
                foundNested.forEach(child => this.initSingleComponent(child));
            }
        },
        initSingleComponent: function(element) {
            const tag = element.localName;
            if (this.fetchedTags.includes(tag)) return;
            let config = this.imports.find(el => el.define === tag);
            if (!config) return;
            const loadingType = element.getAttribute('loading');
            if (loadingType === 'lazy' || loadingType === 'defer') {
                config.element = element;
                this.registerLazyload(config);
                return;
            }
            this.handleScriptFetch(config);
        },
        handleScriptFetch: async function(el, idx) {
            if (this.fetchedTags.includes(el.define)) return;
            this.fetchedTags.push(el.define);

            let newScript = document.createElement('script');
        
            newScript.setAttribute('type', 'text/javascript');
            newScript.src = el.file+'.js';
            el.idx = idx;
    
            document.head.appendChild(newScript);

            if (this.config.waitForEveryone) return;
            newScript.onload = () => {
                this.renderComponent(el.file);
            }
        },
        registerLazyload: async function(el) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    el.element.removeAttribute('loading');
                    this.imports.push({ define: el.define, file: el.file });
                    this.initTv();
                    observer.unobserve(entry.target);
                });
            }, {
                root: null,
                rootMargin: '100px',
                threshold: 0.1
            });
            observer.observe(el.element);
        },
        setComponent: async function(comp){
            this.links = {...this.links, [comp.name]: comp};
            this.linksLoaded++;
            if ( this.linksLoaded === this.fetchedTags.length ) {
                this.isInitialized = true;
                if (!this.config.waitForEveryone) {
                    return;
                }
                this.renderAllComponents();
                this.afterRender();
            }
        },
        import: async function(arg){
            this.imports.push(arg);
        },
        extendClass: function(classObject) {
            classObject.prototype.$rerender = function(){}
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
        bindComponentClass: async function(componentConfig, strName) {
            if (
                !this.fetchedTags.includes(componentConfig.define)
                || this.fetchedClasses.includes(componentConfig.define)
            ) return;
            this.fetchedClasses.push(componentConfig.define);
            const extendedClass = this.extendClass($tv.links[strName]);
            customElements.define(componentConfig.define, extendedClass);
        },
        renderAllComponents: async function() {
            // Render for all components at once
            let self = this;
            $tv.imports.forEach(async (el) => {
                let strName = el.file.split('/');
                strName = strName[strName.length-1];
                this.bindComponentClass(el, strName);
            });
        },
        renderComponent: async function(filePath){
            // Async render of single component
            let self = this;
            let componentClassSource = null;
            $tv.imports = $tv.imports.filter((el) => {
                if (el.file !== filePath) return true;
                componentClassSource = el;
                return false;
            });
            if (!componentClassSource) {
                return;
            }

            let strName = componentClassSource.file.split('/');
                strName = strName[strName.length-1];
            this.bindComponentClass(componentClassSource, strName);
            this.renderedComponentsNumber++;
            this.handlePostRender();
        },
        handlePostRender: async function() {
            if (this.renderedComponentsNumber !== this.fetchedTags.length) {
                return;
            }
            this.afterRender();
        },
        createStorageCache: async function(){
            if (localStorage.getItem('app_cache_bank')) {
                return;
            }
            this.imports.forEach((el) => {
                const elementTag = el.define;
                let elementsHtml = document.querySelectorAll(elementTag);
                this.cacheBank[elementTag] = [...elementsHtml].reduce((acc, el) => {
                    return [...acc, el.innerHTML];
                }, []);
            });
            let cacheToSave = JSON.stringify(this.cacheBank);
            localStorage.setItem('app_cache_bank', cacheToSave)
        },
        afterRender: async function(){
            if (this.config.cache) {
                this.createStorageCache();
            }
            this.$afterMethods = this.$afterMethods.filter(callback => {
                callback(); return false;
            });
            this.handleInteraction();
        },
        handleInteraction: async function (){
            const eventsArray = ['wheel', 'touchstart', 'scroll', 'keydown', 'mouseover'];
            const self = this;
            function removeInteractionEvents() {
                eventsArray.forEach((eventType) => {
                    window.removeEventListener(eventType, handleInteractionBehavior);
                });
            }
            function handleInteractionBehavior() {
                removeInteractionEvents();
                self.$interactMethods.forEach(callback => callback());
            }
            eventsArray.forEach((eventType) => {
                window.addEventListener(eventType, handleInteractionBehavior)
            });
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
        },
        $interact: function(callback){
            if (typeof callback !== 'function') {
                return;
            }
            this.$interactMethods.push(callback);
        }
    }
})();