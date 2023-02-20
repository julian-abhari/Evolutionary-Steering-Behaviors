var vehicles = [];
var food = [];
var poison = [];
var mutationRate = 0.03;

var debug;

function setup() {
	createCanvas(640, 360);
	debug = createCheckbox();

	for (var i = 0; i < 10; i += 1) {
		var x = random(width);
		var y = random(width);
		vehicles[i] = new Vehicle(x, y);
	}
	for (var i = 0; i < 40; i += 1) {
		var x = random(width);
		var y = random(width);
		food.push(createVector(x, y));
	}

	for (var i = 0; i < 20; i += 1) {
		var x = random(width);
		var y = random(width);
		poison.push(createVector(x, y));
	}
}

function mouseDragged() {
	vehicles.push(new Vehicle(mouseX, mouseY));
}

function draw() {
	background(51);
	var target = createVector(mouseX, mouseY);
	strokeWeight(2);

	if (random(1) < 0.05) {
		var x = random(width);
		var y = random(height);
		food.push(createVector(x, y));
	}

	if (random(1) < 0.01) {
		var x = random(width);
		var y = random(height);
		poison.push(createVector(x, y));
	}

	for (var i = 0; i < food.length; i += 1) {
		fill(0, 127, 0);
		stroke(0, 200, 0);
		ellipse(food[i].x, food[i].y, 8, 8);
	}

	for (var i = 0; i < poison.length; i += 1) {
		fill(127, 0, 0);
		stroke(200, 0, 0);
		ellipse(poison[i].x, poison[i].y, 8, 8);
	}

	for (var i = vehicles.length - 1; i >= 0; i -= 1) {
		vehicles[i].behaviors(food, poison);
		vehicles[i].display();
		vehicles[i].update();

		var childVehicle = vehicles[i].clone();
		if (childVehicle != null) {
			vehicles.push(childVehicle);
		}

		if (vehicles[i].dead()) {
			food.push(vehicles[i].position);
			vehicles.splice(i, 1);
		}
	}
}
