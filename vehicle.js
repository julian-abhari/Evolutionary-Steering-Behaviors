class Vehicle {
  constructor(x, y, dna) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0);
    this.radius = 3;
    this.maxSpeed = 6;
    this.maxForce = 0.2;
    this.health = 1;
    this.dna = [];
    if (dna == undefined) {
      // Food weight
      this.dna[0] = random(-2, 2);
      // Poison weight
      this.dna[1] = random(-2, 2);
      // Food perception
      this.dna[2] = random(0, 100);
      // Poison perception
      this.dna[3] = random(0, 100);
    } else {
      this.dna[0] = dna[0];
      if (random(1) < mutationRate) {
        this.dna[0] += random(-0.1, 0.1);
      }
      this.dna[1] = dna[1];
      if (random(1) < mutationRate) {
        this.dna[1] += random(-0.1, 0.1);
      }
      this.dna[2] = dna[2];
      if (random(1) < mutationRate) {
        this.dna[2] += random(-10, 10);
      }
      this.dna[3] = dna[3];
      if (random(1) < mutationRate) {
        this.dna[3] += random(-10, 10);
      }
    }
  }

  update() {
    this.health -= 0.005;
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.borders();
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + radians(90);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);

    if (debug.checked()) {
      stroke(0, 255, 0);
      noFill();
      ellipse(0, 0, this.dna[2] * 2);
      line(0, 0, 0, -this.dna[0] * 20);
      stroke(255, 0, 0);
      ellipse(0, 0, this.dna[3] * 2);
      line(0, 0, 0, -this.dna[1] * 20);
    }

    var green = color(0, 255, 0);
    var red = color(255, 0, 0);
    var currentColor = lerpColor(red, green, this.health);

    fill(currentColor);
    stroke(currentColor);
    beginShape(TRIANGLES);
    vertex(0, -this.radius*2);
    vertex(-this.radius, this.radius*2);
    vertex(this.radius, this.radius*2);
    endShape();
    pop();
  }

  clone() {
    if (random(1) < 0.005 && this.health > random(1)) {
      return new Vehicle(this.position.x, this.position.y, this.dna);
    } else {
      return null;
    }
  }

  behaviors(good, bad) {
    var steeringForceFood = this.eat(good, 0.3, this.dna[2]);
    var steeringForcePoison = this.eat(bad, -0.75, this.dna[3]);

    steeringForceFood.mult(this.dna[0]);
    steeringForcePoison.mult(this.dna[1]);

    this.applyForce(steeringForceFood);
    this.applyForce(steeringForcePoison);
  }

  eat(food, nutritionalValue, perception) {
    var closestFood = 10 * width;
    var closestLocation = null;

    for (var i = food.length - 1; i > 0; i -= 1) {
      //var distance = dist(this.position.x, this.position.y, food[i].x, food[i].y);
      var distance = this.position.dist(food[i]);

      if (distance < this.maxSpeed) {
        food.splice(i, 1);
        this.health += nutritionalValue;
      } else {
        if (distance < closestFood && distance < perception) {
          closestFood = distance;
          closestLocation = food[i];
        }
      }
    }

    if (closestLocation != null) {
      return this.seek(closestLocation);
    } else {
      return createVector(0, 0);
    }
  }

  // Method that calculuates a steering force towards a target
  // Steering force = desired force - current velocity
  seek(target) {
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    var steeringForce = p5.Vector.sub(desired, this.velocity);
    steeringForce.limit(this.maxForce);
    return steeringForce;
  }

  // Wrap around
  borders() {
    if (this.position.x < -this.radius) this.position.x = width + this.radius;
    if (this.position.y < -this.radius) this.position.y = height + this.radius;
    if (this.position.x > width + this.radius) this.position.x = -this.radius;
    if (this.position.y > height + this.radius) this.position.y = -this.radius;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  dead() {
    return (this.health < 0);
  }
}
