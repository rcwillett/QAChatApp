import { Client } from '@elastic/elasticsearch';
import fs from 'fs';

class ElasticSearchService {
    public client: Client;

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
};

export { ElasticSearchService };