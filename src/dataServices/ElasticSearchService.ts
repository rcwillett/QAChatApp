import { Client } from '@elastic/elasticsearch';
import fs from 'fs';

class ElasticSearchService {
    private client: Client;

    constructor() {
        this.client = new Client({
            node: process.env.ELASTIC_SEARCH_ORIGIN || 'https://localhost:9200',
            auth: {
                username: process.env.ELASTIC_SEARCH_USERNAME || "",
                password: process.env.ELASTIC_SEARCH_PASSWORD || "",
                // apiKey: {
                //     id: process.env.ELASTIC_SEARCH_ID || "",
                //     api_key: process.env.ELASTIC_SEARCH_API_KEY || ""
                // }
            },
            tls: {
                ca: fs.readFileSync('./certificates/http_ca.crt'),
                rejectUnauthorized: false
            }
        });
    }

    public async createIndex(index: string, document: any): Promise<void> {
        await this.client.index({
            index,
            document
        });
    }

    public async checkIndexExists(index: string): Promise<boolean> {
        return await this.client.indices.exists({
            index: index
        });
    }

    public async indexMessage(index: string, body: any): Promise<any> {
        return await this.client.index({
            index,
            body
        });
    }

    public async search(searchRequest: any): Promise<any> {
        return await this.client.search(searchRequest);
    }
};

const elasticSearchService = new ElasticSearchService();

export { elasticSearchService, ElasticSearchService };