function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  //var d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}


var cols = 50;
var rows = 50;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path = [];

function Spot(i, j) {
  this.i = i
  this.j = j
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.4) {
    this.wall = true;
  }

  this.show = function(col) {
    fill(col);
    if (this.wall) {
      fill(100);
    }
    noStroke();
    rect(this.i * w, this.j * h, w, h);
  }

  this.addNeighbors = function(grid) {
    if (i < cols - 1) {
      this.neighbors.push(grid[this.i + 1][this.j])
    }
    if (i > 0) {
      this.neighbors.push(grid[this.i - 1][this.j])
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[this.i][this.j + 1])
    }
    if (j > 0) {
      this.neighbors.push(grid[this.i][this.j - 1])
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1])
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1])
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1])
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1])
    }
  }
}

function setup() {
  createCanvas(600, 600);
  console.log('a*');

  w = width / cols;
  h = height / rows;

  // making 2d array
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1]
  start.wall = false;
  end.wall = false;

  openSet.push(start);
}

function draw() {
  background(50);
  if (openSet.length > 0) {
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var current = openSet[winner];
    if (current === end) {
      noLoop();
      createP('DONE!')
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for (i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + 1; //heuristic(neighbor, current);

        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }

    // we can keep going
  } else {
    // no solution
    noLoop();
    return;
    createP('no solution')
    return;

  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(200));

    }
  }

  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(200, 100, 100))
  }
  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(100, 200, 100))
  }

  // find the path
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }



  for (var i = 0; i < path.length; i++) {
    path[i].show(color(100, 100, 200));
  }
}
