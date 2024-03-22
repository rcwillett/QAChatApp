import { Client } from '@elastic/elasticsearch';
import fs from 'fs';

class ElasticSearchService {
    public client: Client;

    constructor() {

        let auth;
        if(process.env.ELASTIC_SEARCH_API_KEY &&  process.env.ELASTIC_SEARCH_API_KEY_ID){
            auth = {
                apiKey: {
                    id: process.env.ELASTIC_SEARCH_API_KEY_ID,
                    api_key: process.env.ELASTIC_SEARCH_API_KEY
                }
            };
        } else if (process.env.ELASTIC_SEARCH_USERNAME && process.env.ELASTIC_SEARCH_PASSWORD){
            auth = {
                username: process.env.ELASTIC_SEARCH_USERNAME,
                password: process.env.ELASTIC_SEARCH_PASSWORD
            };
        } else {
            throw Error("No authentication provided for ElasticSearch");
        }

        let tls;
        if (process.env.ELASTIC_SEARCH_TLS_CERT_PATH) {
            tls = {
                ca: fs.readFileSync(process.env.ELASTIC_SEARCH_TLS_CERT_PATH),
                rejectUnauthorized: false
            };
        }
        
        this.client = new Client({
            node: process.env.ELASTIC_SEARCH_ORIGIN || 'https://localhost:9200',
            auth,
            tls
        });
    }
};

export { ElasticSearchService };