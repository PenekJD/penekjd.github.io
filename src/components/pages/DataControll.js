$tv.setComponent(
    class DataControll extends HTMLElement {
        constructor() {
            super();

            $tv.bindComponent('initDataControll', function(){
                return {
                    data: null,
                    dataToImport: null,
                    init() {
                        this.addHookEvents();
                    },
                    addHookEvents(){
                        let self = this;
                        window.addEventListener('app-updated', function(e) {
                            if (e.detail && e.detail.data) {
                                self.data = e.detail.data;
                            }
                        });
                    },
                    exportData() {
                        let currentData = new Date();
                            currentData = currentData.toString();
                        const content = JSON.stringify(this.data);
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const fileName = 'languager_data_' + currentData.split(' ').slice(0,4).join('_') + '.json';

                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);

                        if (confirm('Are you sure you want to download the ' + fileName + ' file')) {
                            a.click();
                        }

                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    },
                    importData() {
                        if (!confirm('Are you sure you want to import data? Old data will be overwritten by new ones')) {
                            return;
                        }

                        window.dispatchEvent(
                            new CustomEvent('data-save-storage', {detail: {data: this.dataToImport}})
                        );

                        window.location.href = '/';
                    },
                    selectFile(element) {
                        let self = this;
                        let file = element.target.files[0];
                        if (!file) {
                            return;
                        }
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            if (!e.target.result) {
                                return;
                            }
                            self.dataToImport = JSON.parse(e.target.result);
                        };
                        reader.readAsText(file);
                    }
                }
            });

            this.innerHTML = /*html*/`
                <div x-data="$tv.initDataControll()">
                    <h1>Progress data</h1>
                    <table class="progress_table">
                        <tr>
                            <td><button @click="exportData()">Export</button></td>
                            <td>
                                <template x-if="data">
                                    <div>
                                        <template x-if="data.availableTopics">
                                            <code>
                                                <b>Topics:</b>
                                                <template x-for="topic in data.availableTopics">
                                                    <div :key="topic.id">
                                                        <span x-text="'- ' + topic.title"></span>
                                                    </div>
                                                </template>
                                            </code>
                                        </template>
                                        <template x-if="data.words_pares">
                                            <div style="margin-top:5px;">
                                                <div style="font-weight:bold;"
                                                     x-text="'Word phrases: ' + data.words_pares.length"></div>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button x-bind:disabled="!dataToImport ? true : false" 
                                        @click="importData()">Import</button>
                            </td>
                            <td>
                                <input x-ref="fileinput" type="file" @change="selectFile($event)"/>
                                <template x-if="dataToImport">
                                    <div>
                                        <template x-if="dataToImport.availableTopics">
                                            <code>
                                                <b>Topics:</b>
                                                <template x-for="topic in dataToImport.availableTopics">
                                                    <div :key="topic.id">
                                                        <span x-text="'- ' + topic.title"></span>
                                                    </div>
                                                </template>
                                            </code>
                                        </template>
                                        <template x-if="dataToImport.words_pares">
                                            <div style="margin-top:5px;">
                                                <div style="font-weight:bold;"
                                                     x-text="'Word phrases: ' + dataToImport.words_pares.length"></div>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </td>
                        </tr>
                    </table>
                </div>
            `;
        }
    }
);