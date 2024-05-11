//Import all components
// tv.js will only load what is needed

/*
 * Add line bellow if You want to load every components on every page
 * $tv.setConfig({ renderAll: true }); 
 */
$tv.import({ define: 'app-header', file: '/src/components/Header'});
$tv.import({ define: 'app-footer', file: '/src/components/Footer'});
$tv.import({ define: 'app-hello', file: '/src/components/homepage/Hello'});
$tv.import({ define: 'app-about', file: '/src/components/about/AboutContent'});