import { readFileSync } from 'fs';
import { validateSchema } from './validation-schema.js';
import { validateAI } from './validation-ai.js';
import 'dotenv/config'

async function main() {
    if (process.argv < 3 || !process.argv[2]) {
        console.log('USAGE: node index.js (file).yaml');
        return;
    }
    const filename = process.argv[2];

    // Exit code 0 if valid, 1 if invalid
    if (await validateManifest(filename)) {
        console.log("Manifest valid.");
        return 1;
    } else {
        console.error("Manifest invalid.");
        return 0;
    }
}

async function validateManifest(filename) {
    const rawManifest = readFileSync(filename, 'utf8');

    console.log("Validating schema...");
    const schemaIssues = validateSchema(rawManifest);

    console.log("Validating with Azure OpenAI...");
    const aiIssues = await validateAI(rawManifest);
    
    return schemaIssues.length === 0 && aiIssues.length === 0;
}

// Entry point
process.exitCode = await main();