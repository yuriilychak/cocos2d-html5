export default class LoadError extends Error {
    #status: number;

    constructor(message: string, status: number) {
        super(message);
        this.#status = status;
    }

    get status(): number {
        return this.#status;
    }
}