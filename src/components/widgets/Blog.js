$tv.setComponent(
    class Blog extends HTMLElement {
        constructor() {
            super();

            const component = function(){
                return {
                    blogArr: [],
                    init(){
                        this.loadBlogData();
                    },
                    loadBlogData(){
                        let blogData = document.createElement('script');
                        blogData.src = '/data/blog_data.js';
                        blogData.setAttribute('defer', true);
                        document.body.appendChild(blogData);
                    },
                    getBlogData(e){
                        this.blogArr = e.detail;
                    }
                }
            }

            this.innerHTML = /*html*/`
                <div x-data="${component}" class="main-box code c-fff flx col"
                    @blog-data.window="getBlogData"
                >
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