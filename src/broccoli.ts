import * as THREE from 'three';

// The recursive function to create a self-similar structure
export function createBroccoli(size: number, depth: number): THREE.Object3D {
    const rootObject = new THREE.Object3D();
    const material = new THREE.MeshPhongMaterial({ color: 0x228b22, shininess: 30 });

    function createBroccoliPart(parentObject: THREE.Object3D, currentSize: number, currentDepth: number): void {
        if (currentDepth === 0) {
            return;
        }

        const geometry = new THREE.SphereGeometry(currentSize, 32, 32);
        const mesh = new THREE.Mesh(geometry, material);
        parentObject.add(mesh);

        const numBranches = Math.floor(Math.random() * 4) + 3;

        for (let i = 0; i < numBranches; i++) {
            const branch = new THREE.Object3D();
            const angle = (Math.PI * 2 / numBranches) * i;
            const distance = currentSize * 1.5;

            branch.position.set(
                Math.cos(angle) * distance,
                Math.sin(angle) * distance,
                0
            );
            branch.lookAt(new THREE.Vector3(0, 0, 0));
            branch.rotateX(Math.PI / 2);

            branch.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * currentSize * 0.5,
                (Math.random() - 0.5) * currentSize * 0.5,
                (Math.random() - 0.5) * currentSize * 0.5
            ));
            branch.rotation.y += (Math.random() - 0.5) * 0.5;

            const newSize = currentSize * 0.5;
            createBroccoliPart(branch, newSize, currentDepth - 1);
            mesh.add(branch);
        }
    }

    createBroccoliPart(rootObject, size, depth);
    return rootObject;
}