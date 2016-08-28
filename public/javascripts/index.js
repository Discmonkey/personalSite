var addActive = function () {
	$('.left-border').addClass('no-left-margin',300);
	$('.active-background').addClass('.active-background',300);
    $('#transform-container').addClass('no-margin');
};

var removeActive = function() {
    $('.active').removeClass('active',300);
    $('.active-background').removeClass('active-background',300);
    $('.left-border').removeClass('.no-left-margin');
    $('#transform-container').removeClass('no-margin');
}

var changeBorderColor = function(color) {
    $('#header-divider, .left-border, .right-border, #navigation').animate({
        borderColor: color
    },700);

    $('.header-container h1').animate({
        color: color
    },700);

    $('#navigation').animate({
        boxShadow: '0px 0px 5px 5px' + color
    });
};

var selectSide = function(id) {
	var rotate = 'translateZ(-180px) rotate';
	var resizeID = '#';
    var section = id.split('-')[0];
	var color =  '';
    $('#'+section+'-cover').hide(700);
	switch(section) {
		case 'blog':
			rotate += 'Y(90deg)';
			resizeID +='blog';
            color = '#FFA615';
			addActive();
			break;
		case 'cv':
			rotate += 'X(-90deg)';
			resizeID +='cv';
            color = '#12D8B1';
			addActive();
			break;
		case 'about':
			rotate += 'X(90deg)';
			resizeID +='about';
            color = '#FF7115';
			addActive();
			break;
		case 'physics':
			rotate += 'Y(-90deg)';
			resizeID +='physics';
            color = '#2373DA';
			addActive();
			break;
		case 'contact':
			rotate += 'Y(-180deg)';
			resizeID += 'contact';
            color = '#D4AFE5';
			addActive();
			break;
		case 'middle':
            color = '#69d425';
			rotate += 'Y(0deg)';
	}
	changeBorderColor(color);
	$('#mainTransform').css('transform',rotate);
	$(resizeID).addClass('active',700);
};
var spinSmall = true,
    spinBig = true;
    control = false;

$('#selector div, .header-container span').click(function(){
    removeActive();
    $('.cover:hidden').show(700);
    spinBig= false;
    $('#mainTransform').css('transition', 'transform 1s');
	var id = $(this)[0].id;
	selectSide(id);
    $('#mainTransform').css('transition','transform .2s');
});

//starting three.js script
var $nav = $('#navigation');
var scene = new THREE.Scene();
var height = $nav.height(),
	width = $nav.width();
var camera = new THREE.PerspectiveCamera(75, width/height,0.1,1000);
var renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(width, height);
$($nav).append( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );

var ca = [0x2373DA, 0x2373DA, 0xFFA615, 0xFFA615,
0x12D8B1, 0x12D8B1, 0xFF7115,0xFF7115,
0x00ff37, 0x00ff37, 0xD4AFE5, 0xD4AFE5]

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
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
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
	
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	frame++;
}

render();

var findClosestSide = function(x, y) {
	x = (x%(2*Math.PI) / Math.PI).toFixed(2);
	y = (y%(2*Math.PI) / Math.PI).toFixed(2);
    x = x < 0 ? parseFloat(x) + 2 : x;
    y = y < 0 ? parseFloat(y) + 2 : y;

    if ( x > 1.25 && x < 1.75) {
        return 'cv';
    }

    if (x > .25 && x < .75) {
        return 'about';
    }

    if (x >=.75 && x <= 1.25) {
        x = false;
    }

    if (y >= .25 && y < .75) {
        return x ? 'blog' : 'physics';
    }

    if (y >= .75 && y < 1.25 ) {
        return x ? 'contact' : 'middle';
    }

    if (y >= 1.25 && y < 1.75) {
        return x ? 'physics': 'blog';
    }

    return x ? 'middle': 'contact';
}

$('canvas').mousedown(function(){
	spinSmall = false;
	control = true;
	removeActive();
    if (spinBig) {
        spinBig = false;
    } else {
        $('.cover:hidden').show(700);
    }
	$nav.addClass('selected',300);
}).mouseout(function(){
	control = false;
	if (!spinSmall) {
		spinSmall = true;
		selectSide(findClosestSide(-1*cube.rotation.x,cube.rotation.y));
	}
	$nav.removeClass('selected');
}).mouseup(function(){
	control = false;
	$nav.removeClass('selected');
});

