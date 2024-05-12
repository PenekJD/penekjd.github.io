$tv.setComponent(
    class Slider extends HTMLElement {
        constructor() {
            super();

            const component = function(){
                return {
                    init(){
                        this.calcSlides();
                    },
                    calcSlides(){
                        if (!this.$refs.slider) { return; }
                        let slide = this.$refs.slider.querySelector('.slide');
                        if (!slide) { return; }
                        let slidesWidth = slide.getBoundingClientRect().width;
                    }
                }
            }

            this.innerHTML = /*html*/`
                <div x-data="${component}">
                    <div x-ref="slider" style="border:1px solid #f00; overflow: auto; max-width:80%;">
                        <div class="flx row" style="flex-wrap: nowrap;">
                            <img class="slide" src="/favicon.ico" width="150" height="150" />
                            <img class="slide" src="/favicon.ico" width="150" height="150" />
                            <img class="slide" src="/favicon.ico" width="150" height="150" />
                            <img class="slide" src="/favicon.ico" width="150" height="150" />
                            <img class="slide" src="/favicon.ico" width="150" height="150" />
                        </div>
                    </div>
                </div>
            `;
        }
    }
);