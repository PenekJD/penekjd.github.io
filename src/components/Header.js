$tv.setComponent(
    class Header extends HTMLElement {
        constructor() {
            super();

            const component = function(){
                return {
                    isOpen: true,
                    selectedIdx: null,
                    menuArr: [
                        {title:'Main', url:'/index.html', icon: ''},
                        {title:'About me', url:'/pages/about.html', icon: ''},
                        {title:'Blog', url:'/pages/blog.html', icon: ''},
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
                    <div class="head-title flx row" @click=" isOpen = !isOpen ">
                        <span class="smile">&#x2630;</span>
                        <div class="flx col xcenter" x-show="isOpen">
                            <span class="title med">Penek<span class="accent">JD</span></span>
                            <span class="text tiny">FrontEnd</span>
                        </div>
                    </div>
                    <ul class="app-menu flx col" x-show="isOpen">
                        <template x-for="(item, idx) in menuArr">
                            <li>
                                <a  x-bind:href="item.url"
                                    :class="{
                                        'selected' : selectedIdx === idx
                                    }"
                                    class="menu-tab"
                                >
                                    <span class="icon" x-text="item.icon"></span>
                                    <span x-text="item.title"></span>
                                </a>
                            </li>
                        </template>
                    </ul>
                </nav>
            `;
        }
    }
);