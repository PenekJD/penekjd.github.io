$tv.setComponent(
    class Blog extends HTMLElement {
        constructor() {
            super();

            const component = function(){
                return {
                    pending: false,
                    blogArr: [],
                    init(){
                        this.loadBlogData();
                    },
                    loadBlogData(){
                        const blogDataUrl = '/data/blog_data.js';
                        let self = this;

                        this.pending = true;
                        fetch('/data/blog_data.json')
                        .then( resp => {
                            return resp.json();
                        })
                        .then(data => {
                            self.blogArr = data;
                        })
                        .finally(() => {
                            this.pending = false;
                        });
                    }
                }
            }

            this.innerHTML = /*html*/`
                <div x-data="${component}" class="main-box code c-fff flx col">
                    <template x-if="pending">
                        <div class="loading loading-local"></div>
                    </template>
                    <h2 class="title large">Blog</h2>
                    <div class="blog-grid">
                        <template x-for="blog in blogArr">
                            <div class="blog-item flx col ystart">
                                <div class="blog-img mr-10">
                                    <img loading="lazy" 
                                         :src="blog.img"/>
                                </div>
                                <div class="blog-text">
                                    <div class="title big mb-10" x-text="blog.title"></div>
                                    <div class="text txtcolumn" x-html="blog.desc"></div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            `;
        }
    }
);