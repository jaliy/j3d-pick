import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Material } from 'three';
import { J3DSelection, ViewComponent } from '../core';
import { View3DUI } from './ui';
import Application from '../app';
import { ApplicationReadyEventArgs } from '../events';

export class View3D extends ViewComponent {
    private static ID = "j3d.view.view3d";

    private _domContainer: HTMLDivElement;
    private _canvas: HTMLCanvasElement;

    private _renderer: THREE.WebGLRenderer;
    private _camera: THREE.Camera;
    private _scene: THREE.Scene;

    private _controls: OrbitControls;

    private _meshes: THREE.Object3D[] = [];
    private _objects: Map<string, THREE.Object3D> = new Map();

    private _meshOpacity: Map<string, number> = new Map();
    private _highlighted: Set<string> = new Set();
    private _selected: Set<string> = new Set();

    private _raycaster = new THREE.Raycaster();
    private _mousePoint: THREE.Vector2 = new THREE.Vector2();

    constructor(application: Application) {
        super(application);
    }

    public type(): string {
        return View3D.ID;
    }

    public onInit(): View3D {
        this.application.listenApplicationReady(this._init3DView);
        return this;
    }

    public render(): JSX.Element {
        return View3DUI.render(this.application);
    }

    private _init3DView = (args: ApplicationReadyEventArgs) => {
        const { canvas, domElement } = args;
        this._domContainer = domElement;
        this._canvas = canvas;
        this.start();
    };

    public start(): void {
        this._init3DScene();
        this._initMesh();
        this._initLight();
        this._loadMesh();
        this._initPick();

        window.requestAnimationFrame(this._animationFrame);
        window.onresize = this._onSizeChanged;
    }

    private _animationFrame = () => {
        window.requestAnimationFrame(this._animationFrame);
        if (this.application.renderNextFrame) {
            this._renderer.render(this._scene, this._camera);
        }
    };

    private _init3DScene(): void {
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color( 0xbbbbbb );

        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas
        });
        const { width, height } = this._domContainer.getBoundingClientRect();
        this._renderer.setSize( width, height);
        this._renderer.setPixelRatio( window.devicePixelRatio );
        this._renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this._renderer.toneMappingExposure = 1;
        this._renderer.outputEncoding = THREE.sRGBEncoding;

        this._camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this._camera.position.set(80, 60, 0);
        this._camera.lookAt(0,0,0);

        this._controls = new OrbitControls( this._camera, this._canvas );
        // optional
        this._controls.listenToKeyEvents( this._domContainer );
        // an animation loop is required when either damping or auto-rotation are enabled
        this._controls.enableDamping = true;
        this._controls.dampingFactor = 0.05;
        // this._controls.screenSpacePanning = false;
        // this._controls.minDistance = 50;
        // this._controls.maxDistance = 500;
        // this._controls.maxPolarAngle = Math.PI / 2;
    }

    private _initMesh(): void {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial( { color: 0xc20053 } );
        material.side = THREE.DoubleSide;
        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(-10, 5, -10);
        this._scene.add(mesh);
        this._meshes.push(mesh);
        this._objects.set(mesh.uuid, mesh);
    }

    private _loadMesh(): void {
        const loader = new GLTFLoader().setPath('assets/');
        loader.load( 'Soldier.glb', ( gltf: GLTF ) => {
            gltf.scene.position.set(10, 0, 20);
            gltf.scene.scale.set(20, 20, 20);
            gltf.scene.rotateY(- Math.PI / 2);
            // this._meshes.push(...gltf.scene.children);
            gltf.scene.traverse( ( object: THREE.Object3D ) => {
                if (object instanceof THREE.Object3D) {
                    object.castShadow = true;
                    this._meshes.push(object);
                    this._objects.set(object.uuid, gltf.scene);
                }
            } );
            this._scene.add( gltf.scene );
            this.application.renderNextFrame = true;
        } );
    }

    private _initLight(): void {
        const gridHelper = new THREE.GridHelper( 500, 10, 0xffffff, 0xffffff);
        const gridMaterial = gridHelper.material as Material;
        gridMaterial.opacity = 0.5;
        gridMaterial.depthWrite = false;
        gridMaterial.transparent = true;
        this._scene.add(gridHelper);
        const axes = new THREE.AxesHelper(100);
        this._scene.add(axes);

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 20, 0 );
        this._scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( -3, 10, -10 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = - 2;
        dirLight.shadow.camera.left = - 2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        this._scene.add(dirLight);
    }

    private _initPick(): void {
        this._domContainer.addEventListener("mousemove", this._onMouseMove);
        this._domContainer.addEventListener("click", this._onMouseClick);
    }

    private _onSizeChanged = () => {
        const { width, height } = this._domContainer.getBoundingClientRect();
        this._renderer.setSize(width, height);
        this.application.renderNextFrame = true;
    };

    private _onMouseClick = (event: MouseEvent): void => {
        this._mousePoint.x = event.clientX / this._domContainer.clientWidth * 2 - 1;
        this._mousePoint.y = - ( event.clientY / this._domContainer.clientHeight ) * 2 + 1;

        const intersects = this._intersectObjects();
        if (intersects.length > 0) {
            const mesh = intersects[0];
            const picked = this._objects.get(mesh.uuid);
            if (!this._selected.has(picked.uuid)) {
                // clear selections
                const uuids = Array.from(this._selected.values());
                const removedObjects = uuids.map((r) => this._objects.get(r));
                this._onSelectionRemoved(removedObjects, event);
                // add picked
                this._onSelectionAdded([picked], event);
            }
            this.application.renderNextFrame = true;
        } else {
            // clear selections
            const uuids = Array.from(this._selected.values());
            const removedObjects = uuids.map((r) => this._objects.get(r));
            this._onSelectionRemoved(removedObjects, event);
            this.application.renderNextFrame = true;
        }
    };

    private _onSelectionAdded = (objects: THREE.Object3D[], event: MouseEvent) => {
        if (objects.length > 0) {
            objects.forEach((object)  => {
                if (!this._selected.has(object.uuid)) {
                    this._selected.add(object.uuid);
                    if (this._highlighted.has(object.uuid)) {
                        return ;
                    }
                    const mesh = this._objects.get(object.uuid);
                    mesh.traverse((child: THREE.Object3D) => {
                        if (child instanceof THREE.Mesh && !this._meshOpacity.has(child.uuid)) {
                            const material = child.material as THREE.Material;
                            this._meshOpacity.set(child.uuid, material.opacity);
                            material.opacity = material.opacity / 3;
                            material.transparent = true;
                            material.needsUpdate = true;
                        }
                    });
                }
            });
            const selections = objects.map((mesh) => new J3DSelection(mesh));
            this.application.addSelections(selections);
            this.application.emitSelectionAdd({
                selections,
                event
            });
        }
    };

    private _onSelectionRemoved = (objects: THREE.Object3D[], event: MouseEvent) => {
        if (objects.length > 0) {
            objects.forEach((object)  => {
                this._selected.delete(object.uuid);
                if (this._highlighted.has(object.uuid)) {
                    return ;
                }
                const mesh = this._objects.get(object.uuid);
                mesh.traverse((child: THREE.Object3D) => {
                    if (child instanceof THREE.Mesh && this._meshOpacity.has(child.uuid)) {
                        const material = child.material as THREE.Material;
                        const opacity = this._meshOpacity.get(child.uuid);
                        this._meshOpacity.delete(child.uuid);
                        material.opacity = opacity;
                        material.transparent = false;
                        material.needsUpdate = true;
                    }
                });
            });
            const selections = objects.map((mesh) => new J3DSelection(mesh));
            this.application.removeSelections(selections);
            this.application.emitSelectionRemove({
                selections,
                event
            });
        }
    };

    private _onMouseMove = (event: MouseEvent): void => {
        this._mousePoint.x = event.clientX / this._domContainer.clientWidth * 2 - 1;
        this._mousePoint.y = - ( event.clientY / this._domContainer.clientHeight ) * 2 + 1;
        this._raycaster.setFromCamera( this._mousePoint, this._camera );
        const intersects = this._raycaster.intersectObjects( this._meshes );
        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            const picked = this._objects.get(mesh.uuid);
            if (!this._highlighted.has(picked.uuid)) {
                // clear highlighted
                const uuids = Array.from(this._highlighted.values());
                const removedObjects = uuids.map((r) => this._objects.get(r));
                this._onHighlightRemoved(removedObjects);
                // add picked
                this._onHighlightAdded([picked]);
            }
            this.application.renderNextFrame = true;
        } else {
            // clear highlighted
            const uuids = Array.from(this._highlighted.values());
            const removedObjects = uuids.map((r) => this._objects.get(r));
            this._onHighlightRemoved(removedObjects);
            this.application.renderNextFrame = true;
        }
    };

    private _intersectObjects(): THREE.Object3D[] {
        this._raycaster.setFromCamera( this._mousePoint, this._camera );
        const intersects = this._raycaster.intersectObjects( this._meshes );
        return intersects.map((item) => item.object);
    }

    private _onHighlightAdded = (objects: THREE.Object3D[]) => {
        if (objects.length > 0) {
            objects.forEach((object)  => {
                if (!this._highlighted.has(object.uuid)) {
                    this._highlighted.add(object.uuid);
                    if (this._selected.has(object.uuid)) {
                        return ;
                    }
                    const mesh = this._objects.get(object.uuid);
                    mesh.traverse((child: THREE.Object3D) => {
                        if (child instanceof THREE.Mesh) {
                            const material = child.material as THREE.Material;
                            this._meshOpacity.set(child.uuid, material.opacity);
                            material.opacity = material.opacity / 3;
                            material.transparent = true;
                            material.needsUpdate = true;
                        }
                    });
                }
            });
        }
    };

    private _onHighlightRemoved = (objects: THREE.Object3D[]) => {
        if (objects.length > 0) {
            objects.forEach((object)  => {
                this._highlighted.delete(object.uuid);
                if (this._selected.has(object.uuid)) {
                    return ;
                }
                const mesh = this._objects.get(object.uuid);
                mesh.traverse((child: THREE.Object3D) => {
                    if (child instanceof THREE.Mesh) {
                        const material = child.material as THREE.Material;
                        const opacity = this._meshOpacity.get(child.uuid);
                        this._meshOpacity.delete(child.uuid);
                        material.opacity = opacity;
                        material.transparent = false;
                        material.needsUpdate = true;
                    }
                });
            });
        }
    };
}