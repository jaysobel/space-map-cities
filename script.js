var all_draw_instructions = {
  // lines
  "hydrography": {
    "promise": d3.json("data/hydro_polygons.geo.json"),
    "type": "lines",
    "category": "boundary"
  },
  // points
  "hospitals": {
    "promise":  d3.json("data/hospitals.geo.json"),
    "type": "points",
    "category": "cat2"
  },
  "hubways": {
    "promise":  d3.json("data/hubways.geo.json"),
    "type": "points",
    "category": "cat3"
  },
  "hydrants": {
    "promise": d3.json("data/hydrants.geo.json"),
    "type": "points",
    "category": "cat3"
  },
  "libraries": {
    "promise": d3.json("data/libraries.geo.json"),
    "type": "points",
    "category": "cat2"
  },
  "parking_meters": {
    "promise": d3.json("data/parking_meters.geo.json"),
    "type": "points",
    "category": "cat3"
  },
  "police": {
    "promise": d3.json("data/police.geo.json"),
    "type": "points",
    "category": "cat2"
  },
  "traffic_signals": {
    "promise": d3.json("data/traffic_signals.geo.json"),
    "type": "points",
    "category": "cat3"
  },
  "universities": {
    "promise": d3.json("data/universities.geo.json"),
    "type": "points",
    "category": "cat2"
  },
  "cambridge_intersections": {
    "promise": d3.json("data/cambridge_intersections.geo.json"),
    "type": "points",
    "category": "cat3"
  },
   "trees": {
    "promise": d3.json("data/trees.geo.json"),
    "type": "points",
    "category": "cat1"
  }
};

console.log(Object.keys(all_draw_instructions));

//var w = window.innerWidth - 10;
//var h = window.innerHeight - 10;

var w = 800;
var h = 800;

// space colors from nadieh
var bg_color = "#000817";
var colors = {
   "red": "rgba(252, 14, 15, 1)",
   "red_fade": "rgba(252, 14, 15, 0.2)", 
   "blue": "rgba(110, 226, 246, 1)",
   "blue_fade": "rgba(110, 226, 246, 0.2)",
   "yellow": "rgba(253, 252, 101, 1)",
   "yellow_fade": "rgba(253, 252, 101, 0.2)",
   "pink": "rgba(254, 47, 247, 1)",
   "pink_fade": "rgba(254, 47, 247, 0.2)",
   "green": "rgba(72, 207, 93, 1)",
   "green_fade": "rgba(72, 207, 93, 0.2)",
   "white": "rgba(247, 249, 252, 1)",
   "white_fade": "rgba(247, 249, 252, 0.2)",
   "space": "rgba(0, 8, 23, 1)",
   "space_fade": "rgba(0, 8, 23, 0.2)",
};
var category_colors = {
  "cat1": colors["red"],
  "cat2": colors["yellow"],
  "cat3": colors["green"],
  "boundary": colors["blue"],
};
var category_colors_faded = {
  "cat1": colors["red_fade"],
  "cat2": colors["yellow_fade"],
  "cat3": colors["green_fade"],
  "boundary": colors["blue_fade"],
};

var draw_lines = true;
var draw_points = true;
var draw_contours = true;

var canvas1 = d3.select("canvas.canvas-1")
  .attr("width", w)
  .attr("height", h)
  .attr("style", "background-color: " + bg_color + ";");

var canvas2 = d3.select("canvas.canvas-2")
  .attr("width", w)
  .attr("height", h)
  .attr("style", "background-color: " + bg_color + ";");

// true Boston Center [-71.057083, 42.361145]
var pCenter = [-71.069083, 42.351145];
var pScale = 500000

var projection = d3.geoEquirectangular()
  .translate([w / 2, h / 2])
  .center(pCenter)
  .scale(pScale);

var context = canvas1.node().getContext("2d");

var geoGenerator = d3.geoPath()
  .projection(projection)
  .context(context)
  .pointRadius(function(d) { return 4 });

var context2 = canvas2.node().getContext("2d");
var geoGeneratorId = d3.geoPath()
  .context(context2);

context.globalCompositeOperation = 'source-over';
context.lineCap = "round";

function draw_features(data) {

  // iterate the returned promises 
  for(var i = 0; i < Object.keys(data).length; i++) {
    
    // recover specs from subset dictionary
    var feature_name = draw_feature_names[i];
    var specs = draw_instructions[feature_name];
    var cat = specs.category;

    // do something with lines
    if (specs.type == "lines") {
      if (cat == "boundary" && draw_lines ) {
        context.lineWidth = 2;
        context.shadowBlur = 0;
        context.strokeStyle = category_colors[cat];

        context.beginPath();
        geoGenerator({ type: 'FeatureCollection', features: data[i].features} );
        context.stroke();
      }
    }
    // do something with points
    else if (specs.type == "points" && draw_points) {
      // depending on their category
      if (cat == 'cat1') {
        context.fillStyle = category_colors[cat];
        //context.shadowBlur = 1;
        //context.shadowColor = category_colors[cat];
        geoGenerator.pointRadius(1);
      }
      else if (cat == 'cat2') {
        context.fillStyle = category_colors[cat];
        //context.shadowBlur = 9;
        //context.shadowColor = category_colors[cat];
        geoGenerator.pointRadius(3);
      }
      else if (cat == 'cat3') {
        context.fillStyle = category_colors[cat];
        //context.shadowBlur = 6;
        //context.shadowColor = category_colors[cat];
        geoGenerator.pointRadius(1);
      }
      context.beginPath();
      geoGenerator({ type: 'FeatureCollection', features: data[i].features} );
      context.fill();
    }
  }

  if(draw_contours) {
    draw_category_contours(data);
  };
};

function draw_category_contours(data) {

  var category_coordinates = {};

  // product dictionary by category with concatenated list of coordinates
  for(var i = 0; i < Object.keys(data).length; i++) {
    
    // recover specs from subset dictionary
    var feature_name = draw_feature_names[i];
    var specs = draw_instructions[feature_name];
    var cat = specs.category
    var feature_coords = [];

    // if we want contours for this data's category
    if (draw_contour_categories.includes(cat)) {
      // if the coordinate list does not exist for appending
      if (category_coordinates[cat] == null) {
        category_coordinates[cat] = [];
      }

      feature_coords = data[i].features.map(function(f) { return f.geometry.coordinates } );
      category_coordinates[cat] = category_coordinates[cat].concat(feature_coords);  
      console.log("concatenated " + feature_name + " to " + cat);
    }
  }
  console.log(category_coordinates);
  
  // compute and draw contours for each category
  context2.lineWidth = 2;
  context2.shadowBlur = 0;

  // default thresholds/bandwidths
  var bw = 10;
  var th = 6;

  for(var i = 0; i < Object.keys(category_coordinates).length; i++) {

    key = Object.keys(category_coordinates)[i];
    coordinate_list = category_coordinates[key];

    if (key == 'cat1') {
      bw = 10;
      th = 5;
    }
    else if (key == 'cat2') {
      bw = 15;
      th = 4;
    }
    else if (key == 'cat3') {
      bw = 15;
      th = 5;
    }
    var densityData = d3.contourDensity()
      .x(function(d) { return projection(d)[0]; })
      .y(function(d) { return projection(d)[1]; })
      .size([w, h])
      .bandwidth(bw)    // smaller = more precise
      .thresholds(th)    // controls total contours drawn
      (coordinate_list);

    context2.strokeStyle = category_colors[key];
    context2.fillStyle = category_colors_faded[key];

    console.log(densityData);
    densityData.forEach(c => {
          if (c.coordinates.length == 0) return;
          context2.beginPath();
          geoGeneratorId(c);
          context2.stroke();
          context2.fill();
      });
  };
}


var draw_feature_names = ['hydrography', // boundaries
                          'trees',  // cat 1
                          'hospitals', 'police', 'libraries', 'universities', // cat 2
                          'traffic_signals', 'hydrants', 'cambridge_intersections'] // cat 3

var draw_contour_categories = ['cat1', 'cat2', 'cat3']

draw_instructions = {};

for(var i = 0; i < draw_feature_names.length; i++) {
  draw_instructions[draw_feature_names[i]] = all_draw_instructions[draw_feature_names[i]];
}

var promises = Object.keys(draw_instructions).map(function(key) { return draw_instructions[key]["promise"]; });

Promise.all(promises).then(draw_features);