//testing grid
function physicsFunction () {
	var renderer,
		scene,
		camera,
		meshMaterial;
	
	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
	$('#physics-content').append( renderer.domElement );
	var width = $('#physics-content').width();
	var height = $('#physics-content').height();
	renderer.setSize( width, height );
	
	scene = new THREE.Scene();
	
	// Add some objects to the scene, one per quadrant
	meshMaterial = new THREE.MeshBasicMaterial({ color: 0xFF00FF, wireframe: true });
	
	
	// Add axes
	axes = buildAxes( 1000 );
	scene.add( axes );

	
	// We need a camera to look at the scene!
	camera = new THREE.PerspectiveCamera( 45, width / height, 1, 10000 );
	camera.position.set( 30, 50, 120 );
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// and go!
	animate();

	function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	}

	function buildAxes( length ) {
		var axes = new THREE.Object3D();

		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
		axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

		return axes;

	}

	function buildAxis( src, dst, colorHex, dashed ) {
		var geom = new THREE.Geometry(),
			mat; 

		if(dashed) {
			mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
		} else {
			mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
		}

		geom.vertices.push( src.clone() );
		geom.vertices.push( dst.clone() );
		geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

		var axis = new THREE.Line( geom, mat, THREE.LineSegments );

		return axis;

	}
}