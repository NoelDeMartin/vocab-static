import chalk from 'chalk';
import { basename, dirname, extname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { turtleToQuadsSync } from '@noeldemartin/solid-utils';
import type { Quad } from 'rdf-js';

export function projectPath(path: string): string {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    return resolve(__dirname, '../../', path);
}

export function getDirectoryFiles(directory: string): string[] {
    directory = directory.slice(-1) === '/' ? directory : `${directory}/`;

    return readdirSync(projectPath(directory)).map(file => projectPath(`${directory}${file}`));
}

export function readTurtleFile(file: string): Quad[] {
    const turtle = readFileSync(projectPath(file)).toString();

    return turtleToQuadsSync(turtle);
}

export function filename(path: string): string {
    const name = basename(path);
    const extension = extname(path);

    return extension ? name.slice(0, -extension.length) : name;
}

export function writeFile(file: string, contents: string): void {
    file = projectPath(file);

    if (!existsSync(dirname(file))) {
        mkdirSync(dirname(file));
    }

    writeFileSync(file, contents);
}

export function removeFile(file: string): void {
    file = projectPath(file);

    if (!existsSync(file)) {
        return;
    }

    rmSync(file, { recursive: true });
}

export function log(message: string): void {
    // eslint-disable-next-line no-console
    console.log(chalk.green(message));
}
