export abstract class IApp {
    public abstract start(): void | Promise<void>;
    public abstract stop(): Promise<boolean>;
}