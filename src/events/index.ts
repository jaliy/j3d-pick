import { EventEmitter } from "events";
import { J3DSelection } from "../core";

export enum ApplicationEventType {
    SELECTION_ADD = "j3d.pick.application.selection.add",
    SELECTION_REMOVE = "j3d.pick.application.selection.remove",
    APPLICAIOTION_READY = "j3d.pick.application.ready",
    APPLICAIOTION_DESTORY = "j3d.pick.application.destory"
}

export interface ApplicationEventArgs {
}

export interface ApplicationReadyEventArgs {
    canvas: HTMLCanvasElement;
    domElement: HTMLDivElement;
}

export interface ApplicationSelectionEventArgs {
    event: MouseEvent;
    selections: J3DSelection[];
}

export type ApplicationEventListener = (args: ApplicationEventArgs) => void;

export class ApplicationEvent extends EventEmitter {

    public emitApplicationReady(args: ApplicationReadyEventArgs): void {
        this.emit(ApplicationEventType.APPLICAIOTION_READY, args);
    }

    public emitApplicationDestory(): void {
        this.emit(ApplicationEventType.APPLICAIOTION_DESTORY);
    }

    public emitSelectionAdd(args: ApplicationSelectionEventArgs): void {
        this.emit(ApplicationEventType.SELECTION_ADD, args);
    }

    public emitSelectionRemove(args: ApplicationSelectionEventArgs): void {
        this.emit(ApplicationEventType.SELECTION_REMOVE, args);
    }

    /**
     * 监听HTML UI渲染完成时间
     * @param listener 事件
     */
    public listenApplicationReady(listener: ApplicationEventListener): void {
        this.on(ApplicationEventType.APPLICAIOTION_READY, listener);
    }

    /**
     * 移除监听HTML UI渲染完成事件
     * @param listener 事件
     */
    public unlistenApplicationReady(listener: ApplicationEventListener): void {
        this.on(ApplicationEventType.APPLICAIOTION_READY, listener);
    }

    /**
     * 监听app退出时间
     * @param listener 事件
     */
    public listenApplicationDestory(listener: ApplicationEventListener): void {
        this.on(ApplicationEventType.APPLICAIOTION_DESTORY, listener);
    }

    /**
     * 移除监听app退出事件
     * @param listener 事件
     */
    public unlistenApplicationDestory(listener: ApplicationEventListener): void {
        this.on(ApplicationEventType.APPLICAIOTION_DESTORY, listener);
    }

    /**
     * 监听选中添加事件
     * @param listener 事件
     */
    public listenSelectionAdd(listener: ApplicationEventListener): void {
        this.on(ApplicationEventType.SELECTION_ADD, listener);
    }

    /**
     * 移除监听选中添加事件
     * @param listener 事件
     */
    public unlistenSelectionAdd(listener: ApplicationEventListener): void {
        this.off(ApplicationEventType.SELECTION_ADD, listener);
    }

    /**
     * 监听选中移除事件
     * @param listener 事件
     */
    public listenSelectionRemove(listener: ApplicationEventListener): void {
        this.on(ApplicationEventType.SELECTION_REMOVE, listener);
    }

    /**
     * 移除监听选中移除事件
     * @param listener 事件
     */
    public unlistenSelectionRemove(listener: ApplicationEventListener): void {
        this.off(ApplicationEventType.SELECTION_REMOVE, listener);
    }
}