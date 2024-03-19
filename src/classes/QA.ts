export class QA {
    question: string;
    answer: string;
    questionVector: number[];
    constructor(question: string, answer: string, questionVector: number[]) {
        this.question = question;
        this.answer = answer;
        this.questionVector = questionVector;
    }
}