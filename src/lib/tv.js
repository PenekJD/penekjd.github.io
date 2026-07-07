/** TV | v 2.0.2 - simple small lib for page-render by JS components 
 * Creator: Hrynchyk Dzmitryi
*/
class TvHTMLElement extends HTMLElement {
    LEGACY_HTML = null;
    TV_HTML = '';
    ELEMENT_ATTRIBUTES = [];
    _bindHtml() {
        this.LEGACY_HTML = this.innerHTML ? Array.from(this.children) : [];
        if (!this.TV_HTML) return;
        this.innerHTML = typeof this.TV_HTML === 'function' 
            ? this.TV_HTML(this.$)
            : this.TV_HTML;
        const container = this.LEGACY_HTML.length ? this.querySelector('tv-childs') : null;
        if (!container) {
            this.LEGACY_HTML.forEach((child, idx) => {
                const checkIdxContainer = this.querySelector('tv-child-' + idx);
                if (!checkIdxContainer) return;
                checkIdxContainer.replaceWith(child);
            });
            return;
        };
        container.replaceWith(...this.LEGACY_HTML);
    }
    connectedCallback() {
        console.log(this.tagName ,'Bindend')
        this._bindHtml();
        this.setAttribute('tv-binded', 1);
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
    bindAlpineComponent() {
        if (this.DEPS_WAIT_NUM !== this.DEPS_LOADED) return;
        if (this.ALPINE_COMPONENT_KEY) {
            $tv.$bind(this.ALPINE_COMPONENT_KEY, this[this.ALPINE_COMPONENT_KEY].bind(this, this.$attr)); 
            this.setAttribute('x-data', '$tv.' + this.ALPINE_COMPONENT_KEY);
        }
    }
    connectedCallback() {
        super.connectedCallback();
        let waitForResources = false;
        window.fetchedTvDepsScripts = window.fetchedTvDepsScripts
            ? window.fetchedTvDepsScripts : {};
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
        debounceTimeout: null,
        config: {
            waitForEveryone: false
        },
        imports: [],
        lazyImports: [],
        deferImports: [],
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
        initTv: async function(node = document) {
            const registeredTags = this.imports.map(el => el.define).join(', ');
            if (registeredTags) {
                node.querySelectorAll(registeredTags).forEach(element => this.initSingleComponent(element));
            }
            if (this.domObserver) return;
            this.startObserver();
        },
        startObserver: function() {
            if (this.domObserver) return;
            this.domObserver = new MutationObserver((mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType !== Node.ELEMENT_NODE) return;
                            this.checkAndHandleNodeMutation(node);
                        });
                    }
                    if (mutation.type === 'attributes' && mutation.attributeName === 'loading') {
                        this.handleAttributeChange(mutation.target);
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
        handleAttributeChange: function(element) {
            this.initSingleComponent(element);
        },
        checkAndHandleNodeMutation: function(node) {
            const registeredTags = this.imports.map(el => el.define).join(', ');
            if (!registeredTags) return;
            let isTvComponent = false;
            if (node.matches && node.matches(registeredTags)) {
                isTvComponent = true;
                this.initSingleComponent(node);
            }
            if (!isTvComponent && node.querySelectorAll) {
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => {
                    const foundNested = node.querySelectorAll(registeredTags);
                    foundNested.forEach(child => this.initSingleComponent(child, true));
                }, 0);
            }
        },
        initSingleComponent: function(element, isMutation) {
            const tag = element.localName;
            if (this.fetchedTags.includes(tag)) return;
            let config = this.imports.find(el => el.define === tag);
            if (!config) return;
            const loadingType = element.getAttribute('loading');
            if (loadingType === 'lazy' || loadingType === 'defer') {
                config.element = element;
                config.loading = loadingType;
                this.registerLazyload(config, isMutation);
                return;
            }
            this.handleScriptFetch(config);
        },
        registerLazyload: async function(el, isMutation) {
            if (this.lazyImports.includes(el.element)) return;
            this.lazyImports.push(el.element);
            el.element.style.display = "none";
            if (el.loading === 'defer') this.deferImports.push(el);
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (el.loading === 'lazy') el.element.style.display = '';
                    if (!entry.isIntersecting) return;
                    el.element.removeAttribute('loading');
                    observer.unobserve(entry.target);
                });
            }, {
                root: null,
                rootMargin: '100px',
                threshold: 0.1
            });
            observer.observe(el.element);
            if (!isMutation) return;
            this.afterRender();
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
            classObject.prototype.$attr = (context, attributeCode) => {
                return context.getAttribute(attributeCode) ?? '';
            }
            Object.defineProperty(classObject.prototype, '$', {
                get: function() {
                    const attrs = {};
                    for (let i = 0; i < this.attributes.length; i++) {
                        const attr = this.attributes[i];
                        attrs[attr.name] = attr.value;
                    }
                    return attrs;
                },
                configurable: true
            });
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
            this.lazyImports.forEach(element => element.style.display = '');
            this.afterRender();
        },
        afterRender: async function(){
            this.$afterMethods = this.$afterMethods.filter(callback => {
                callback(); return false;
            });
            this.handleInteraction();
            this.deferImports.forEach(el => el.element.style.display = '');
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