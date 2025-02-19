$tv.setComponent(
    class DataHandler extends HTMLElement {
        constructor() {
            super();
    
            // const content = this.innerHTML ? this.innerHTML : '';

            const component = function(){
                return {
                    storageId: 'app_data',
                    data: {},

                    init(){
                        this.addHookEvents();
                        $nextTick(() => {
                            this.readStorage(); 
                        });
                    },

                    saveStorage(){
                        window.localStorage.setItem( this.storageId, JSON.stringify(this.data) );
                        this.callUpdate();
                    },

                    readStorage(){
                        let dataStr = window.localStorage.getItem(this.storageId);
                        if (!dataStr) { return; }
                        this.data = JSON.parse(dataStr);
                        this.callUpdate();
                    },

                    callUpdate(){
                        let self = this;
                        window.dispatchEvent( new CustomEvent( 'app-updated', { detail: { data: self.data } } ) );
                    },

                    addHookEvents(){
                        let self = this;
                        window.addEventListener('data-save-storage', function(e){
                            if (e.detail && e.detail.data) {
                                self.data = { ...self.data, ...e.detail.data };
                                self.saveStorage();
                            }
                        });
                    }
                }
            }
    
            this.innerHTML = /*html*/`
                <div x-data="${component}"></div>
            `;
        }
    }
);