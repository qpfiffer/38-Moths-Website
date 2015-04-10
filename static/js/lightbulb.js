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

if ( webglAvailable() ) {
    renderer = new THREE.WebGLRenderer({"canvas": canvas});
} else {
    renderer = new THREE.CanvasRenderer({"canvas": canvas});
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
renderer.setSize( canvas.width, canvas.height );
renderer.setClearColor(0x696060);

//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

camera.position.z = 5;

function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}
render();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
    var parent_ele = document.getElementById("lander");
    canvas.width = parent_ele.offsetWidth;
    canvas.height = parent_ele.offsetHeight;

    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();

    renderer.setSize( canvas.width, canvas.height );

}
