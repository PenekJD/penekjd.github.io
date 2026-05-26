class SiteMenu extends TvAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initSiteMenu';

    TV_HTML = /*html*/`
    <section class="logo-title">
        <a href="/" class="flex-row items-center justify-center gap-1">
            <img src="/favicon.ico" width="16" height="16" loading="lazy" alt="Logo" />
            <h2>
                Languager
            </h2>
        </a>
        <code>v 2.1.0</code>
    </section>
    <nav role="navigation">
        <ul>
            <template x-for="(item, idx) in menuArr">
                <li>
                    <a  x-bind:href="item.url"
                        :class="{
                            'selected' : selectedIdx === idx
                        }"
                        class="menu-tab"
                    >
                        <img class="icon" :src="item.icon" width="12" height="12" x-bind:alt="item.title" />
                        <span class="text" x-text="item.title"></span>
                    </a>
                </li>
            </template>
        </ul>
    </nav>
    `;

    initSiteMenu() {
        return {
            selectedIdx: null,
            menuArr: [
                {title:'Log', url:'/index.html', icon: '/data/svg/NotesBook.svg'},
                {title:'Assessment', url:'/pages/page1.html', icon: '/data/svg/Performance.svg'},
                {title:'Progress', url:'/pages/save.html', icon: '/data/svg/DataTransfer.svg'},
                {title:'About', url:'/pages/about.html', icon: '/data/svg/Info.svg'},
            ],
            init(){
                let self = this;
                let strPath = window.location.pathname.split('/');
                    strPath = strPath[strPath.length-1];
                if (!strPath) {
                    this.selectedIdx = 0;
                    return;
                }
                this.menuArr.forEach( (elem, idx) => {
                    if (elem.url.indexOf(strPath) >= 0) {
                        self.selectedIdx = idx;
                    }
                });
            }
        }
    }
}
$tv.setComponent(SiteMenu);