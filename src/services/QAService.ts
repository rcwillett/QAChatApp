import { QA } from "../classes";
import { ElasticSearchService } from "../dataServices";

export class QAService {
    private elasticSearchService: ElasticSearchService;
    private qaIndexName = 'qa';

    constructor(elasticSearchService: ElasticSearchService) {
        this.elasticSearchService = elasticSearchService;
    }

    init = async () => {
        const qaDBExists = await this.elasticSearchService.client.indices.exists({ index: this.qaIndexName });
        if (!qaDBExists) {
            await this.elasticSearchService.client.indices.create({
                index: this.qaIndexName,
                body: {
                    mappings: {
                        properties: {
                            question: {
                                type: "text"
                            },
                            questionVector: {
                                type: "dense_vector",
                                dims: 1536
                            },
                            answer: {
                                type: "text"
                            }
                        }
                    }
                }
            });
        }
    };

    saveQA = async (qa: QA) => {
        await this.elasticSearchService.client.index({
            index: this.qaIndexName,
            document: qa,
        });
    };

    checkForAnswer = async (questionEmbedding: number[]) => {
        const results = await this.elasticSearchService.client.search({
            index: this.qaIndexName,
            query: {
                script_score: {
                    query: {match_all: {}},
                    script: {
                        source: "cosineSimilarity(params.query_vector, 'questionVector') + 1",
                        params: {"query_vector": questionEmbedding }
                    },
                    min_score: 1.8
                }
            }
        });
        if (
            results &&
            results.hits &&
            results.hits.hits &&
            results.hits.hits.length > 0 &&
            results.hits.hits[0]
        ) {
            return (results.hits.hits[0]._source as QA).answer;
        }
    };
}