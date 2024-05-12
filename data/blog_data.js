window.dispatchEvent(
    new CustomEvent(
        'blog-data',
        {
            detail:
            [
                {
                    title: "Languager: My new App",
                    desc: `
                        <p>This my new Web-App for language lessons:
                        <br><a href="https://sillymilkycow.github.io/">Languager v1</a></p>
                    `,
                    img: "/data/images/languager.jpg",
                    date: "2024-4-21"
                },
                {
                    title: "tv.js render!",
                    desc: `
                        <p>Let me introduce You my own client-side render library: <strong>tv.js</strong>!</p>
                        <p>A lightweight library for Client-Side rendering.</p>
                        <p>The main task that this library solves is the reuse of components.</p>
                        <p>The HTML document is used as the main layout for the components.
                        You create basic html documents and use js components. Components can be used not only in an HTML document, but also inside other components.</p>
                        <p>TV.JS analyzes the components that should be used on the page and connects only those scripts that are necessary.</p>
                    `,
                    img: "/data/images/tvjs.jpg",
                    date: "2024-4-21"
                }
            ]
        }
    )
);