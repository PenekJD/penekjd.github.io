$tv.setComponent(
    class Header extends HTMLElement {
        constructor() {
            super();

            const component = function(){
                return {
                    selectedIdx: null,
                    menuArr: [
                        {title:'Main', url:'/index.html', icon: ''},
                        {title:'About me', url:'/pages/about.html', icon: ''},
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
                    <div class="flx col" style="padding:20px 10px 30px;">
                        <span class="title med">PenekJD</span>
                        <span class="text atom">FrontEnd Developer</span>
                    </div>
                    <ul class="app-menu flx col">
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