export class J3DSelection {
    private _mesh: THREE.Object3D;

    constructor(selection: THREE.Object3D) {
        this._mesh = selection;
    }

    public get mesh(): THREE.Object3D {
        return this._mesh;
    }

    public equals(selection: J3DSelection): boolean {
        if (this._mesh.uuid === selection.mesh.uuid) {
            return true;
        }
        return false;
    }
}