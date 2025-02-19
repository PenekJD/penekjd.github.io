$tv.setComponent(
    class SiteMenu extends HTMLElement {
        constructor() {
            super();

            const component = function(){
                return {
                    selectedIdx: null,
                    menuArr: [
                        {title:'Abstract', url:'/index.html', icon: '📔'},
                        {title:'Assessment', url:'/pages/page1.html', icon: '📝'},
                        {title:'Progress', url:'/pages/save.html', icon: '💾'},
                        {title:'About', url:'/pages/about.html', icon: '🪧'},
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

            this.innerHTML = /*html*/`
                <nav x-data="${component}">
                    <ul>
                        <template x-for="(item, idx) in menuArr">
                            <li>
                                <a  x-bind:href="item.url"
                                    :class="{
                                        'selected' : selectedIdx === idx
                                    }"
                                    class="menu-tab"
                                >
                                    <span class="icon" x-text="item.icon"></span>
                                    <span class="text" x-text="item.title"></span>
                                </a>
                            </li>
                        </template>
                    </ul>
                </nav>
                <site-top-additionals></site-top-additionals>
            `;
        }
    }
);