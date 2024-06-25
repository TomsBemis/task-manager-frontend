export class IdGeneratorService {

    private nextId: number = 0;

    public generateId() : number {
        ++this.nextId;
        return this.nextId;
    }
}