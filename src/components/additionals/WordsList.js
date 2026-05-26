class WordsList extends TvAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initWordsList';

    TV_HTML = /*html*/`
    <button class="top-title-row row-between button-dropdown" 
        :class="{ 'opened' : opened }"
        @click="opened = !opened"
    >
        <h2>My dictionary</h2>
        <span class="row-between">
            <span x-text="'🪙 '+(data.words_pares ? data.words_pares.length : 0)"></span>
            <span class="icon flex-row items-center justify-center">&#10095;</span>
        </span>
    </button>

    <template x-if="opened">
    <div class="word-list-block">
        <div class="filters-block">
            <template x-if="datesArr && datesArr.length">
                <div style="display:flex; justify-content:end; align-items:center;">
                    <span class="mobile-hide" style="margin-right:5px; font-size:12px;">Render date:</span>
                    <select x-model="selectedDate" @change="renderItemsByFilters()">
                        <template x-for="el in datesArr">
                            <option x-bind:value="el.date" x-text="showDataAsString(el.date)"></option>
                        </template>
                    </select>
                </div>
            </template>
            <template x-if="data.availableTopics && data.availableTopics.length">
                <div>
                    <span class="mobile-hide" style="margin-right:5px; font-size:12px;">Group:</span>
                    <select x-model="selectedTopic" @change="prepareDatesArr(true); renderItemsByFilters();">
                        <template x-for="topic in data.availableTopics">
                            <option :value="topic.id"
                                    x-text="topic.title"
                                    :selected=" topic.id === selectedTopic ">
                            </option>
                        </template>
                    </select>
                </div>
            </template>
        </div>
        <template x-if="data.words_pares && data.words_pares.length">
            <div class="words-column">
                <template x-for="el in renderArr">
                    <div x-bind:class="'string-row evaluation_'+( el.average_score || el.average_score===0 ? el.average_score : 'none')"
                        @click="hoverID = el.id" @mouseleave="hoverID = null"
                    >   
                        <template x-if="el.id === hoverID">
                            <div class="translate">
                                <span x-text="el.translate"></span>
                                <input type="text" x-model="el.translate" @keyup.enter="callUpdate()"/>
                            </div>
                        </template>
                        <div class="lang" x-text="el.lang"></div>
                    </div>
                </template>
            </div>
        </template>
    </div>
    </template>
    `;

    initWordsList() {
        let formatter = new Intl.DateTimeFormat('en-EN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        return {
            formatter: formatter,
            opened: false,
            selectedTopic: 0,
            selectedDate: null,
            datesArr: [],
            updatesCount: 0,
            hoverID: null,
            data: {},
            renderArr: [],

            init(){
                this.receiveData();
                this.addHookEvents();
            },

            showDataAsString(dateStr) {
                let dateObj = new Date(dateStr);
                return this.formatter.format(dateObj);
            },

            prepareDatesArr(force){
                let self = this;
                self.selectedTopic = self.selectedTopic*1;
                if (this.updatesCount < 2 || force) {
                    let newArr = [...this.data.words_pares];
                    let COUNTCHECK = 0;
                    newArr = newArr.sort( (a, b) => {
                        b['id'] = COUNTCHECK;
                        COUNTCHECK++;
                        return new Date(b.date)-new Date(a.date); 
                    });
                    if (newArr.length && newArr[newArr.length-1]) {
                        newArr[newArr.length-1]['id'] = COUNTCHECK;
                    }
                    let prevDate = '';
                    newArr = newArr.filter( el => {
                        if (self.selectedTopic) {
                            if (self.selectedTopic!==el.selectedTopic) {
                                return false;
                            }
                        }
                        if (el.date!==prevDate) { 
                            prevDate = el.date;
                            return true; 
                        }
                        prevDate = el.date;
                    } );
                    this.datesArr = newArr;
                    this.selectedDate = ( this.datesArr && this.datesArr.length ) 
                                        ? this.datesArr[0].date
                                        : null;
                    this.updatesCount++;
                }
            },

            callUpdate(){
                let self = this;
                self.data.selectedTopic = self.selectedTopic*1;
                window.dispatchEvent( new CustomEvent( 'data-save-storage', { detail: { data: self.data } } ) );
            },

            renderItemsByFilters(){
                let self = this;
                this.selectedTopic = this.selectedTopic*1;
                this.renderArr = [...this.data.words_pares].filter( el => {
                    if (el.date === self.selectedDate) {
                        if ( !self.selectedTopic ) { return true; }
                        return self.selectedTopic === el.selectedTopic;
                    }
                    return false;
                });
            },

            receiveData(data) {
                if (!data) {
                    this.data = window.globalConfig ? window.globalConfig.data : {};
                } else {
                    this.data = data;
                }
                this.data = data ? { ...this.data, ...data } : this.data;
                if (this.data.words_pares) {
                    this.selectedTopic = this.data.selectedTopic ?  this.data.selectedTopic*1 : 0;
                    this.prepareDatesArr();
                    this.renderItemsByFilters();
                }
            },

            addHookEvents(){
                let self = this;
                window.addEventListener('app-updated', function(e) {
                    if (!e.detail || !e.detail.data) return;
                    self.receiveData(e.detail.data);
                });
                window.addEventListener('toggle-words-list', function() {
                    self.opened = true;
                });
            }
        }
    }
}
$tv.setComponent(WordsList);