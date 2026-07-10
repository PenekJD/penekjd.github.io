class MiniEditor extends EzAlpineHTMLElement {

    ALPINE_COMPONENT_KEY = 'initMiniEditorComponent';

    ELEMENT_ATTRIBUTES = [{ 'x-bind' : 'eventListeners' }]

    EZ_HTML = /*html*/`
    <template x-if="active">
        <section class="mini-editor-block">
            <div class="mini-editor-backdrop" @click="$dispatch('dispatch-mini-editor', null)"></div>
            <div class="mini-editor-container">
                <h2 style="margin-top:0;">🚧 Mini Editor</h2>
                <div>
                    <div class="input-label">
                        <label>Native language</label>
                        <input x-model="objectLinkToEdit.translate" />
                    </div>
                    <div class="input-label white">
                        <label>Target Language to study</label>
                        <input x-model="objectLinkToEdit.lang" />
                    </div>
                </div>
                <div class="flex-row justify-center">
                    <button @click="updateList()" title="Update">🔧 Update corrections</button>
                </div>
            </div>
        </section>
    </template>
    `

    initMiniEditorComponent() {
        return {
            active: false,
            objectLinkToEdit: null,
            updateList() {
                this.$dispatch('update-words-list');
                this.$dispatch('dispatch-mini-editor', null);
            },
            eventListeners: {
                ['@dispatch-mini-editor.window'](e) {
                    if (!e || !e.detail) {
                        this.active = false;
                        this.objectLinkToEdit = null;
                        return;
                    }
                    this.objectLinkToEdit = e.detail;
                    this.active = true;
                }
            }
        }
    }
}
$ez.setComponent(MiniEditor);
