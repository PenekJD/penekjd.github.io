//Import all components
// tv.js will only load what is needed

/* 
  Config:
    renderAll: boolean
        Set to TRUE for load the entire list of sources classes (regardless of whether there are elements on the page)
    waitForEveryone: boolean 
        Set to TRUE if you want $tv to render all components at once 
        All components will be loaded after the code is fully loaded,
        which will ensure that each component will have access to the other
*/
$tv.setConfig({ renderAll: false, waitForEveryone: false });

/* Import components */
$tv.import({ define: 'site-datahandler', file: '/src/components/additionals/DataHandler'});
$tv.import({ define: 'site-top-additionals', file: '/src/components/additionals/TopAdditionals'});
$tv.import({ define: 'site-menu', file: '/src/components/SiteMenu'});
$tv.import({ define: 'site-main-page', file: '/src/components/MainPage'});
$tv.import({ define: 'site-footer', file: '/src/components/Footer'});
$tv.import({ define: 'site-assessment', file: '/src/components/pages/Assessment'});
$tv.import({ define: 'site-datacontroll', file: '/src/components/pages/DataControll'});
$tv.import({ define: 'site-button', file: '/src/components/additionals/Button'});
$tv.import({ define: 'words-list', file: '/src/components/additionals/WordsList'});