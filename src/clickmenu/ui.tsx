import * as React from "react";
import Application from "../app";
import { ApplicationSelectionEventArgs } from "../events";

import './style/index.less';

interface ClickMenuProps {
    application: Application;
}

interface ClickMenuState {
    xPosition: number;
    yPosition: number;
    visible: boolean;
}

class ClickMenu extends React.Component<ClickMenuProps, ClickMenuState> {
    private _application: Application;
    constructor(props: ClickMenuProps) {
        super(props);
        this._application = props.application;
        this.state = {
            xPosition: 0,
            yPosition: 0,
            visible: false
        };
    }

    public componentDidMount(): void {
        this._application.listenSelectionAdd(this._onSelectionAdded);
        this._application.listenSelectionRemove(this._onSelectionRemoved);
    }

    private _onSelectionAdded = (args: ApplicationSelectionEventArgs) => {
        this._updateMenu(args.event);
    };

    private _onSelectionRemoved = (args: ApplicationSelectionEventArgs) => {
        this._updateMenu(args.event);
    };

    private _updateMenu = (event: MouseEvent) => {
        const { clientX, clientY } = event;

        this.setState({
            xPosition: clientX + 10,
            yPosition: clientY + 10,
            visible: this._application.selections.length > 0
        });
    };

    private _rotate = (direction: number) => {
        const angle = direction > 0 ? -Math.PI / 4 : Math.PI / 4;
        this._application.selections.forEach((item) => {
            item.mesh.rotateY(angle);
        });
    };

    private _scale = (direction: number) => {
        const delta: number = direction > 0 ? 2 : 0.5;
        this._application.selections.forEach((item) => {
            const {x, y, z} = item.mesh.scale;
            item.mesh.scale.set(x * delta, y * delta, z * delta);
        });
    };

    private _move = (direction: number) => {
        const delta: number = direction > 0 ? -5 : 5;
        this._application.selections.forEach((item) => {
            item.mesh.position.z = item.mesh.position.z + delta;
        });
    };

    render(): JSX.Element {
        const { xPosition, yPosition, visible } = this.state;

        return <>
            <div className="j3d-clickmenu" style={{
                display: visible ? 'block' : 'none',
                left: xPosition,
                top: yPosition
            }}>
                <div className="menu-container">
                    <div className="menu-item" title="左移" onClick={() => {
                        this._move(-1);
                    }}>
                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    </div>
                    <div className="menu-item" title="右移" onClick={() => {
                        this._move(1);
                    }}>
                        <i className="fa fa-arrow-right" aria-hidden="true"></i>
                    </div>
                    <div className="menu-item" title="放大一倍" onClick={() => {
                        this._scale(1);
                    }}>
                        <i className="fa fa-plus" aria-hidden="true"></i>
                    </div>
                    <div className="menu-item" title="缩小一倍" onClick={() => {
                        this._scale(-1);
                    }}>
                        <i className="fa fa-minus" title="逆时针转体45°" aria-hidden="true"></i>
                    </div>
                    <div className="menu-item" onClick={() => {
                        this._rotate(1);
                    }}>
                        <i className="fa fa-undo" title="顺时针转体45°" aria-hidden="true"></i>
                    </div>
                    <div className="menu-item" onClick={() => {
                        this._rotate(-1);
                    }}>
                        <i className="fa fa-repeat" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
        </>
        ;
    }
}

export class ClickMenuUI {
    public static render(application: Application): JSX.Element {
        return <ClickMenu key={"j3d-view-clickmenu"} application={application} />;
    }
}