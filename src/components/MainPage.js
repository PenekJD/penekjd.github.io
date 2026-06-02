
class MainPage extends TvAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initMainPage';

    TV_HTML = /*html*/`
        <div>
            <div class="row-between w-full">
                <span class="flex-row items-center gap-1">
                    <img class="icon" width="16" height="16" src="/data/svg/NotesBook.svg" alt="Progress">
                    <h2>Log</h2>
                </span>
                <template x-if="data && data.availableTopics && data.availableTopics.length">
                    <div class="row-between gap-1">
                        <select x-model="selectedTopic" @change="callUpdate()" title="Topic">
                            <template x-for="topic in data.availableTopics">
                                <option :value="topic.id"
                                        x-text="topic.title"
                                        :selected=" topic.id === selectedTopic ">
                                </option>
                            </template>
                        </select>
                        <button style="font-size:8px;" x-on:click="addNewTopic()">Add topic</button>
                    </div>
                </template>
            </div>
            <template x-if="alert">
                <div style="color:#f00; position:relative; z-index:10; background-color:#faa; padding:10px;"
                        data-testid="error-message"
                        x-html="'ENTER: '+alert"></div>
            </template>
            <div class="abstract_input_field">
                <input @keyup.enter="handleEnter()" 
                        x-model="currentInput"
                        type="text"
                        placeholder="Enter 'Translation +++ Fraze' and press Enter"
                        style="margin-bottom:0px;"
                />
                <button class="round-btn-flow" 
                    style="top:21px; right: -10px; font-size:10px;"
                    @click="handleEnter()">Save</button>
            </div>
        </div>
    `;

    initMainPage() {
        return {
            currentInput: '',
            alert: '',
            selectedTopic: 0,
            data: {
                selectedTopic: 0,
                availableTopics: [{ id: 0, title: 'No topic' }],
                words_pares: []
            },

            init(){
                this.receiveData();
                this.addHookEvents();
            },

            handleEnter(){
                let self = this;

                function handleSpaces(str){
                    return str.replace(/\s+/g, ' ');
                }

                this.currentInput = this.currentInput.trim();
                if ( !this.currentInput ) { return; }

                let difLangStr = this.currentInput.trim().split('+++');

                if (difLangStr.length<2) {
                    this.alert = 'Пример строки<b>+++</b>Exaple string'
                    setTimeout(()=>{
                        this.alert = '';
                    }, 3000);
                    return;
                }

                let myLang = difLangStr.length > 1 ? difLangStr[1].trim() : '';
                    difLangStr = difLangStr[0].trim();
                let curDate = new Date();
                    curDate = curDate.getFullYear()+'-'+(curDate.getMonth()+1)+'-'+curDate.getDate();

                this.data.words_pares.push(
                    { translate: handleSpaces(difLangStr), lang: handleSpaces(myLang), date: curDate, selectedTopic: self.selectedTopic }
                );

                this.clearInput();
                this.callUpdate();
                this.toggleOtherComponents();
            },

            clearInput(){
                this.currentInput = '';
            },

            callUpdate(){
                let self = this;
                self.data.selectedTopic = self.selectedTopic*1;
                window.dispatchEvent( new CustomEvent( 'data-save-storage', { detail: { data: self.data } } ) );
            },

            addNewTopic(){
                let newTopic = prompt('Enter new topics name');
                newTopic = newTopic ? newTopic.trim() : '';
                if (!newTopic) { return; }
                let newArr = [...this.data.availableTopics].sort( (a,b) => b.id-a.id );
                let newID = newArr[0].id+1;
                this.data.availableTopics.push({
                    id: newID,
                    title: newTopic
                });
                this.data.selectedTopic = newID;
                this.callUpdate();
            },

            receiveData(data) {
                if (!data) {
                    this.data = window.globalConfig ? window.globalConfig.data : this.data;
                } else {
                    this.data = data;
                }
                this.data = data ? { ...this.data, ...data } : this.data;
                this.selectedTopic =  this.data.selectedTopic ?  this.data.selectedTopic*1 : 0;
            },

            addHookEvents(){
                let self = this;
                window.addEventListener('app-updated', function(e){
                    if (!e.detail || !e.detail.data) return;
                    self.receiveData(e.detail.data);
                });
            },

            toggleOtherComponents() {
                window.dispatchEvent(new Event('toggle-words-list'))
            }
        }
    }
}
$tv.setComponent(MainPage);