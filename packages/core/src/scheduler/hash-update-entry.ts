import { MAX_POOL_SIZE } from './constants';
import type { ListEntry } from './list-entry';
import { log } from '../boot/debugger';

interface UpdateTarget {
    instanceId: number;
}

type UpdateCallback = (dt: number) => void;

export class HashUpdateEntry {
    static #pool: HashUpdateEntry[] = [];

    #list: ListEntry[] | null;
    #entry: ListEntry | null;
    #target: UpdateTarget | null;
    #callback: UpdateCallback | null;

    constructor(
        list: ListEntry[] | null,
        entry: ListEntry | null,
        target: UpdateTarget | null,
        callback: UpdateCallback | null,
    ) {
        this.#list = list;
        this.#entry = entry;
        this.#target = target;
        this.#callback = callback;
    }

    init(
        list: ListEntry[] | null,
        entry: ListEntry | null,
        target: UpdateTarget | null,
        callback: UpdateCallback | null,
    ): void {
        this.#list = list;
        this.#entry = entry;
        this.#target = target;
        this.#callback = callback;
    }

    clear(): void {
        this.#list = null;
        this.#entry = null;
        this.#target = null;
        this.#callback = null;
    }

    get list(): ListEntry[] | null {
        return this.#list;
    }

    get entry(): ListEntry | null {
        return this.#entry;
    }

    get target(): UpdateTarget | null {
        return this.#target;
    }

    get callback(): UpdateCallback | null {
        return this.#callback;
    }

    public setPriority(priority: number, paused: boolean, updateHashLocked: boolean): boolean {
        if (!this.#entry || this.#entry.priority === priority) {
            if (this.#entry) {
                this.#entry.markedForDeletion = false;
                this.#entry.paused = paused;
            }
            return false;
        }

        if (updateHashLocked) {
            log('warning: you CANNOT change update priority in scheduled function');
            this.#entry.markedForDeletion = false;
            this.#entry.paused = paused;
            return false;
        }

        return true;
    }

    static get(
        list: ListEntry[] | null,
        entry: ListEntry | null,
        target: UpdateTarget | null,
        callback: UpdateCallback | null,
    ): HashUpdateEntry {
        const result = HashUpdateEntry.#pool.pop();
        if (result) {
            result.init(list, entry, target, callback);
            return result;
        }
        return new HashUpdateEntry(list, entry, target, callback);
    }

    static put(entry: HashUpdateEntry): void {
        entry.clear();
        if (HashUpdateEntry.#pool.length < MAX_POOL_SIZE) {
            HashUpdateEntry.#pool.push(entry);
        }
    }
}
