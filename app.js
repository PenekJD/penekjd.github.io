//Import all components
// ezland.js will only load what is needed

$ez.setConfig({ waitForEveryone: false });
$ez.import({ define: 'site-datahandler', file: '/src/components/additionals/DataHandler'});
$ez.import({ define: 'site-top-additionals', file: '/src/components/additionals/TopAdditionals'});
$ez.import({ define: 'site-menu', file: '/src/components/SiteMenu'});
$ez.import({ define: 'site-main-page', file: '/src/components/MainPage'});
$ez.import({ define: 'site-footer', file: '/src/components/Footer'});
$ez.import({ define: 'site-assessment', file: '/src/components/pages/Assessment'});
$ez.import({ define: 'site-datacontroll', file: '/src/components/pages/DataControll'});
$ez.import({ define: 'site-button', file: '/src/components/additionals/Button'});
$ez.import({ define: 'words-list', file: '/src/components/additionals/WordsList'});
$ez.import({ define: 'site-minieditor', file: '/src/components/additionals/MiniEditor'});


// Service Worker for PWA cache
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
            .then(reg => console.log('✅ Service Worker has been registered!', reg.scope))
            .catch(err => console.log('⚠️ Service Worker: Something was going wrong...', err));
    });
}