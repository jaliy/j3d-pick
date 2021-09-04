import Application from "../app";
import { ApplicationEvent } from "../events";

export abstract class ViewComponent {
    private _application: Application;

    constructor(application: Application) {
        this._application = application;
    }

    protected get application(): Application {
        return this._application;
    }
    public abstract type(): string;

    public abstract onInit(): ViewComponent;

    public abstract render(): JSX.Element;
}