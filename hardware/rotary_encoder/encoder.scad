/**
 * @file encoder.scad
 * @brief Rotary encoder for BeagleGo
 * @author Shadocko
 */

/// Global precision setting
$fn=60;

/// @name Some dimensions of LEGO parts
///@{
/// LEGO module (spacing between centroid of two knobs or two hole)
M=8.;
/// Backlash
e=0.1;
/// Smaller diameter for LEGO pinholes
pinhole_diameter=5.;
/// Larger diameter of LEGO pinhole (to accomodate for small protusion at pin's end)
pinhole_out_diameter=6.4;
/// Length of larger section of pinhole
pinhole_out_length=0.8;
///@}

/// Number of fences in coding wheel
num_windows=16;

/// Case thickness
thickness=1.;

/**
 * @name Optical Fork dimensions
 * Dimensions here are for an Everlight ITR9702 optical interrupter
 * <pre>
 *               w
 *    +---------------------+
 *    |                     |
 *    |                     |
 *    |       fence_w       |
 *    |      +-------+      |
 *    |      |       |      |h
 *    |      |       |      |
 *    |      |    fence_h   |
 *    |      |       |      |
 *    |      |       |      |
 *    +------+       +------+
 *
 * </pre>
 */
///@{
fork_w=13.2;
fork_h=11.2;
fork_thickness=6.2;
fork_fence_w=4.;
fork_fence_h=7.;
///@}

/// Pinhole placement
pinholes = [
  [2.*M,0.,0.],
  [0.,2.*M,0.],
  [-2.*M,0.,0.],
  [0.,-2.*M,0.]
];

/// Make a support for a pinhole
module pinhole_support() {
  cylinder(d=pinhole_out_diameter+2, h=M);
}

/// Pinhole shape
module pinhole() {
  union() {
    cylinder(d=pinhole_diameter, h=M);
    cylinder(d=pinhole_out_diameter, h=pinhole_out_length);
    translate([0.,0.,M-pinhole_out_length]) cylinder(d=pinhole_out_diameter, h=pinhole_out_length);
  }
}

/// Position children for first optical fork
module fork_a_position() {
  rotate([0.,0.,-30.]) translate([5.,0.,M])
    for(i=[0:$children]) {
      children(i);
    }
}

/// Position children for second optical fork
module fork_b_position() {
  rotate([0.,0.,180.-30.-(360.+90.)/num_windows]) translate([5.,0.,M])   
    for(i=[0:$children]) {
      children(i);
    }
}

/// Make an optical fork
module optical_fork() {
  difference() {
    translate([0.,-.5*fork_thickness,-.5*fork_w])
      cube([fork_h, fork_thickness, fork_w]);
    translate([0.,-.5*fork_thickness,-.5*fork_fence_w]) cube([fork_fence_h,fork_thickness,fork_fence_w]);
  }
}

%fork_a_position(){ optical_fork(); }
%fork_b_position(){ optical_fork(); }

/// Make support structure for an optical fork
module fork_support() {
  union() {
    translate([0., -2., e-M]) cube([fork_h+2., 1., .5*M]);
    translate([0., 1., e-M]) cube([fork_h+2., 1., .5*M]);
    translate([0., -.5*fork_thickness-2., e-M]) cube([1., fork_thickness+4., .5*M]);
    translate([fork_h-3., -.5*fork_thickness-2., e-M]) cube([1., fork_thickness+4., .5*M]);
  }
}

/// Make box used for engraving with a 45 degrees chamfer
/// @param a  box width
/// @param b  box height
/// @param c  chamfer size
module chamfer_box(a=4.,b=2.,c=.4) {
  minkowski() {
    cube([a,1.,b]);
    rotate([90.,0.,0.]) rotate([0.,0.,45.]) cylinder(r1=c*sqrt(2.), r2=0., h=c, $fn=4);
  }
}

/// Make shape used for engravigng rectangular precuts
/// @param a  rectangle width
/// @param b  rectangle height
/// @param c  chamfer size
module precut_box(a=4.,b=2.,c=.4) {
  difference() {
    chamfer_box(a=a, b=b, c=c);
    translate([c,-c,c]) scale([1.,-1.,1.]) chamfer_box(a=a-2.*c, b=b-2.*c);
  }  
}

/// Position screw axis
module position_screw_axis() {
  rotate([0.,0.,45,]) translate([-2.*M,0.,0.])
    for(i=[0:$children]) {
      children(i);
    }
}

/// Common module used for both halves of the encoder case
module basic_case() {
  difference() {
    union() {
      // Outer shell - inner shell
      difference() {
        // Outer shell
        translate([0.,0.,e]) union() {
          cylinder(d=5.*M-2.*e, h=M-e);
          cube([2.5*M-e, 2.5*M-e, M-e]);
        }
        // Inner shell
        difference() {
          translate([0.,0.,1.]) union() {
            cylinder(d=5*M-2.*thickness, h=M);
            cube([2.5*M-thickness, 2.5*M-thickness, M]);
          }
          // pinhole supports
          for(p=pinholes)
            translate(p) pinhole_support();
          // Cding wheel support
          cylinder(d=11., h=M-2.5);
          // Bolt/nut support
          position_screw_axis() cylinder(d=8.,h=M);
        }  
      }
      // Optical fork supports
      fork_a_position() { fork_support(); }
      fork_b_position() { fork_support(); }
    }
    // Pinholes
    for(p=pinholes)
      translate(p) pinhole();
    // Center hole for coding wheel
    cylinder(d=8., h=M);
    // Optical forks
    fork_a_position() { optical_fork(); }
    fork_b_position() { optical_fork(); }
    // Pre-cuts for cable
    translate([2.5*M-8,2.5*M-e,M-2.]) {
      precut_box(a=4., b=2.);
      translate([0.,-thickness,0.]) scale([1.,-1.,1.]) precut_box(a=4., b=2.);
    }
    // Screw hole
    position_screw_axis() cylinder(d=4.+e,h=M);
  }
}

// Side A...
difference() {
  basic_case();
  // Hex nut housing
  position_screw_axis() rotate([0.,0.,30.]) cylinder(d=7.66, h=4., $fn=6);
  // Logo
  translate([2.5*M-e-.5, 2.5*M-2, 5.]) rotate([0.,0.,-90.]) rotate([-90.,0.,0.]) linear_extrude(height=.5) text("BeagleGo", font="Helvetica:style=Bold Italic", size=2.8);
  // OSHWA logo
  translate([2., 2.5*M-e-.5, 7.]) rotate([-90.,0.,0.])
    linear_extrude(height=1., center=false, convexity=10)
    import (file = "oshwa-logo.dxf");
}

// Side B...
translate([6.*M,0.,0.]) scale([-1.,1.,1.]) difference() {
  basic_case();
  // Bolt head housing
  position_screw_axis() cylinder(d=7.+e, h=4.);
  // Markings
  translate([2.5*M-e, 2.5*M-2, 3.]) rotate([0.,0.,-90.]) rotate([90.,0.,0.]) linear_extrude(height=.5) text(str(4*num_windows," steps"), font="Helvetica:style=Bold Italic", size=2.8);
}

/// Make shape to substract to get a sliding cross axle hole
/// @param length   length of hole (defaults to one LEGO module)
module axle_hole(length=M) {
  difference() {
    cylinder(d=pinhole_diameter, h=length);
    translate([1.,1.,0.]) cube([2.,2.,length]);
    rotate([0.,0.,180.]) translate([1.,1.,0.]) cube([2.,2.,length]);
  }
}

/// Make an encoder wheel
module wheel() {
  difference() {
    union() {
      // For something easily printable in FDM...
      //translate([0.,0.,e]) cylinder(d=7., h=10.-e /*2.*(M-e)*/);
      // For when your fabrication process allows for clean models with supports
      translate([0.,0.,e]) cylinder(d=7., h=2.*(M-e));
      translate([0.,0.,6.]) difference() {
        cylinder(d=23., h=4., $fn=num_windows*3);
        intersection() {
          difference() {
            cylinder(d=22., h=4., $fn=num_windows*4);
            cylinder(d=10., h=4., $fn=num_windows*4);
          }
          for(i = [0 : num_windows-1]) {
            rotate([0., 0., i*360./num_windows])
              intersection() {
                cube([20., 20., 4.]);
                rotate([0., 0., 180./num_windows])
                  translate([0., -20., 0.])
                    cube([20., 20., 4.]);
              }
          }
        }
      }
    }
    axle_hole(length=16.);
  }
}

//translate([-40.,0.,0.])
//wheel();

