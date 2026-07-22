import { MAX_POOL_SIZE } from './constants';

interface UpdateTarget {
    __instanceId: number;
}

type UpdateCallback = (dt: number) => void;

export class ListEntry {
    static #pool: ListEntry[] = [];

    #prev: ListEntry | null;
    #next: ListEntry | null;
    #callback: UpdateCallback | null;
    #target: UpdateTarget | null;
    #priority: number;
    #paused: boolean;
    #markedForDeletion: boolean;

    constructor(
        prev: ListEntry | null,
        next: ListEntry | null,
        callback: UpdateCallback | null,
        target: UpdateTarget | null,
        priority: number,
        paused: boolean,
        markedForDeletion: boolean,
    ) {
        this.#prev = prev;
        this.#next = next;
        this.#callback = callback;
        this.#target = target;
        this.#priority = priority;
        this.#paused = paused;
        this.#markedForDeletion = markedForDeletion;
    }

    init(
        prev: ListEntry | null,
        next: ListEntry | null,
        callback: UpdateCallback | null,
        target: UpdateTarget | null,
        priority: number,
        paused: boolean,
        markedForDeletion: boolean,
    ): void {
        this.#prev = prev;
        this.#next = next;
        this.#callback = callback;
        this.#target = target;
        this.#priority = priority;
        this.#paused = paused;
        this.#markedForDeletion = markedForDeletion;
    }

    clear(): void {
        this.#prev = null;
        this.#next = null;
        this.#callback = null;
        this.#target = null;
        this.#priority = 0;
        this.#paused = false;
        this.#markedForDeletion = false;
    }

    get prev(): ListEntry | null {
        return this.#prev;
    }

    get next(): ListEntry | null {
        return this.#next;
    }

    get callback(): UpdateCallback | null {
        return this.#callback;
    }

    get target(): UpdateTarget | null {
        return this.#target;
    }

    get priority(): number {
        return this.#priority;
    }

    get paused(): boolean {
        return this.#paused;
    }

    set paused(value: boolean) {
        this.#paused = value;
    }

    get markedForDeletion(): boolean {
        return this.#markedForDeletion;
    }

    set markedForDeletion(value: boolean) {
        this.#markedForDeletion = value;
    }

    public update(dt: number): void {
        if (!this.#paused && !this.#markedForDeletion) {
            this.#callback!(dt);
        }
    }

    static get(
        prev: ListEntry | null,
        next: ListEntry | null,
        callback: UpdateCallback | null,
        target: UpdateTarget | null,
        priority: number,
        paused: boolean,
        markedForDeletion: boolean,
    ): ListEntry {
        const result = ListEntry.#pool.pop();
        if (result) {
            result.init(prev, next, callback, target, priority, paused, markedForDeletion);
            return result;
        }
        return new ListEntry(prev, next, callback, target, priority, paused, markedForDeletion);
    }

    static put(entry: ListEntry): void {
        entry.clear();
        if (ListEntry.#pool.length < MAX_POOL_SIZE) {
            ListEntry.#pool.push(entry);
        }
    }
}
