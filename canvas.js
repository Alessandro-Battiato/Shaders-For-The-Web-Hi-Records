const canvas = document.querySelector("canvas");
const sandbox = new GlslCanvas(canvas);

const sizer = function () {
    const s = window.innerWidth * 0.4;
    const dpi = window.devicePixelRatio;

    canvas.width = s * dpi;
    canvas.height = s * dpi;
    canvas.style.width = s + "px";
    canvas.style.height = s + "px";
};

sizer();

window.addEventListener("resize", sizer);

sandbox.load(frag);
sandbox.setUniform("scroll", 0);
sandbox.setUniform(
    "innerColors",
    [0.977, 0.989, 0.641, 1.0],
    [0.773, 0.711, 1.0, 1.0],
    [0.963, 0.649, 0.646, 1.0]
);

sandbox.setUniform(
    "midColors",
    [1.0, 0.713, 0.216, 1.0],
    [0.73, 0.901, 0.201, 1.0],
    [0.533, 0.941, 1.0, 1.0]
);

sandbox.setUniform(
    "outerColors",
    [1.0, 0.245, 0.226, 1.0],
    [0.071, 0.557, 0.3, 1.0],
    [0.0, 0.206, 0.758, 1.0]
);

window.addEventListener("scroll", function () {
    const pixels = window.pageYOffset;
    const wh = window.innerHeight;

    sandbox.setUniform("scroll", pixels / wh);
});
