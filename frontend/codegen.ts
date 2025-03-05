import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: [
        {
            "http://localhost:3000/graphql": {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            },
        },
    ],
    documents: ["src/**/*.tsx","src/**/*.ts"],
    generates: {
        "./src/__generated__/": {
            preset: "client",
            presetConfig: {
                gqlTagName: "gql"
            }
        },
        "./src/__generated__/types.ts": {
            plugins: ["typescript", "typescript-operations"]
        },
    },
    ignoreNoDocuments: true,
};

export default config;
