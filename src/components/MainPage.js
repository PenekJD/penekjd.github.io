$tv.setComponent(
    class MainPage extends HTMLElement {
        constructor() {
            super();

            // const content = this.innerHTML;
    
            const component = function(){
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

                    addHookEvents(){
                        let self = this;
                        window.addEventListener('app-updated', function(e){
                            if (e.detail && e.detail.data) {
                                self.data = { ...self.data, ...e.detail.data };
                            }
                            self.selectedTopic =  self.data.selectedTopic ?  self.data.selectedTopic*1 : 0;
                        });
                    }
                }
            }
            
            this.innerHTML = /*html*/`
                <div x-data="${component}">
                    <div class="row-between w-full">
                        <h2>Abstract</h2>
                        <template x-if="data.availableTopics.length">
                            <div class="row-between">
                                <select x-model="selectedTopic" @change="callUpdate()">
                                    <template x-for="topic in data.availableTopics">
                                        <option :value="topic.id"
                                                x-text="topic.title"
                                                :selected=" topic.id === selectedTopic ">
                                        </option>
                                    </template>
                                </select>
                                <button style="font-size:8px;" x-on:click="addNewTopic()">ADD TOPIC</button>
                            </div>
                        </template>
                    </div>
                    <template x-if="alert">
                        <div style="color:#f00; position:relative; z-index:10; background-color:#faa; padding:10px;" 
                             x-html="'ENTER: '+alert"></div>
                    </template>
                    <div class="abstract_input_field">
                        <input @keyup.enter="handleEnter()" 
                               x-model="currentInput"
                               type="text"
                               placeholder="Enter 'Translation +++ Fraze' and press Enter"
                               style="margin-bottom:0px;"
                        />
                    </div>
                    <button style="width:100%;" @click="handleEnter()">Save</button>
                </div>
            `;
        }
    }
);