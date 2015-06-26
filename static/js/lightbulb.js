// Setup
var renderer = null;
var canvas = document.getElementById("lightbulb-canvas");
canvas.width  = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

function webglAvailable() {
    try {
        return !!( window.WebGLRenderingContext && (
                    canvas.getContext( 'webgl' ) ||
                    canvas.getContext( 'experimental-webgl' ) )
                );
    } catch ( e ) {
        return false;
    }
}

// Renderer
if ( webglAvailable() ) {
    renderer = new THREE.WebGLRenderer({"canvas": canvas});
} else {
    renderer = new THREE.CanvasRenderer({"canvas": canvas});
}
renderer.setSize( canvas.width, canvas.height );
renderer.setClearColor( 0 );
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;

// Camera
camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 100000 );
camera.position.x = 1200;
camera.position.y = 1000;
camera.lookAt({
  x: 0,
  y: 0,
  z: 0
});

// Scene
var scene = new THREE.Scene();

// Cube & Ground
var geometry = new THREE.BoxGeometry( 100, 100, 100 );
var material = new THREE.MeshLambertMaterial( { color: 0x0aeedf } );
var cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
cube.position.x = 0;
cube.position.y = 100;
cube.position.z = 0;
//scene.add( cube );

var geometry = new THREE.PlaneGeometry( 500, 500 );
var material = new THREE.MeshPhongMaterial({ color: 0x6C6C6C });
var ground = new THREE.Mesh( geometry, material );
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
//scene.add( ground );

// Lights
scene.add(new THREE.AmbientLight(0));

var light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
light.position.set( 300, 400, 50 );
//light.multiplyScalar(1.3);
light.castShadow = true;
//light.shadowCameraVisible = true;
light.shadowMapWidth = 512;
light.shadowMapHeight = 512;

var d = 200;

light.shadowCameraLeft = -d;
light.shadowCameraRight = d;
light.shadowCameraTop = d;
light.shadowCameraBottom = -d;

light.shadowCameraFar = 1000;
light.shadowDarkness = 0.2;

scene.add( light );

// Moths
var Moth = function() {
    var geometry = new THREE.BoxGeometry( 10, 10, 10 );
    var material = new THREE.MeshLambertMaterial( { color: 0x0aeedf } );
    this.object = new THREE.Mesh( geometry, material );
    this.object.x = 0;
    this.object.y = 100;
    this.object.z = 0;
    this.velocity = new THREE.Vector3(1, 1, 1);
    scene.add(this.object);
}

Moth.prototype.update = function() {
    this.object.position.add(this.velocity);
    this.velocity.add(new THREE.Vector3(-Math.random() + 0.5, -Math.random() + 0.5, -Math.random() + 0.5));
    this.velocity.normalize();
}

var moth = new Moth();

// Update & Render
function render() {
    update();
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}
render();

function update() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;

    var timer = Date.now() * 0.0002;
    camera.position.x = Math.cos(timer) * 1000;
    camera.position.z = Math.sin(timer) * 1000;
    camera.lookAt(scene.position);

    moth.update();
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    var parent_ele = document.getElementById("lander");
    canvas.width = parent_ele.offsetWidth;
    canvas.height = parent_ele.offsetHeight;

    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();

    renderer.setSize( canvas.width, canvas.height );
}
