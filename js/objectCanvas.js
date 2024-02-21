const matterContainer = document.querySelector("#matter-container");
const THICCNESS = 1000;

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// adjust gravity
engine.world.gravity.y = 0.01;

// create a renderer
var render = Render.create({
    element: matterContainer,
    engine: engine,
    options: {
        width: matterContainer.clientWidth,
        height: matterContainer.clientHeight,
        background: "transparent",
        wireframes: false,
        showAngleIndicator: false
    }
});

// Define the getScaleFactor function
function getScaleFactor() {
    const baseWidth = 1920; // The width at which your original sizes are set
    const currentWidth = window.innerWidth;
    let scaleFactor = currentWidth / baseWidth;
    const minScale = 0.4; // Set your minimum scale factor
    const maxScale = 1.4; // Set your maximum scale factor
    return Math.min(Math.max(scaleFactor, minScale), maxScale);
}


let scaleFactor = getScaleFactor();

// Define the original sizes of your bodies
const ORIGINAL_SIZES = [
    { type: 'circle', size: 30, color: '#DB4437' },
    { type: 'circle', size: 60, color: '#F4B400' },
    { type: 'circle', size: 90, color: '#0F9D58' },
    { type: 'circle', size: 150, color: '#4285F4' },
    { type: 'rectangle', width: 120, height: 120, color: '#4285F4', radius: 30 },
    { type: 'rectangle', width: 240, height: 240, color: '#F4B400', radius: 30 },
    { type: 'rectangle', width: 480, height: 30, color: '#0F9D58', radius: 5 },
    { type: 'rectangle', width: 180, height: 90, color: '#0F9D58', radius: 10 },
    { type: 'rectangle', width: 250, height: 125, color: '#DB4437', radius: 20 },
    { type: 'rectangle', width: 360, height: 180, color: '#F4B400', radius: 90 },
    { type: 'polygon', size: 125, color: '#DB4437', radius: 30 },
    { type: 'polygon', size: 200, color: '#4285F4', radius: 30 }
];

// Function to create a body based on the type and size
function createBody(body) {
    let newBody;
    switch (body.type) {
        case 'circle':
            newBody = Bodies.circle(Math.random() * (matterContainer.clientWidth - body.size), Math.random() * (matterContainer.clientHeight - body.size), body.size * scaleFactor, {
                restitution: 0.8,
                render: {
                    fillStyle: body.color
                }
            });
            break;
        case 'rectangle':
            newBody = Bodies.rectangle(Math.random() * (matterContainer.clientWidth - body.width), Math.random() * (matterContainer.clientHeight - body.height), body.width * scaleFactor, body.height * scaleFactor, {
                chamfer: {
                    radius: body.radius * scaleFactor
                },
                restitution: 0.8,
                render: {
                    fillStyle: body.color
                }
            });
            break;
        case 'polygon':
            newBody = Bodies.polygon(Math.random() * (matterContainer.clientWidth - body.size), Math.random() * (matterContainer.clientHeight - body.size), 3, body.size * scaleFactor, {
                chamfer: {
                    radius: body.radius * scaleFactor
                },
                restitution: 0.8,
                render: {
                    fillStyle: body.color
                }
            });
            break;
    }
    return newBody;
}

// Create bodies using the ORIGINAL_SIZES array
let bodies = ORIGINAL_SIZES.map(createBody);

// Add all of the bodies to the world
Composite.add(engine.world, bodies);

var ground = Bodies.rectangle(
    matterContainer.clientWidth / 2,
    matterContainer.clientHeight + THICCNESS / 2,
    27184,
    THICCNESS, {
    isStatic: true,
    render: {
        fillStyle: 'transparent'
    }
}
);

let leftWall = Bodies.rectangle(
    0 - THICCNESS / 2,
    matterContainer.clientHeight / 2,
    THICCNESS,
    matterContainer.clientHeight * 5, {
    isStatic: true,
    render: {
        fillStyle: 'transparent'
    }
}
);

let rightWall = Bodies.rectangle(
    matterContainer.clientWidth + THICCNESS / 2,
    matterContainer.clientHeight / 2,
    THICCNESS,
    matterContainer.clientHeight * 5, {
    isStatic: true,
    render: {
        fillStyle: 'transparent'
    }
}
);

let ceiling = Bodies.rectangle(
    matterContainer.clientWidth / 2,
    0 - THICCNESS / 2,
    27184,
    THICCNESS, {
    isStatic: true,
    render: {
        fillStyle: 'transparent'
    }
}
);

// add all of the bodies to the world
Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
}
);

Composite.add(engine.world, mouseConstraint);

let mouseDown = false;

// change cursor when mouse hovers over a box
Matter.Events.on(mouseConstraint, 'mousemove', function (event) {
    if (!mouseDown) {
        var bodies = Composite.allBodies(engine.world);
        var foundBody = Matter.Query.point(bodies, event.mouse.position);
        if (foundBody.length !== 0) {
            render.canvas.style.cursor = 'grab';
        } else {
            render.canvas.style.cursor = 'default';
        }
    }
});

// change cursor when a box is clicked
Matter.Events.on(mouseConstraint, 'mousedown', function (event) {
    mouseDown = true;
    var bodies = Composite.allBodies(engine.world);
    var foundBody = Matter.Query.point(bodies, event.mouse.position);
    if (foundBody.length !== 0) {
        render.canvas.style.cursor = 'grabbing';
    }
});

// change cursor back to default when mouse is released
Matter.Events.on(mouseConstraint, 'mouseup', function (event) {
    mouseDown = false;
    render.canvas.style.cursor = 'default';
});

// allow scroll through the canvas
mouseConstraint.mouse.element.removeEventListener(
    "mousewheel",
    mouseConstraint.mouse.mousewheel
);
mouseConstraint.mouse.element.removeEventListener(
    "DOMMouseScroll",
    mouseConstraint.mouse.mousewheel
);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

function handleResize(matterContainer) {
    // set canvas size to new values
    render.canvas.width = matterContainer.clientWidth;
    render.canvas.height = matterContainer.clientHeight;

    // reposition ground
    Matter.Body.setPosition(
        ground,
        Matter.Vector.create(
            matterContainer.clientWidth / 2,
            matterContainer.clientHeight + THICCNESS / 2
        )
    );

    // reposition right wall
    Matter.Body.setPosition(
        rightWall,
        Matter.Vector.create(
            matterContainer.clientWidth + THICCNESS / 2,
            matterContainer.clientHeight / 2
        )
    );

    // reposition ceiling
    Matter.Body.setPosition(
        ceiling,
        Matter.Vector.create(
            matterContainer.clientWidth / 2,
            0 - THICCNESS / 2
        )
    );

    // reposition left wall
    Matter.Body.setPosition(
        leftWall,
        Matter.Vector.create(
            0 - THICCNESS / 2,
            matterContainer.clientHeight / 2
        )
    );

    // update scale factor
    scaleFactor = getScaleFactor();

    // remove bodies from the world
    Composite.remove(engine.world, bodies);

    // recreate bodies with new sizes but keep the old positions
    bodies = ORIGINAL_SIZES.map((body, index) => {
        let newBody = createBody(body);
        // Keep the old position
        Matter.Body.setPosition(newBody, bodies[index].position);
        return newBody;
    });

    // add all of the bodies to the world
    Composite.add(engine.world, bodies);
}

window.addEventListener("resize", () => handleResize(matterContainer));