export class QA {
    question: string;
    questionVector: number[];
    answer: string;
    constructor(question: string, answer: string, questionVector: number[]) {
        this.question = question;
        this.questionVector = questionVector;
        this.answer = answer;
    }
}