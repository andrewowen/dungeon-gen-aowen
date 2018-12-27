export Room: function(x,y,w,h) {
  this.x1 = x;
  this.y1 = y;
  this.x2 = x + w;
  this.y2 = y + h;

  this.center_coords = []
  center_x = (this.x1 + this.x2) / 2
  center_y = (this.y1 + this.y2) / 2
  this.center_coords.push(center_x)
  this.center_coords.push(center_y)
}