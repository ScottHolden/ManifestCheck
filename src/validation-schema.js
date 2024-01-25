import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import Ajv from 'ajv';
import * as yaml from 'js-yaml';

const schemaFolder = "./schema";
const schemaSuffix = "schema.json";
const schemaId = "http://example.com/schemas/base-schema.json#";

function findFiles(folder, suffix) {
    return readdirSync(folder)
            .filter(x => x.endsWith(suffix))
            .map(x => path.join(folder, x));
}

function loadSchemaJson() {
    const schemaFiles = findFiles(schemaFolder, schemaSuffix);
    return schemaFiles.map(x => JSON.parse(readFileSync(x, 'utf8')));
}

function loadSchema() {
    const schemas = loadSchemaJson();
    const ajv = new Ajv({schemas: schemas, allErrors: true, discriminator: true});
    return ajv.getSchema(schemaId);
}

export function getMinifiedSchema() {
    const schemas = loadSchemaJson();
    return JSON.stringify(schemas);
}

export function validateSchema(rawManifest) {
    const manifest = yaml.load(rawManifest);
    const schema = loadSchema();

    const valid = schema(manifest);
    if (!valid) console.log(schema.errors);

    return schema.errors?.map(x=>x.message) ?? [];
}