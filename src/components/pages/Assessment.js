$tv.setComponent(
    class Assessment extends HTMLElement {
        constructor() {
            super();
                
            //const content = this.innerHTML;

            const component = function(){
                return {
                    isComponentLoaded: false,
                    checkObj: null,
                    currentInput: '',
                    type: 0,
                    groupCount: null,
                    firstIdx: 0,
                    lastIdx: 0,
                    assessmentTypes: ['Order', 'Random'],
                    motivations: {
                        4: ['🥳 Fantastic', '👱 Your mom could proud of you', '🤟 Damn you\'re good', '💪 Thats ma man', '💣 BOOM-bastic!', '🌟 You\'re the best!', '🤩 Superman - it\'s You!'],
                        3: ['Nice work', 'Well done', 'Keep it up!', 'Good!', 'Nicely done'],
                        2: ['Not bad', 'Ok', 'You can better', 'Yeah...', 'Ok for A1'],
                        1: ['Try harder', 'You should learn more', 'Did you even learn smth?!', 'Wooops...', 'Thats crappy', 'My grandma can do better', 'It\'s all you got?'],
                        0: ['😾 Are you serious?', '👹 Booo for you...', '😿 No way...', '💩 Holly shmolly...', '🙀 Ouh my...', '🤕 Shame on you...']
                    },
                    showMotivation: '',
                    isByWeak: false,
                    isByDate: false,
                    selectedDate: null,
                    datesArr: [],
                    updatesCount: 0,
                    selectedIdx: 0,
                    selectedTopic: 0,
                    arrayForRender: [],
                    unprepared: true,
                    evaluated: true,
                    currentEvaluation: null,
                    wordsEvaluation: [],
                    isTillRemember: false,
                    data: {},

                    init(){
                        this.addHookEvents();
                    },

                    checkInput(){
                        if (this.unprepared) { return; }
                        if (!this.currentInput) {
                            this.getObjectForAssessment();
                            this.evaluated = false;
                            return;
                        }
                        if (this.evaluated) {
                            this.currentInput = '';
                            if (this.isTillRemember) {
                                if (this.currentEvaluation===4) {
                                    this.getObjectForAssessment();
                                }
                            } else {
                                this.getObjectForAssessment();
                            }
                            this.evaluated = false;
                        } else {
                            this.evaluateInput();
                            this.evaluated = true;
                            this.callUpdate();
                        }
                    },

                    handleGroup(){
                        if (this.groupCount) {

                        } else {}
                    },

                    getObjectForAssessment(){
                        if (this.assessmentTypes[this.type]==='Random') {
                            this.selectedIdx = Math.floor( Math.random() * this.arrayForRender.length );
                        } else {
                            this.selectedIdx++;
                            if (this.selectedIdx>=this.arrayForRender.length) {
                                this.selectedIdx = 0;
                            }
                        }
                        this.checkObj = this.arrayForRender[this.selectedIdx];
                    },

                    evaluateInput(){
                        function clearAndPrepareStrToArr(str){
                            return str.trim().toLowerCase().replace(/[.,;?!:&%$#@*()-+><]/g, '').split(' ');
                        }
                        if ( this.checkObj && this.checkObj.translate ) {
                            let self = this;
                                self.wordsEvaluation = [];
                                self.currentEvaluation = 0;
                            let originalLang = clearAndPrepareStrToArr( this.checkObj.lang );
                            let checkInput = clearAndPrepareStrToArr( this.currentInput.replace(/\s+/g, ' ') );
                            originalLang.forEach( (word, idx) => {
                                let wordObj = { word: word, score: 0 };
                                if (word===checkInput[idx]) {
                                    wordObj.score++;
                                }
                                if ( checkInput.indexOf(word) >= 0 ) {
                                    wordObj.score++;
                                }
                                self.currentEvaluation += wordObj.score;
                                self.wordsEvaluation.push(wordObj);
                            } );
                            self.currentEvaluation = Math.round( 4*self.currentEvaluation/(originalLang.length*2) );

                            // *********** start: Save evaluation results of fraze ***********
                            self.checkObj['check_numbers'] = self.checkObj['check_numbers'] ? self.checkObj['check_numbers']+=1 : 1;
                            self.checkObj['common_score'] = self.checkObj['common_score'] ? self.checkObj['common_score'] += self.currentEvaluation : self.currentEvaluation;
                            if ( self.checkObj['average_score'] ) {
                                self.checkObj['average_score'] = Math.round( self.checkObj['common_score'] / self.checkObj['check_numbers'] );
                            } else {
                                self.checkObj['average_score'] = self.currentEvaluation;
                            }
                            let curDate = new Date();
                                curDate = curDate.getFullYear()+'-'+(curDate.getMonth()+1)+'-'+curDate.getDate();
                            self.checkObj['last_check'] = curDate;
                            // *********** end: Save evaluation results of fraze ***********

                            self.setMotivationStr();
                        }
                    },

                    setMotivationStr(){
                        let getRandom = Math.floor(Math.random() * this.motivations[this.currentEvaluation].length);
                        this.showMotivation = this.motivations[this.currentEvaluation][getRandom];
                    },

                    changePreparation(){
                        this.checkObj = null;
                        this.selectedIdx = 0;
                        this.unprepared = true;
                        this.prepareArrayForRender();
                    },

                    prepareArrayForRender(){
                        let self = this;
                        let newArr = [];
                        this.selectedTopic = this.selectedTopic*1;
                        newArr = self.data.words_pares ? [...self.data.words_pares] : [];
                        if (this.selectedTopic) {
                            newArr = newArr.filter( el => el.selectedTopic === self.selectedTopic );
                        }
                        if (this.isByDate) {
                            newArr = newArr.filter( el => el.date === self.selectedDate );
                        }
                        if (this.isByWeak) {
                            newArr = newArr.filter( el => {
                                if (!el.average_score) { return false; }
                                if (el.average_score < 4) { return true; }
                                return false;
                            } );
                            newArr = newArr.sort( (a,b) => a.average_score - b.average_score );
                        }
                        this.selectedIdx = -1;
                        this.arrayForRender = newArr;
                        this.unprepared = false;
                    },

                    prepareDatesArr(force){
                        let self = this;
                        self.selectedTopic = self.selectedTopic*1;
                        if (this.updatesCount < 2 || force) {
                            let newArr = [...this.data.words_pares];
                            newArr = newArr.sort( (a, b) => { 
                                return new Date(b.date)-new Date(a.date); 
                            });
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
                        window.dispatchEvent( new CustomEvent( 'data-save-storage', { detail: { data: self.data } } ) );
                    },

                    addHookEvents(){
                        let self = this;
                        window.addEventListener('app-updated', function(e) {
                            if (!self.isComponentLoaded && e.detail && e.detail.data) {
                                self.data = { ...self.data, ...e.detail.data };
                                self.selectedTopic = self.data.selectedTopic ?  self.data.selectedTopic : 0;
                                self.prepareDatesArr();
                                self.prepareArrayForRender();
                                self.isComponentLoaded = true;
                            }
                        });
                        window.addEventListener('check_comp', function(){
                            console.log(self.data);
                        })
                    }

                }
            }

            this.innerHTML = /*html*/`
                <div x-data="${component}">

                    <div class="title">
                        <h2>Assessment</h2>
                        <template x-if="isByDate || isTillRemember || isByWeak">
                            <div class="active-filters-bar">
                                <template x-if="isByWeak">
                                    <span style="font-size:22px;">🤕</span>
                                </template>
                                <template x-if="isTillRemember">
                                    <span style="font-size:22px;">🐵</span>
                                </template>
                                <template x-if="isByDate">
                                    <div style="display:flex; gap:4px; padding:4px; background-color:rgb(64, 126, 189); border-radius:6px;">
                                        <span>🗓</span>
                                        <select style="height:20px; padding:2px;" x-model="selectedDate" @change="changePreparation()">
                                            <template x-for="el in datesArr">
                                                <option x-bind:value="el.date" x-text="el.date"></option>
                                            </template>
                                        </select>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>

                    <template x-if="data.availableTopics && data.availableTopics.length">
                        <div class="filters-settings">
                            <select style="width:100%;" x-model="selectedTopic" @change="prepareDatesArr(true); changePreparation()">
                                <template x-for="topic in data.availableTopics">
                                    <option :value="topic.id"
                                            x-text="topic.title"
                                            :selected=" topic.id === selectedTopic ">
                                    </option>
                                </template>
                            </select>
                        </div>
                    </template>
                    <div class="filters-settings">
                        <div style="width: 170px;">
                            <div class="display: flex; flex-direction:row; gap:5px; align-items:center;">
                                <span x-text="selectedIdx+1"></span> /
                                <span x-text="arrayForRender && arrayForRender.length"></span>
                                <select x-model="type" style="margin-left:10px;">
                                    <template x-for="(type, idx) in assessmentTypes">
                                        <option :value="idx" x-text="type"></option>
                                    </template>
                                </select>
                            </div>
                        </div>
                        <template x-if="datesArr.length">
                            <div @click="isByDate=!isByDate; changePreparation();"
                                class="filter-checkbox">
                                <span style="">Group by date:</span>
                                <input type="checkbox"
                                       x-model="isByDate"
                                >
                            </div>
                        </template>
                        <div @click="isTillRemember=!isTillRemember;" 
                             class="filter-checkbox">
                            <span>Till remember:</span>
                            <input type="checkbox"
                                   x-model="isTillRemember"
                            >
                        </div>
                        <div @click="isByWeak=!isByWeak; changePreparation();" 
                             class="filter-checkbox">
                            <span>Weakests:</span>
                            <input type="checkbox"
                                   x-model="isByWeak"
                            >
                        </div>
                    </div>

                    <div class="assessment-block">
                        <template x-if="checkObj">
                            <div style="padding:5px; font-weight:bold; font-size: 18px; background-color: #ff0; position: relative; z-index:5;"
                                 x-text="checkObj.translate"
                            ></div>
                        </template>
                        <input style="font-size:18px;"
                               x-model="currentInput" 
                               @keyup.enter="checkInput()"
                               x-bind:placeholder=" !checkObj ? 'Press Enter to start' : 'Enter translation' "
                        />
                        <button x-on:click="checkInput()">Check / Next</button>
                    </div>

                    <template x-if="evaluated && wordsEvaluation.length">
                        <div class="evaluation_block">
                            <div class="check_words_row">
                                <template x-for="wordObj in wordsEvaluation">
                                    <span x-bind:class="'check_word text-outline score_' + wordObj.score " 
                                        x-text="wordObj.word"
                                    ></span>
                                </template>
                            </div>
                            <template x-if="currentEvaluation || currentEvaluation===0">
                                <div x-bind:class="'evaluation text-outline eval_score_'+currentEvaluation">
                                    <span class="digit" x-text="currentEvaluation+1"></span>
                                    <span style="font-size: 16px; color:#fff;" x-text="showMotivation"></span>
                                </div>
                            </template>
                        </div>
                    </template>

                </div>
            `;
        }
    }
);