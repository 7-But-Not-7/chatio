
class CustomLocalStorage {
    private readonly storage: Storage
    constructor(){
        this.storage = localStorage
    }

    set(key: string, value: {[key: string]: unknown}) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    get<T>(key: string): T | null {
        const value = this.storage.getItem(key);
        if(value){
            return JSON.parse(value);
        }
        return null;
    }
}

export const customLocalStorage = new CustomLocalStorage();