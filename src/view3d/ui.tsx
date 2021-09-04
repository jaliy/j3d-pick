import React = require("react");
import Application from "../app";

import "./style/index.less";

interface View3DCanvasProps {
    application: Application;
}

interface View3DCanvasState {
}

class View3DCanvas extends React.Component<View3DCanvasProps, View3DCanvasState> {
    private _domElement: HTMLDivElement;
    private _canvas: HTMLCanvasElement;
    private _application: Application;

    constructor(props: View3DCanvasProps) {
        super(props);
        this._application = props.application;
    }

    public componentDidMount(): void {
        this._application.emitApplicationReady({
            canvas: this._canvas, domElement: this._domElement
        });
    }

    public render(): JSX.Element {
        return <>
            <div className="j3d-view3d" ref={(domElement) => {
                this._domElement = domElement;
            }}>
                <canvas className="j3d-canvas" ref={(element) => {
                    this._canvas = element;
                }}></canvas>
            </div>
        </>;
    }
}

export class View3DUI {
    public static render(application: Application): JSX.Element {
        return <View3DCanvas key={"j3d-view-3d"} application={ application } />;
    }
}