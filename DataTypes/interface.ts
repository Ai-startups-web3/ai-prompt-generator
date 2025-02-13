
export interface Admin {
    username: string;
    password: string;
}

export interface Config {
    port: number;
    env: string;
    rootAdmin: string;
    rootPassword: string;
    blockchainOwnerPublicKey: string;
    pinataApiKey: string;
    pinataApiSecret: string;
    openAiApiKey:string;
    deepseekApiKey:string;
    geminiApiKey:string;
  }