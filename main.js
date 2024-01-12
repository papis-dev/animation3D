import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
/* 1ère partie */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//rendu, antialias pour eviter la pixelisation sur les bordures 
const renderer = new THREE.WebGLRenderer({
    antialias:true,
    //alpha:true, //couleur background
});
//couleur du background
//renderer.setClearColor(0x000000,0);
//taille du rendu
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

    //ajuste le ratio de pixels du rendu en fonction du ratio de pixels de l'écran.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //orbit qui permet de tourner l'écran
    const controls = new OrbitControls(camera, renderer.domElement);

/* 2ème partie */

//points particules 100 dans un bufferGeometry
const count = 100; //nbre de particules
const distance = 7; // distance entre les éléments
const circles = new Float32Array(count*3); //tableau des particules count*3 car chaque élément contient 3 coordonnées
const colors = new Float32Array(count*3);
for(let i = 0; i < colors.length; i++){ // ajouts des points
    circles[i]=THREE.MathUtils.randFloatSpread(distance * 7);
    colors[i] = Math.random();
}
const geometry = new THREE.BufferGeometry();//BufferGeometry pour une geometry quelconque
geometry.setAttribute("position",new THREE.Float32BufferAttribute(circles,3)); //ajout du tab circles dans la geometry
geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));
/*const material = [
    new THREE.MeshBasicMaterial( { color: "#049ef4" }),
    new THREE.MeshBasicMaterial( { color: "white" }),
    new THREE.MeshBasicMaterial( { color: "green" }),
    new THREE.MeshBasicMaterial( { color: "pink" }),
    new THREE.MeshBasicMaterial( { color: "yellow" }),
    new THREE.MeshBasicMaterial( { color: "red" }),
];*/

//charger une image pour remplacer les cubes

const textureLoader = new THREE.TextureLoader();
const img = textureLoader.load("/circle.png");

//points matériels pour spécifier les tailles et la couleur des points du cube
const pointMaterial = new THREE.PointsMaterial({
    
    vertexColors:true,
    size: 1.5,
    map:img, 
    transparent:true, //permet à l'image d'avoir un fond transparent. faut l'associer avec alphaTest. C'est alpha qui gère la transparence
    alphaTest:0.5
});
//points pour transformer la geometry en points
const points = new THREE.Points(geometry,pointMaterial);
const group = new THREE.Group(); // l'objectif est de mettre les points dans le groupe puis de faire un rotate pour que les points tournent autour de l'axe
group.add(points);

//relier les points avec des lignes
const lineMaterial = new THREE.LineBasicMaterial({
    color : "#888484",
    opacity:0.005
});
const lineObject = new THREE.Line(geometry,lineMaterial);
//group.add(lineObject);
scene.add(group);
scene.add(new THREE.AxesHelper(20));

/* camera */
camera.position.z = 30;
camera.position.y = 5;
camera.position.x = 5;

/* 3ème partie */

function animate() {
	//camera.lookAt(10,10,10); // regarder le centre de ma scène
    group.rotateY(0.01);
    controls.update(); // orbit
	renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

animate();
