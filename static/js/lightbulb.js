// http://park.org/Canada/Museum/insects/evolution/navigation.html

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

// Lightbulb
var light = new THREE.PointLight( 0xdfebff, 1.75 );
light.position.set( 0, 0, 0 );
light.castShadow = true;
scene.add( light );

// Moths
var Moth = function() {
    var geometry = new THREE.BoxGeometry( 10, 10, 10 );
    var material = new THREE.MeshLambertMaterial( { color: 0x0aeedf } );
    this.object = new THREE.Mesh( geometry, material );
    this.object.position = new THREE.Vector3(0, 100, 0);
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
