import Application from "../app";
import { ViewComponent } from "../core";
import { ApplicationSelectionEventArgs } from "../events";
import { ClickMenuUI } from "./ui";

export class ClickMenuView extends ViewComponent {
    private static ID = "j3d.view.clickmenu";

    constructor(application: Application) {
        super(application);
    }

    public type(): string {
        return ClickMenuView.ID;
    }

    public onInit(): ClickMenuView {
        return this;
    }

    public render(): JSX.Element {
        return ClickMenuUI.render(this.application);
    }
}