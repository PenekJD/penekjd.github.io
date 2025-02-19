$tv.setComponent(
    class Button extends HTMLElement {
        constructor() {
            super();
    
            const content = this.innerHTML ? this.innerHTML : 'Button';
    
            this.innerHTML = /*html*/`
                <button>${content}</button>
            `;
        }
    }
);