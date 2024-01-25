import { OpenAIClient, AzureKeyCredential } from '@azure/openai'
import { getMinifiedSchema } from './validation-schema.js';

export async function validateAI(rawManifest) {
    const client = new OpenAIClient(process.env.AOAI_ENDPOINT, new AzureKeyCredential(process.env.AOAI_KEY));
    const deploymentId = process.env.AOAI_DEPLOYMENT_CHAT;

    const messages = [
        { role: "system", content: `
            You are a helpful assistant designed to spot mistakes in manifest files.
            You should identify any logical or naming mistakes in the manifest.
            You can ignore any comments unless they explicitly conflict with the manifest.
            Your response should be a json object with a list of issues under the key "issues", containing the content under "content" and issue as a string under "issue".
            If there are duplicate issues, only return the most relevant one.
            Eg: {"issues": [{"content": "name:", "issue": "The manifest is missing a name"}]}
            If there are no issues, return an empty list under the key "issues".
            Eg: {"issues": []}
            `.trim()},
        { role: "function", content: getMinifiedSchema(), name: "schema"},
        { role: "user", content: rawManifest }
    ];

    const response = await client.getChatCompletions(deploymentId, messages, { maxTokens: 400, seed: 801, responseFormat: { "type": "json_object" }});

    const issues = JSON.parse(response.choices[0].message.content).issues;

    console.log(issues);
}