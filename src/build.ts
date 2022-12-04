import { filename, getDirectoryFiles, log, readTurtleFile, removeFile, writeFile } from './lib/io';

removeFile('dist');

const vocabs = getDirectoryFiles('vocabs');

for (const vocab of vocabs) {
    const name = filename(vocab);
    const quads = readTurtleFile(vocab);
    const rdfsClasses = quads
        .filter(
            quad => quad.predicate.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' &&
                quad.object.value === 'http://www.w3.org/2000/01/rdf-schema#Class',
        )
        .map(quad => quad.subject.value);

    writeFile(`dist/${name}.html`, `
        <html>
            <head>
                <title>${name}</title>
            </head>
            <body>
                <h1>${name}</h1>

                <ul>
                    ${rdfsClasses.map(rdfsClass => `<li>${filename(rdfsClass)}</li>`).join('\n')}
                </ul>
            </body>
        </html>
    `);

    log('Done!');
}
