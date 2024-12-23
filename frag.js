const frag = `

#ifdef GL_ES
precision highp float;
#endif

#define MAX 3

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

uniform float scroll;

uniform vec4 innerColors[MAX];
uniform vec4 midColors[MAX];
uniform vec4 outerColors[MAX];

varying vec2 v_texcoord;

${includes}

vec4 sampleColor(vec4 colors[MAX], int index) {
    for (int i = 0; i < MAX; i++) {
        if (index == i) {
            return colors[i];
        }
    }

    return vec4(1.0, 1.0, 1.0, 1.0);
}

void main(void)
{
    vec2 uv = -1.0 + 2.0 * v_texcoord; // thanks to the initial portion of this statement, the coordinate system is now twice as big and we later center the circle in a much bigger coordinate system
    
    vec4 background = vec4(0.0, 0.0, 0.0, 1.0);   
    
    // vec4 innerColors[MAX];
    // vec4 midColors[MAX];
    // vec4 outerColors[MAX];
    
    // innerColors[0]  = vec4(0.977, 0.989, 0.641, 1.0);
    // innerColors[1]  = vec4(0.773, 0.711, 1.000, 1.0);
    // innerColors[2]  = vec4(0.963, 0.649, 0.646, 1.0);
    
    // midColors[0]    = vec4(1.000, 0.713, 0.216, 1.0);
    // midColors[1]    = vec4(0.730, 0.901, 0.201, 1.0);
    // midColors[2]    = vec4(0.533, 0.941, 1.000, 1.0);
    
    // outerColors[0]  = vec4(1.000, 0.245, 0.226, 1.0);
    // outerColors[1]  = vec4(0.071, 0.557, 0.300, 1.0);
    // outerColors[2]  = vec4(0.000, 0.206, 0.758, 1.0);
    
    int lowerIndex = int(floor(scroll)); // 0,1,2 switches between the color palettes, you still need to add the remaining 2 color palettes
    int upperIndex = int(ceil(scroll)); // floor for LOWER index cause floor is "down", the ceil is up so we use ceil here
    float mixer     = fract(scroll);
    mixer           = smoothstep(0.3, 0.7, mixer);
    
    vec4 innerColor = mix(
        sampleColor(innerColors, lowerIndex),
        sampleColor(innerColors, upperIndex), 
        mixer
    );
    
    vec4 midColor   = mix(
        sampleColor(midColors, lowerIndex), 
        sampleColor(midColors, upperIndex), 
        mixer
    );
    
    vec4 outerColor = mix(
        sampleColor(outerColors, lowerIndex), 
        sampleColor(outerColors, upperIndex), 
        mixer
    );
    
    
    vec2 innerPoint = vec2(0.0, 0.0) + 0.25 * vec2(cos(u_time), sin(u_time));
    vec2 midPoint   = innerPoint + 0.5 * vec2(cos(u_time), sin(u_time));
    vec2 outerPoint = vec2(0.0, 0.0);
    
    float innerDist = distance(uv, innerPoint);
    float midDist   = distance(uv, midPoint);
    float outerDist = distance(uv, outerPoint);
    
    float grain     = mix(-0.1, 0.1, rand(uv));
    
    float innerStep = smoothstep(0.0, 1.0, innerDist + grain);
    float midStep   = smoothstep(0.0, 1.5, midDist + grain);
    float outerStep = step(1.0, outerDist); // 1.0 is the threshold, while for the distance snippet we are asking "how far is uv from where? (where is the vec2)" and then we use the fract to repeat the effect over and over again

    // vec4 color = mix(outerColor, background, outerStep); // as third value we ONLY want it to be 0.0 OR 1.0, no in-between, thus why we used step before
    
    vec4 color      = mix(innerColor, midColor, innerStep);
    color           = mix(color, outerColor, midStep);
    color           = mix(color, background, outerStep);
    
    float disc      = fract(outerDist * 30.0);
    float mixDisc   = smoothstep(0.2, 0.3, disc) - smoothstep(0.7, 0.8, disc);
    
    color           = mix(background, color, mixDisc);
    
    gl_FragColor = color;
}
`;
