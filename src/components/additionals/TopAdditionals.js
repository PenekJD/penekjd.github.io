class TopAdditionals extends HTMLElement {
    constructor() {
        super();

        const component = function(){
            let curDate = new Date();
            return {
                daysPower: 7,
                curDate: curDate,
                loaded: false,
                data: {},
                previousLevelScore: 0,
                nextLevelScore: null,
                score: 0,
                level: 0,
                lastAbstract: 0,
                lastAssessment: 0,
                levels: [
                    { title: 'Newbie', icon: '🐣', score: 0 },
                    { title: 'Beginner', icon: '🐥', score: 20 },
                    { title: 'You know something', icon: '🐢', score: 40 },
                    { title: 'You could find the Żabką', icon: '🐸', score: 70 },
                    { title: 'Walky-Talky', icon: '🐵', score: 100 },
                    { title: 'Good-looking', icon: '🦉', score: 150 },
                    { title: 'Tigerrr', icon: '🐯', score: 250 },
                    { title: 'Stunning', icon: '🦄', score: 400 },
                ],

                init(){
                    this.addHookEvents();
                },

                sortByStrDate(data, field){
                    return data.sort( (a,b) => {
                        let compA = a[field] ? a[field] : 1;
                        let compB = b[field] ? b[field] : 0;
                        return new Date(compB) - new Date(compA);
                    });
                },

                countDaysDiff(from, to){
                    to = to ? to : this.curDate;
                    const lastDate = new Date(from);
                    let diffTime =  Math.abs(this.curDate - lastDate);
                    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    return diffDays;
                },

                claculateScore(){
                    if (!this.data.words_pares) { return; }
                    this.resetScore();
                    let daysPower = this.daysPower;
                    let self = this;
                    let data = this.data.words_pares;
                    data = this.sortByStrDate(data, 'date');
                    this.checkAbstractFillLastDate(data[0].date);
                    data = this.sortByStrDate(data, 'last_check');
                    this.checkAssessmentLastDate(data[0].last_check);

                    function returnMePowerDays(num){
                        return num > daysPower ? daysPower : num;
                    }

                    let allStrings = data.length;
                    let negatives = 0;
                    data.forEach( el => {
                        if ( !el.average_score ) { return; }
                        if ( self.data.selectedTopic && (self.data.selectedTopic !== el.selectedTopic) ) { return; }
                        let days = returnMePowerDays(el.date ? this.countDaysDiff(el.date) : daysPower);
                        let assessmentDays = returnMePowerDays(el.last_check ? this.countDaysDiff(el.last_check) : daysPower);
                        days = days - assessmentDays;
                        days = days < 1 ? 1 : days;
                        let elScore = el.average_score * days;
                        self.score += elScore;
                    });
                    this.calculateLevel();
                    this.loaded = true;
                },

                calculateLevel(){
                    let self = this;
                    let daysPower = this.daysPower;
                    function calcScore(num){
                        return num * daysPower * 4; /* 4 - max evaluation in assessment */
                    }
                    this.levels.forEach( ( lvl, idx ) => {
                        let plank = calcScore( lvl.score );
                        if ( self.score >= plank ) {
                            self.previousLevelScore = calcScore(lvl.score);
                            self.level = idx;
                            self.nextLevelScore = self.levels[idx+1] ? calcScore(self.levels[idx+1].score) : null;
                        }
                    });
                },

                resetScore(){
                    this.previousLevelScore = 0;
                    this.nextLevelScore = null;
                    this.score = 0;
                    this.level = 0;
                    this.lastAbstract = 0;
                    this.lastAssessment = 0;
                },

                calcLvlPrcntsStyle(){
                    return ( ( (this.score-this.previousLevelScore)*100 ) / (this.nextLevelScore-this.previousLevelScore) )+'%';
                },

                checkAssessmentLastDate(lastDateStr){
                    this.lastAssessment = this.countDaysDiff(lastDateStr)-1;
                    this.lastAssessment = this.lastAssessment ? this.lastAssessment : 0;
                },

                checkAbstractFillLastDate(lastDateStr){
                    this.lastAbstract = this.countDaysDiff(lastDateStr)-1;
                    this.lastAbstract = this.lastAbstract ? this.lastAbstract : 0;
                },

                addHookEvents(){
                    let self = this;
                    window.addEventListener('app-updated', function(e) {
                        if (e.detail && e.detail.data) {
                            self.data = e.detail.data;
                            self.claculateScore();
                        }
                    });
                }
            }
        }

        this.innerHTML = /*html*/`
            <div x-data="${component}">
                <template x-if="loaded">
                    <div class="top_additionals_block">
                        <div class="top_additionals" x-bind:title="levels[level].title + ' ('+score+')'">
                            <div class="t-a_row">
                                <span>Level:</span>
                                <span x-text="level"></span>
                            </div>
                            <template x-if="nextLevelScore">
                                <div class="level-indicator">
                                    <div x-bind:style=" { width: calcLvlPrcntsStyle() } "></div>
                                </div>
                            </template>
                            <div class="t-a_row">
                                <span>Last abstract fill:</span>
                                <span x-text="lastAbstract+' day'+(lastAbstract!==1?'s':'')+' ago'"></span>
                            </div>
                            <div class="t-a_row">
                                <span>Last assessment:</span>
                                <span x-text="lastAssessment+' day'+(lastAssessment!==1?'s':'')+' ago'"></span>
                            </div>
                        </div>
                        <span class="row-icon" x-text="levels[level].icon"></span>
                    </div>
                </template>     
            </div>       
        `;
    }
}
$tv.setComponent(TopAdditionals);