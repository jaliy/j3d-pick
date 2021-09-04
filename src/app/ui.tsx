import * as React from "react";
import { render } from "react-dom";
import Application from ".";

import './style/index.less';

interface AppUIProps {
    application: Application;
}

interface AppUIState {
}

export class AppUI extends React.Component<AppUIProps, AppUIState> {
    private _application: Application;
    constructor(props: AppUIProps) {
        super(props);
        this._application = props.application;
    }

    render(): JSX.Element {
        return (
            <>
                <div className="j3d-layout">
                    {
                        this._application.views.map((item) => {
                            return item.render();
                        })
                    }
                </div>
            </>
        );
    }
}

export class ApplicationUI {
    public static render(application: Application): void {
        render(<AppUI application={ application } />, document.getElementById("j3d-app"));
    }
}