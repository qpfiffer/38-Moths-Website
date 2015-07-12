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

// Scene
var scene = new THREE.Scene();

// Camera
camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 100000 );
camera.position.set(0, 50, 300);
camera.lookAt(scene.position);

// Candle
var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
var material = new THREE.MeshLambertMaterial( {color: 0xffff00} );
var candle = new THREE.Mesh( geometry, material );
candle.position.add( new THREE.Vector3(0, -20, 0) );
scene.add( candle );

var light = new THREE.PointLight( 0xdfebff, 1 );
light.position.set( 0, 20, 0 );
light.castShadow = true;
scene.add( light );

var ambi_light = new THREE.AmbientLight( 0x101010 ); // soft white light
scene.add( ambi_light );

// Super simple glow effect
var spriteMaterial = new THREE.SpriteMaterial( {
    map: new THREE.ImageUtils.loadTexture( '/static/img/glow.png' ),
    color: 0xffffff, transparent: false, blending: THREE.AdditiveBlending
});
var glow = new THREE.Sprite( spriteMaterial );
glow.scale.set(20, 20, 1.0);
glow.position.set(0, -6, 10);
scene.add(glow);

// Moths
var Moth = function() {
    this.create_mesh();
    this.velocity = new THREE.Vector3(0, 0, 1);
    this.object.position.set(0, 0, 0);
    this.body_vector = new THREE.Vector3(0, 1, 0);
}

Moth.prototype.create_mesh = function() {
    var geometry = new THREE.Geometry();
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );

    var front_normal = new THREE.Vector3( 0, 0, 1 );
    var back_normal = new THREE.Vector3( 0, 0, -1 );
    var v1, v2, v3;

    function v( x, y, z ) {
        geometry.vertices.push( new THREE.Vector3( x, y, z ) );
    }

    function f( a, b, c ) {
        geometry.faces.push( new THREE.Face3( a, b, c ) );
    }

    v(  0.0,  1.5, -0.000001); var head_frn = 0;
    v(  0.0,  1.5,  0.000001); var head_bak = 1;
    v(  0.0, -1.5, -0.000001); var tail_frn = 2;
    v(  0.0, -1.5,  0.000001); var tail_bak = 3;
    v( -5.0,  3.0,  0.0);      var top_left = 4;
    v( -4.0, -1.0,  0.0);      var mid_left = 5;
    v( -4.5, -2.5,  0.0);      var bot_left = 6;
    v(  5.0,  3.0,  0.0);      var top_rght = 7;
    v(  4.0, -1.0,  0.0);      var mid_rght = 8;
    v(  4.5, -2.5,  0.0);      var bot_rght = 9;

    // Back left wing
    f( head_bak, top_left, mid_left );
    f( head_bak, mid_left, tail_bak );
    f( tail_bak, mid_left, bot_left );

    // Back right wing
    f( head_bak, mid_rght, top_rght );
    f( head_bak, tail_bak, mid_rght );
    f( tail_bak, bot_rght, mid_rght );

    // Front left wing
    f( head_frn, top_left, mid_left );
    f( head_frn, mid_left, tail_frn );
    f( tail_frn, mid_left, bot_left );

    // Front right wing
    f( head_frn, top_rght, mid_rght );
    f( head_frn, mid_rght, tail_frn );
    f( tail_frn, mid_rght, bot_rght );

    this.object = new THREE.Mesh( geometry, material );
    scene.add(this.object);
}

Moth.prototype.update = function() {
    // move
    this.left_wing.position.add(this.velocity);
    this.right_wing.position.add(this.velocity);

    // flap
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(this.body_vector, 0.3);
    this.left_wing.matrix.multiply(rotObjectMatrix);
    this.left_wing.rotation.setFromRotationMatrix(this.left_wing.matrix);

    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(this.body_vector, -0.3);
    this.right_wing.matrix.multiply(rotObjectMatrix);
    this.right_wing.rotation.setFromRotationMatrix(this.right_wing.matrix);

    // randomly change heading
    var rand = function() { return -Math.random() + 0.5 };
    this.velocity.add( new THREE.Vector3( rand(), rand(), rand() ) );
    this.velocity.normalize();
}

var moths = [];
for (var i = 0; i < 38; i++) { moths[i] = new Moth(); }

// Update & Render
function render() {
    update();
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}
render();

function update() {
    for (var i in moths) { moths[i].update(); }
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
onWindowResize();
