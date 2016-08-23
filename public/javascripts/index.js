var removeActive = function () {
	$('active').removeClass('active',300);
	$('.active-background').removeClass('.active-background',300);	
};

var selectSide = function(id) {
	var rotate = 'translateZ(-180px) rotate';
	$('.active').removeClass('active',300);
	var resizeID = '#';
	switch(id.split('-')[0]) {
		case 'blog':
			rotate += 'Y(90deg)';
			resizeID +='blog';
			break;
		case 'cv':
			rotate += 'X(-90deg)';
			resizeID +='cv';
			break;
		case 'about':
			rotate += 'X(90deg)';
			resizeID +='about';
			break;
		case 'physics':
			rotate += 'Y(-90deg)';
			resizeID +='physics';
			break;
		case 'contact':
			rotate += 'Y(-180deg)';
			resizeID += 'contact';
			break;
		case 'middle':
			rotate += 'Y(0deg)';
	}
	$('#mainTransform').css('transform',rotate);
	$('#transform-container').addClass('active-background',700);
	$(resizeID).addClass('active',700);
};

$('#selector div').click(function(){
	var id = $(this)[0].id;
	selectSide(id);
});

$('.nav li a').click(function(){
	var id = $(this)[0].id;
	selectSide(id);
});

//starting three.js script
var spinSmall = true,
	spinBig = true;
	control = false;

var scene = new THREE.Scene();
var height = 100, 
	width = 100;
var camera = new THREE.PerspectiveCamera(75, width/height,0.1,1000);
var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(width, height);
$('#navigation').append( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );

var ca = [0x2373DA, 0x2373DA, 0xFFA615, 0xFFA615,
0x12D8B1, 0x12D8B1, 0xFF7115,0xFF7115,
0x5C080F, 0x5C080F, 0xD4AFE5, 0xD4AFE5]

for (var i = 0; i<geometry.faces.length; i++) {
	geometry.faces[i].color.setHex(ca[i]);
}
var material = new THREE.MeshPhongMaterial({ color: 0xffffff, vertexColors: THREE.FaceColors });
var cube = new THREE.Mesh( geometry, material );
var edges = new THREE.EdgesHelper( cube, 0x2373DA );
scene.add(edges);
camera.position.z = 1.7;
var directionalLight = new THREE.DirectionalLight( 0xffffff, 1  );
directionalLight.position.set( 0, 0, 1 );

scene.add(directionalLight);
scene.add(cube);

var frame = 0;
var mainCube = $('#mainTransform');

var x_last = 0;
var y_last = 0;
var x_delta = 0;
var y_delta = 0;
$('canvas').mousemove(function(event){
	x_delta = .025 * (x_last - event.offsetX);
	y_delta = .025 * (y_last - event.offsetY);
	x_last = event.offsetX;
	y_last = event.offsetY;
});

function render() {
	if (spinSmall) {
		cube.rotation.x += 0.01
		cube.rotation.y += 0.01
	} 
	
	if (control) {
		cube.rotation.y -= x_delta;
		cube.rotation.x -= y_delta;
	}
	if ( frame > 6  && (spinBig || control) ){
		frame = 0;
		mainCube.css('transform', 
				     'rotateX(' + (-1*cube.rotation.x)
				     + 'rad) rotateY('+ (cube.rotation.y) 
				     + 'rad) rotateZ('+ (-1*cube.rotation.z) + 'rad)');
		x_delta = 0;
		y_delta = 0;
	}
	
	requestAnimationFrame( render )
	renderer.render( scene, camera );
	frame++;
}

render();

var findClosestSide = function(x, y) {
	x = x%(2*Math.PI) / Math.PI;
	y = y%(2*Math.PI) / Math.PI;

	if ( Math.abs(.5 + x) < .25 ){
		return 'cv';
	} 

	if ( Math.abs(1.5 + x) < .25 ) {
		return 'about';
	}

	if ( x < -.75) {
		if (Math.abs(y - 1.5) < .25) {
			return 'blog';
		}

		if (Math.abs(y - .5) < .25) {
			return 'physics';
		}

		if (y > 1.75 || y < .25) {
			return 'contact';
		}

		return 'middle';
	}

	if (Math.abs(y - 1.5) < .25) {
		return 'physics';
	}

	if (Math.abs(y - .5) < .25) {
		return 'blog';
	}

	if (y > 1.75 || y < .25) {
		return 'middle';
	}

	return 'contact';

}

$('canvas').mousedown(function(){
	spinSmall = false;
	control = true;
	spinBig = false;
	$('.active').removeClass('active',300);
	$('#navigation').addClass('selected');
}).mouseout(function(){
	control = false;
	if (!spinSmall) {
		spinSmall = true;
		selectSide(findClosestSide(-1*cube.rotation.x,cube.rotation.y));
	}
	$('#navigation').removeClass('selected');
}).mouseup(function(){
	control = false;
	$('#navigation').removeClass('selected');
});

//testing grid
