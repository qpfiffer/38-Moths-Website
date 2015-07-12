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

var light = new THREE.PointLight( 0xdfebff, 1.75 );
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
    //var geometry = new THREE.BoxGeometry( 10, 10, 10 );
    var geometry = new THREE.Geometry();

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

    // Front top left wing
    v1 = new THREE.Vector3(-mid_x, mid_y, 0);
    v2 = new THREE.Vector3(-top_x, top_y, 0);
    v3 = new THREE.Vector3(     0, hed_y, 0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 0, 1, 2, front_normal) );

    // Back top left wing
    v1 = new THREE.Vector3(-mid_x, mid_y, 0.001);
    v2 = new THREE.Vector3(-top_x, top_y, 0.001);
    v3 = new THREE.Vector3(     0, hed_y, 0.001);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 3, 4, 5, back_normal) );

    // Front top right wing
    v1 = new THREE.Vector3(mid_x, mid_y, 0);
    v2 = new THREE.Vector3(top_x, top_y, 0);
    v3 = new THREE.Vector3(    0, hed_y, 0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 6, 7, 8, front_normal) );

    // Back top right wing
    v1 = new THREE.Vector3(mid_x,     0, 0.001);
    v2 = new THREE.Vector3(top_x, top_y, 0.001);
    v3 = new THREE.Vector3(    0, hed_y, 0.001);
    geometry.vertices.push(v3);
    geometry.vertices.push(v2);
    geometry.vertices.push(v1);
    geometry.faces.push( new THREE.Face3( 9, 10, 11, back_normal) );

    // Front bottom left wing
    v1 = new THREE.Vector3(     0, hed_y, 0);
    v2 = new THREE.Vector3(-bot_x, bot_y, 0);
    v3 = new THREE.Vector3(     0,     0, 0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 12, 13, 14, front_normal) );

    // Back bottom left wing
    v1 = new THREE.Vector3(     0, hed_y, 0.001);
    v2 = new THREE.Vector3(-bot_x, bot_y, 0.001);
    v3 = new THREE.Vector3(     0,     0, 0.001);
    geometry.vertices.push(v3);
    geometry.vertices.push(v2);
    geometry.vertices.push(v1);
    geometry.faces.push( new THREE.Face3( 15, 16, 17, back_normal) );

    // Front bottom right wing
    v1 = new THREE.Vector3(    0, hed_y, 0);
    v2 = new THREE.Vector3(bot_x, bot_y, 0);
    v3 = new THREE.Vector3(    0,     0, 0);
    geometry.vertices.push(v3);
    geometry.vertices.push(v2);
    geometry.vertices.push(v1);
    geometry.faces.push( new THREE.Face3( 18, 19, 20, front_normal) );

    // Back bottom right wing
    v1 = new THREE.Vector3(    0, hed_y, 0.001);
    v2 = new THREE.Vector3(bot_x, bot_y, 0.001);
    v3 = new THREE.Vector3(    0,     0, 0.001);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.faces.push( new THREE.Face3( 21, 22, 23, back_normal) );

    var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    material.side = THREE.DoubleSide;

    this.object = new THREE.Mesh( geometry, material );
    scene.add(this.object);

    this.velocity = new THREE.Vector3(0, 0, 0.2);
    this.object.position.set(0, 0, 0);
}

Moth.prototype.update = function() {
    this.object.position.add(this.velocity);
    this.velocity.add(new THREE.Vector3(-Math.random() + 0.5, -Math.random() + 0.5, -Math.random() + 0.5));
    this.velocity.normalize();
}

var moth1 = new Moth();
var moth2 = new Moth();

// Update & Render
function render() {
    update();
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}
render();

function update() {
    moth1.update();
    moth2.update();
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
