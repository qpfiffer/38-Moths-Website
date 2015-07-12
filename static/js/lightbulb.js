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
    var geometry;
    var material;

    var front_normal = new THREE.Vector3( 0, 0, 1 );
    var back_normal = new THREE.Vector3( 0, 0, -1 );
    var v1, v2, v3;

    var hed_y =  4.5;
    var top_x =  6.0;
    var top_y =  5.5;
    var mid_x =  2.3;
    var mid_y =  1.2;
    var bot_x =  4.2;
    var bot_y = -1.5;

    // Left wing
    geometry = new THREE.Geometry();

    // Front top left wing
    v1 = new THREE.Vector3(     0, hed_y, 0);
    v2 = new THREE.Vector3(-top_x, top_y, 0);
    v3 = new THREE.Vector3(-mid_x, mid_y, 0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 0, 1, 2, front_normal) );

    // Back top left wing
    v1 = new THREE.Vector3(-mid_x, mid_y, 0.0001);
    v2 = new THREE.Vector3(-top_x, top_y, 0.0001);
    v3 = new THREE.Vector3(     0, hed_y, 0.0001);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 3, 4, 5, back_normal) );

    // Front bottom left wing
    v1 = new THREE.Vector3(     0, hed_y, 0);
    v2 = new THREE.Vector3(-bot_x, bot_y, 0);
    v3 = new THREE.Vector3(     0,     0, 0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 6, 7, 8, front_normal) );

    // Back bottom left wing
    v1 = new THREE.Vector3(     0,     0, 0.0001);
    v2 = new THREE.Vector3(-bot_x, bot_y, 0.0001);
    v3 = new THREE.Vector3(     0, hed_y, 0.0001);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 9, 10, 11, back_normal) );

    material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    this.left_wing = new THREE.Mesh( geometry, material );
    scene.add(this.left_wing);

    // Right wing
    geometry = new THREE.Geometry();

    // Front top right wing
    v1 = new THREE.Vector3(mid_x, mid_y, 0);
    v2 = new THREE.Vector3(top_x, top_y, 0);
    v3 = new THREE.Vector3(    0, hed_y, 0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 0, 1, 2, front_normal) );

    // Back top right wing
    v1 = new THREE.Vector3(    0, hed_y, 0.0001);
    v2 = new THREE.Vector3(top_x, top_y, 0.0001);
    v3 = new THREE.Vector3(mid_x,     0, 0.0001);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 3, 4, 5, back_normal) );

    // Front bottom right wing
    v1 = new THREE.Vector3(    0,     0, 0);
    v2 = new THREE.Vector3(bot_x, bot_y, 0);
    v3 = new THREE.Vector3(    0, hed_y, 0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 6, 7, 8, front_normal) );

    // Back bottom right wing
    v1 = new THREE.Vector3(    0, hed_y, 0.0001);
    v2 = new THREE.Vector3(bot_x, bot_y, 0.0001);
    v3 = new THREE.Vector3(    0,     0, 0.0001);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 9, 10, 11, back_normal) );

    material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    this.right_wing = new THREE.Mesh( geometry, material );
    scene.add(this.right_wing);

    this.velocity = new THREE.Vector3(0.1, 0.1, 0);
    this.left_wing.position.set(0, 0, 0);
    this.right_wing.position.set(0, 0, 0);
    this.body_vector = new THREE.Vector3(0, 1, 0);
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
