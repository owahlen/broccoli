import * as THREE from 'three';

// The recursive function to create the broccoli-like structure
export function createBroccoli(size: number, depth: number): THREE.Object3D {
    const rootObject = new THREE.Object3D();
    const material = new THREE.MeshPhongMaterial({color: 0x228b22, shininess: 30});

    // The recursive function to create a branch with a cylinder and a sphere
    function createBranch(parentObject: THREE.Object3D, currentSize: number, currentDepth: number): void {
        if (currentDepth === 0) {
            return;
        }

        // Create the cylinder
        const cylinderHeight = currentSize * 2.5;
        const cylinderGeometry = new THREE.CylinderGeometry(currentSize, currentSize, cylinderHeight, 32);
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, material);

        // Position the cylinder so its base is at the parent's origin
        cylinderMesh.position.y = cylinderHeight / 2;
        parentObject.add(cylinderMesh);

        // Create the sphere at the end of the cylinder
        const sphereGeometry = new THREE.SphereGeometry(currentSize, 32, 32);
        const sphereMesh = new THREE.Mesh(sphereGeometry, material);

        // Position the sphere at the end of the cylinder
        sphereMesh.position.y = cylinderHeight;
        parentObject.add(sphereMesh);

        // Determine the number of new branches (4 to 5)
        const numBranches = Math.floor(Math.random() * 2) + 4;

        // Define the range of angles for the new branches (30 to 60 degrees)
        const minAngle = THREE.MathUtils.degToRad(30);
        const maxAngle = THREE.MathUtils.degToRad(40);

        // Recursively add smaller branches from the sphere's position
        for (let i = 0; i < numBranches; i++) {
            const branch = new THREE.Object3D();

            // Calculate the angle to evenly distribute branches on a circle
            const circleAngle = (Math.PI * 2 / numBranches) * i;

            // Calculate a random angle between 30 and 60 degrees
            const tiltAngle = Math.random() * (maxAngle - minAngle) + minAngle;

            // Position the new branch on the circle and rotate it
            branch.position.set(
                Math.cos(circleAngle) * currentSize,
                0,
                Math.sin(circleAngle) * currentSize
            );

            // Rotate the branch to face outwards and tilt it
            branch.lookAt(new THREE.Vector3(0, 0, 0));
            branch.rotation.y += Math.PI; // Face outwards
            branch.rotateOnAxis(new THREE.Vector3(1, 0, 0), tiltAngle); // Tilt the branch

            // Position the new branch at the sphere's location
            // Here we add the crucial change: copy the position to start from the parent sphere
            branch.position.copy(sphereMesh.position);

            const newSize = currentSize * 0.77; // Make each new branch smaller

            createBranch(branch, newSize, currentDepth - 1);
            parentObject.add(branch);
        }
    }

    createBranch(rootObject, size, depth);
    return rootObject;
}