var removeActive = function () {
	$('active').removeClass('active',300);
	$('.active-background').removeClass('.active-background',300);	
};

$('#selector div').click(function(){
	var id = $(this)[0].id;
	var rotate = 'translateZ(-180px) rotate'
	var resizeID = '#';
	switch(id) {
		case 'blog-select':
			rotate+='Y(90deg)';
			resizeID +='blog';
			break;
		case 'cv-select':
			rotate+='X(-90deg)';
			resizeID +='cv';
			break;
		case 'about-select':
			rotate+='X(90deg)';
			resizeID +='about';
			break;
		case 'physics-select':
			rotate+='Y(-90deg)';
			resizeID +='physics';
			break;
	}
	$('#mainTransform').css('transform',rotate);
	$('#transform-container').addClass('active-background',700);
	$(resizeID).addClass('active',700);
	

});

$('.nav li a').click(function(){
	var id = $(this)[0].id;
	var rotate = 'translateZ(-180px) rotate';
	var resizeID = '#';
	$('.active').removeClass('active',300);
	switch(id) {
		case 'blog-menu':
			rotate+='Y(90deg)';
			resizeID+='blog';
			break;
		case 'cv-menu':
			rotate+='X(-90deg)';
			resizeID+='cv';
			break;
		case 'about-menu':
			rotate+='X(90deg)';
			resizeID+='about';
			break;
		case 'physics-menu':
			rotate+='Y(-90deg)';
			resizeID+='physics';
			break;
	}
	$('#transform-container').addClass('active-background',700);
	$(resizeID).addClass('active',700);
	$('#mainTransform').css('transform',rotate);
	


});

$('.navbar-header').click(function(){
	//add if statement for where you currently are
	$('#mainTransform').css('transform','rotateX(0deg)').css('transform','rotateY(0deg)');
	removeActive();

});



//starting three.js script
var spin = true;

var scene = new THREE.Scene();
var width = 50;
var height = $('.navbar').height();
var camera = new THREE.PerspectiveCamera(75, width/height,0.1,1000);
var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(width, height);
$('.navbar-header').append( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	
var ca = [0xFF7115, 0xFF7115, 0x12D8B1, 0x12D8B1, 0xFFA615, 0xFFA615];

for (var i = 0; i<geometry.faces.length; i++) {
	geometry.faces[i].color.setHex(ca[Math.floor(i/2)]);
}
var material = new THREE.MeshPhongMaterial({ color: 0xffffff, vertexColors: THREE.FaceColors });
var cube = new THREE.Mesh( geometry, material );
var edges = new THREE.EdgesHelper( cube, 0x2373DA );
scene.add(edges);
camera.position.z = 1.7;
var directionalLight = new THREE.DirectionalLight( 0xffffff, 1  );
directionalLight.position.set( 0, 0, 1 );
controls = new THREE.OrbitControls( camera, renderer.domElement );
scene.add(directionalLight);
scene.add(cube);

function lightUpdate() {
	directionalLight.position.copy(camera.position);
}

function render() {
	if (spin) {
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.02;
	}
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	lightUpdate();
}

render();

$('canvas').mouseover(function(){
	spin = false;
}).mouseout(function(){
	spin = true;
});

//testing grid
