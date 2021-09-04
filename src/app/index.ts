import { ApplicationEvent } from "../events";
import { ApplicationUI } from "./ui";
import { View3D } from "../view3d";
import { ClickMenuView } from "../clickmenu";
import { J3DSelection, ViewComponent } from "../core";

export default class Application extends ApplicationEvent {
    private _views: ViewComponent[] = [];
    private _selections: Map<string, J3DSelection> = new Map();
    private _renderNextFrame: boolean = true;

    protected onInit(): void {
        this._addView(new View3D(this).onInit());
        this._addView(new ClickMenuView(this).onInit());
    }

    public get views(): ViewComponent[] {
        return this._views;
    }

    public get selections(): J3DSelection[] {
        return Array.from(this._selections.values());
    }

    public get renderNextFrame(): boolean {
        return this._renderNextFrame;
    }

    public set renderNextFrame(renderNextFrame: boolean) {
        this._renderNextFrame = renderNextFrame;
    }

    public start(): void {
        this.onInit();
        ApplicationUI.render(this);
    }

    private _addView(view: ViewComponent, prepend: boolean = false): void {
        if (this._views.includes(view)) {
            return ;
        }
        prepend ? this._views.unshift(view) : this._views.push(view);
    }

    public addSelections(selections: J3DSelection[]): void {
        selections.forEach((selection) => {
            if (!this._selections.has(selection.mesh.uuid)) {
                this._selections.set(selection.mesh.uuid, selection);
            }
        });
    }

    public removeSelections(selections: J3DSelection[]): void {
        selections.forEach((selection) => {
            if (this._selections.has(selection.mesh.uuid)) {
                this._selections.delete(selection.mesh.uuid);
            }
        });
    }
}