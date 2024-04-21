import * as THREE from 'three';

import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';

import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

console.log(THREE);

function main() {

    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const aspect = 2; 
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 5);
    camera.position.z = 2;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const scene = new THREE.Scene();

    const light = new THREE.DirectionalLight(0xFFFFFF, 3);
    light.position.set(-1, 2, 4);
    scene.add(light);

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 16);
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);

    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

	function makeInstance( geometry, color, x ) {

		const material = new THREE.MeshPhongMaterial( { color } );

		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		cube.position.x = x;

		return cube;

	}

    

    function makeTexturedInstance( geometry, x ) {
        const loader = new THREE.TextureLoader();
        const materials = [
            new THREE.MeshBasicMaterial({map: loadColorTexture('Alan.PNG')}),
            new THREE.MeshBasicMaterial({map: loadColorTexture('Charlie.PNG')}),
            new THREE.MeshBasicMaterial({map: loadColorTexture('Glep.PNG')}),
            new THREE.MeshBasicMaterial({map: loadColorTexture('Pim.PNG')}),
            new THREE.MeshBasicMaterial({map: loadColorTexture('Shrimp.PNG')}),
            new THREE.MeshBasicMaterial({map: loadColorTexture('Smormu.PNG')}),
        ];

        const cube = new THREE.Mesh( geometry, materials );

        function loadColorTexture( path ) {
            const texture = loader.load( path );
            texture.colorSpace = THREE.SRGBColorSpace;
            return texture;
        }

        const mesh = new THREE.Mesh(geometry, materials);
        scene.add(mesh);
        mesh.position.x = x;
        return mesh;
    }

    {
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        mtlLoader.load('iphone X.mtl', (mtl) => {
          mtl.preload();
          objLoader.setMaterials(mtl);
          objLoader.load('iphone X.obj', (root) => {
            root.scale.set(0.5, 0.5, 0.5);
            root.position.z -= 1;
            root.position.y += 0.2;
            scene.add(root);
          });
        });
    }


	const cubes = [
		makeTexturedInstance( geometry, 0 ),
		makeInstance(sphereGeometry, 0xaa8844, -2),
		makeInstance(cylinderGeometry, 0x8844aa, 2)
	];

	function render( time ) {

		time *= 0.001; // convert time to seconds

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
