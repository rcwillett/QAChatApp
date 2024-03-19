import { QA } from "../classes";
import { ElasticSearchService } from "../dataServices";

export class QAService {
    private elasticSearchService: ElasticSearchService;

    constructor(elasticSearchService: ElasticSearchService) {
        this.elasticSearchService = elasticSearchService;
    }

    init = async () => {
        const qaDBExists = await this.elasticSearchService.checkIndexExists('qawithvectors');
        if (!qaDBExists) {
            await this.elasticSearchService.createIndex('qawithvectors', {
                document: {
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

    saveQA = async (data: QA) => {
        await this.elasticSearchService.indexMessage('qawithvectors', data);
    };

    checkForAnswer = async (questionEmbedding: number[]) => {
        const results = await this.elasticSearchService.search({
            index: "qawithvectors",
            query: {
                script_score: {
                    query: {match_all: {}},
                    script: {
                        source: "cosineSimilarity(params.query_vector, 'questionVector') + 1",
                        params: {"query_vector": questionEmbedding }
                    },
                }
            }
        });
        if (
            results &&
            results.hits &&
            results.hits.total &&
            results.hits.total.value > 0 &&
            results.hits.hits[0]._score > 1.75
        ) {
            return results.hits.hits[0]._source.answer;
        }
    };
}