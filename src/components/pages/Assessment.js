class Assessment extends TvAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initAssessment';

    TV_HTML = /*html*/`
        <div>

            <div class="title">
                <h2>Assessment</h2>
                <template x-if="isByDate || isTillRemember || isByWeak">
                    <div class="active-filters-bar">
                        <template x-if="isByWeak">
                            <span>🤕</span>
                        </template>
                        <template x-if="isTillRemember">
                            <span>🐵</span>
                        </template>
                        <template x-if="isByDate">
                            <div class="filter-date">
                                <span>🗓️</span>
                                <select x-model="selectedDate" @change="changePreparation()">
                                    <template x-for="el in datesArr">
                                        <option x-bind:value="el.date" x-text="showDataAsString(el.date)"></option>
                                    </template>
                                </select>
                            </div>
                        </template>
                    </div>
                </template>
            </div>

                        <div class="assessment-block">
                <template x-if="checkObj">
                    <div class="suggested-translation" x-text="checkObj.translate"></div>
                </template>
                <input style="font-size:18px;"
                        x-model="currentInput" 
                        @keyup.enter="checkInput()"
                        x-bind:placeholder=" !checkObj ? 'Press Enter to start' : 'Enter translation' "
                />
                <button class="show-mobile round-btn-flow" 
                    style="top: 22px; right: -5px;"
                    x-on:click="checkInput()">Go</button>
            </div>

            <template x-if="evaluated && wordsEvaluation.length">
                <div class="evaluation_block">
                    <div class="check_words_row_anchor">
                        <div class="check_words_row">
                            <template x-for="wordObj in wordsEvaluation">
                                <span x-bind:class="'check_word text-outline ' + ( wordObj.isPunct ? 'punct' : ('score_' + wordObj.score)) " 
                                    x-text="wordObj.word"
                                    x-bind:punct="wordObj.isPunct ? wordObj.word : null"
                                ></span>
                            </template>
                        </div>
                    </div>
                    <template x-if="currentEvaluation || currentEvaluation===0">
                        <div x-bind:class="'evaluation text-outline eval_score_'+currentEvaluation">
                            <span class="digit" x-text="currentEvaluation+1"></span>
                            <span style="font-size: 16px; color:#fff;" x-text="showMotivation"></span>
                        </div>
                    </template>
                </div>
            </template>

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
                <div style="width: 200px;">
                    <div class="display: flex; flex-wrap: nowrap; flex-direction:row; gap:5px; align-items:center;">
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

        </div>
    `;

    initAssessment() {
        let formatter = new Intl.DateTimeFormat('en-EN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        return {
            formatter: formatter,
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
            commonCorrections: {
                // be
                "i'm": "i am",
                "you're": "you are",
                "we're": "we are",
                "they're": "they are",
                "he's": "he is",
                "she's": "she is",
                "it's": "it is",
                "there's": "there is",
                "here's": "here is",
                // have
                "i've": "i have",
                "you've": "you have",
                "we've": "we have",
                "they've": "they have",
                "could've": "could have",
                "would've": "would have",
                "should've": "should have",
                "might've": "might have",
                "must've": "must have",
                // will
                "i'll": "i will",
                "you'll": "you will",
                "he'll": "he will",
                "she'll": "she will",
                "it'll": "it will",
                "we'll": "we will",
                "they'll": "they will",
                // negatives
                "aren't": "are not",
                "isn't": "is not",
                "wasn't": "was not",
                "weren't": "were not",
                "don't": "do not",
                "doesn't": "does not",
                "didn't": "did not",
                "haven't": "have not",
                "hasn't": "has not",
                "hadn't": "had not",
                "won't": "will not",
                "wouldn't": "would not",
                "shouldn't": "should not",
                "couldn't": "could not",
                "mightn't": "might not",
                "mustn't": "must not",
                "can't": "cannot",
                "cannot": "can not",
                "shan't": "shall not"
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
            isTillRemember: true,
            data: {},
            randomStarted: false,
            usedRandomIndexes: [],

            init(){
                this.receiveData();
                this.addHookEvents();
                this.$watch('type', (value, oldValue) => {
                    this.changePreparation();
                });
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
                    if (this.randomStarted) {
                        this.arrayForRender.splice(this.selectedIdx, 1)[0];
                    } 
                    this.randomStarted = true;
                    if (!this.arrayForRender.length) {
                        this.changePreparation();
                    }
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
                const self = this;
                function clearAndPrepareStrToArr(str){
                    return str
                        .trim()
                        .toLowerCase()
                        .replace(/[.,;?!:&%$#@*()-+><]/g, '')
                        .split(' ')
                        .reduce((acc, word) => {
                            if (!word) return acc;
                            if (!self.commonCorrections[word]) {
                                acc.push(word);
                                return acc;
                            }
                            let tempArr = self.commonCorrections[word].split(' ');
                            return [...acc, ...tempArr];
                        }, []);
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

                    /** Rollback to origin view
                     * Buggy in some languages
                     * 
                    let wordTokens = originalLang.join(' ').match(/\p{L}+|[^\p{L}\s]/gu);
                    let resultBuffer = [];
                    let arrIndex = 0;
                    for (let token of wordTokens) {
                        if (/[^\p{L}\s]/u.test(token)) {
                            resultBuffer.push({ word:token, isPunct: true });
                        } else {
                            if (arrIndex >= this.wordsEvaluation.length) continue;
                            this.wordsEvaluation[arrIndex].word = token;
                            resultBuffer.push(this.wordsEvaluation[arrIndex]);
                            arrIndex++;
                        }
                    }
                    this.wordsEvaluation = resultBuffer;
                    */

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
                this.randomStarted = false;
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

            showDataAsString(dateStr) {
                let dateObj = new Date(dateStr);
                return this.formatter.format(dateObj);
            },

            callUpdate(){
                let self = this;
                this.$dispatch('data-save-storage', { data: self.data });
            },

            receiveData(data) {
                if (!data) {
                    this.data = window.globalConfig ? window.globalConfig.data : {};
                } else {
                    this.data = data;
                }
                this.data = data ? { ...this.data, ...data } : this.data;
                this.selectedTopic = this.data.selectedTopic ?  this.data.selectedTopic : 0;
                if (this.data.words_pares) {
                    this.prepareDatesArr();
                    this.prepareArrayForRender();
                    this.isComponentLoaded = true;
                }
            },

            addHookEvents(){
                let self = this;
                window.addEventListener('app-updated', function(e) {
                    if (self.isComponentLoaded || !e.detail || !e.detail.data) return;
                    self.receiveData(e.detail.data);
                });
                window.addEventListener('check_comp', function(){
                    console.log(self.data);
                })
            }
        }
    }
}
$tv.setComponent(Assessment);