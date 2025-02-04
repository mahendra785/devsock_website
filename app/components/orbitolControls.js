import * as THREE from 'three';
export default class CustomOrbitControls {
    constructor(camera, domElement) {
      this.camera = camera;
      this.domElement = domElement;
      this.target = new THREE.Vector3(0, 0, 0);
      this.enabled = true;
      this.enableDamping = true;
      this.dampingFactor = 0.05;
  
      // Rotation
      this.rotationSpeed = 1.0;
      this.rotateStart = new THREE.Vector2();
      this.rotateEnd = new THREE.Vector2();
  
      // Zoom
      this.zoomSpeed = 1.0;
      this.zoomScale = 1.0;
  
      // Pan
      this.panSpeed = 1.0;
      this.panStart = new THREE.Vector2();
      this.panEnd = new THREE.Vector2();
  
      this.initEventListeners();
    }
  
    initEventListeners() {
      this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
      this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
      this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));
    }
  
    onMouseDown(event) {
      if (!this.enabled) return;
  
      switch (event.button) {
        case 0: // Left mouse button (rotate)
          this.rotateStart.set(event.clientX, event.clientY);
          break;
        case 2: // Right mouse button (pan)
          this.panStart.set(event.clientX, event.clientY);
          break;
      }
    }
  
    onMouseMove(event) {
      if (!this.enabled) return;
  
      if (event.buttons === 1) { // Left mouse button pressed
        this.rotateEnd.set(event.clientX, event.clientY);
        const deltaX = this.rotateEnd.x - this.rotateStart.x;
        const deltaY = this.rotateEnd.y - this.rotateStart.y;
  
        // Rotate camera around target
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          this.camera.up,
          new THREE.Vector3(0, 1, 0)
        );
        const quaternionInverse = quaternion.clone().invert();
  
        const offset = this.camera.position.clone().sub(this.target);
        offset.applyQuaternion(quaternion);
  
        const spherical = new THREE.Spherical().setFromVector3(offset);
        spherical.theta -= deltaX * 0.01 * this.rotationSpeed;
        spherical.phi -= deltaY * 0.01 * this.rotationSpeed;
  
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
  
        offset.setFromSpherical(spherical);
        offset.applyQuaternion(quaternionInverse);
  
        this.camera.position.copy(this.target).add(offset);
        this.camera.lookAt(this.target);
  
        this.rotateStart.copy(this.rotateEnd);
      }
  
      if (event.buttons === 2) { // Right mouse button pressed
        this.panEnd.set(event.clientX, event.clientY);
        const deltaX = this.panEnd.x - this.panStart.x;
        const deltaY = this.panEnd.y - this.panStart.y;
  
        // Pan camera
        const offset = new THREE.Vector3();
        const eye = this.camera.position.clone().sub(this.target);
        const up = this.camera.up.clone();
        up.cross(eye.normalize());
  
        up.multiplyScalar(deltaY * 0.01 * this.panSpeed);
        offset.copy(up);
  
        const right = eye.clone().cross(this.camera.up).normalize();
        right.multiplyScalar(deltaX * 0.01 * this.panSpeed);
        offset.add(right);
  
        this.target.add(offset);
        this.camera.position.add(offset);
  
        this.panStart.copy(this.panEnd);
      }
    }
  
    onMouseUp() {
      // Reset interaction states if needed
    }
  
    onMouseWheel(event) {
      if (!this.enabled) return;
  
      // Zoom
      const delta = event.deltaY;
      this.zoomScale *= delta > 0 ? 0.9 : 1.1;
      this.zoomScale = Math.max(0.1, Math.min(10, this.zoomScale));
  
      const offset = this.camera.position.clone().sub(this.target);
      offset.multiplyScalar(this.zoomScale);
      this.camera.position.copy(this.target).add(offset);
    }
  
    update() {
      if (this.enableDamping) {
        // Add damping logic if needed
      }
    }
  
    dispose() {
      this.domElement.removeEventListener('mousedown', this.onMouseDown);
      this.domElement.removeEventListener('mousemove', this.onMouseMove);
      this.domElement.removeEventListener('mouseup', this.onMouseUp);
      this.domElement.removeEventListener('wheel', this.onMouseWheel);
    }
  }