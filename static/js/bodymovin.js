var anim;
var elem = document.getElementById("bodymovin");
var animData = {
  container: elem,
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/278239/joysticks.json"
};
var scale = 1;
var animRel = 1;

anim = bodymovin.loadAnimation(animData);
anim.addEventListener("DOMLoaded", function() {
  animRel = anim.animationData.w / anim.animationData.h;
  calculateScale();
  window.addEventListener("mousemove", function(ev) {
    var xPos = (ev.pageX - windowSize.w / 2) * scale;
    var yPos = (ev.pageY - windowSize.h / 2) * scale;
    //console.log(ev.pageX - windowSize.w/2);
    anim.animationData.layers[0].ks.p.k[0].s = [xPos, yPos, 0];
    anim.animationData.layers[0].ks.p.k[0].e = [xPos, yPos, 0];
  });
});
window.addEventListener("resize", function(ev) {
  windowSize.w = window.innerWidth;
  windowSize.h = window.innerHeight;
  elemSize.w = elem.clientWidth;
  elemSize.h = elem.clientHeight;
  calculateScale();
});

function calculateScale() {
  var elemRel = anim.animationData.w / anim.animationData.h;
  if (animRel > elemRel) {
    scale = anim.animationData.w / elemSize.w;
  } else {
    scale = anim.animationData.h / elemSize.h;
  }
  //Scale adjustment for parented layer
  scale /= 2.5;
}
var windowSize = {
  w: window.innerWidth,
  h: window.innerHeight
};
var elemSize = {
  w: elem.clientWidth,
  h: elem.clientHeight
};
