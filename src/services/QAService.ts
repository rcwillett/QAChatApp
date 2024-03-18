import { Message, QA } from "../classes";
import { ElasticSearchService } from "../dataServices";

export class QAService {
    private elasticSearchService: ElasticSearchService;

    constructor(elasticSearchService: ElasticSearchService) {
        this.elasticSearchService = elasticSearchService;
    }

    init = async () => {
        const qaDBExists = await this.elasticSearchService.checkIndexExists('qa');
        if (!qaDBExists) {
            await this.elasticSearchService.createIndex('qa', '1', {
                id: '1',
                question: "Does this test work?",
                answer: "Yes"
            });
        }
    };

    saveQA = async (data: QA) => {
        await this.elasticSearchService.indexMessage('qa', data.id, data);
    };

    checkForAnswer = async (question: string) => {
        const results = await this.elasticSearchService.search({
            index: "qa",
            min_score: 0.8,
            sort: {
                "_score": "desc"
            },
            query: {
                match: {
                    question
                }
            }
        });
        if (results && results && results.hits && results.hits.total && results.hits.total.value > 0) {
            return results.hits.hits[0]._source.answer;
        }
    };
}