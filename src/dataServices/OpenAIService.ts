import OpenAIApi from 'openai';
import { Embedding } from 'openai/resources';

class OpenAIService {
    private openAIApi: OpenAIApi;

    constructor() {
        this.openAIApi = new OpenAIApi({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    getEmbedding = async (input: string) => {
        // Get embedding for input using OpenAI api
        const { data } = await this.openAIApi.embeddings.create({
            model: 'text-embedding-ada-002',
            input,
        });
        return data && data[0] && data[0].embedding ? data[0].embedding : [];
    };
}

export { OpenAIService };