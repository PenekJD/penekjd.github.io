//Import all components
// tv.js will only load what is needed

//$tv.setConfig({ renderAll: false });
$tv.import({ define: 'site-datahandler', file: '/src/components/additionals/DataHandler'});
$tv.import({ define: 'site-top-additionals', file: '/src/components/additionals/TopAdditionals'});
$tv.import({ define: 'site-menu', file: '/src/components/SiteMenu'});
$tv.import({ define: 'site-main-page', file: '/src/components/MainPage'});
$tv.import({ define: 'site-footer', file: '/src/components/Footer'});
$tv.import({ define: 'site-assessment', file: '/src/components/pages/Assessment'});
$tv.import({ define: 'site-datacontroll', file: '/src/components/pages/DataControll'});
$tv.import({ define: 'site-button', file: '/src/components/additionals/Button'});
$tv.import({ define: 'words-list', file: '/src/components/additionals/WordsList'});