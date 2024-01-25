# ManifestCheck
A simple example of checking a manifest using a schema and Azure OpenAI  

_Please note all provided manifests and schemas are examples only and do not follow any standards._

## Getting Started
Before running the app, make sure to configure the following environment variables (eg in .env):
```
AOAI_ENDPOINT=https://example.openai.azure.com/
AOAI_KEY=example123
AOAI_DEPLOYMENT_CHAT=gpt-4
```
Ensure the `AOAI_DEPLOYMENT_CHAT` is set to the model deployment name you wish to use. GPT-4 1106-Preview is recommended so you can use json_output response format and configurable seed.

To run the sample, cd into the src directory and pass in the manifest you'd like to check as an argument, eg:  
`node index.js .\exampleManifest.yaml`

The example manifest has a few items commented out, you can use this to test the validation.

The AI validator is set to treat anything found as an issue, in a production system these may be treated as warnings instead.

## Validation Types

### Validation-Schema
Checks the provided manifest against a schema.
 - [base-schema.json](src/schema/base-schema.json) - The base object that links to all resource-specific schemas
 - [vm-0.0.1-schema.json](src/schema/vm-0.0.1-schema.json) - A sample VM schema with required fields
 - [sqldb-0.0.1-schema.json](src/schema/sqldb-0.0.1-schema.json) - A sample database schema

### Validation-AI
Checks the provided manifest using Azure OpenAI Chat Completion.  
A system message is provided to detail both what to check and the output format. The schema is provided as a tool message.

## Example Schema Details:
```YAML
FrontEnd:
  kind: VM/0.0.1
  name: Application Front End
  location: Azure/Sub1/Rg1/AustraliaEast
  spec:
    os: Windows/Generic
    vcpu: 4
    memory: 16
    disk: 128
  dependencies:
  - BackEnd
  - //vm219209
BackEnd:
  kind: VM/0.0.1
  name: Application Front End
  location: Azure/Sub1/Rg1/AustraliaEast
  spec:
    os: Linux/Generic
    vcpu: 4
    disk: 128
    memory: 16
Database:
  kind: SQLDB/0.0.1
  name: Database
  location: Azure/Sub1/Rg1/AustraliaEast
  spec:
    version: "12.0"
    size: 128
```