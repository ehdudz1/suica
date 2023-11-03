import { Bodies, Engine, Body, Render, Runner, World, Events } from "matter-js"

import { FRUITS_BASE, FRUITS_HLW } from "./fruits"

const engine = Engine.create()
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850
  }
})

const world = engine.world

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
})

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
})

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
})

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: { fillStyle: "#E6B143" }
})

World.add(world, [leftWall, rightWall, ground, topLine])

Render.run(render)
Runner.run(engine)

let currentBody = null
let currentFruit = null
let disableAction = false
let interval = null

function addFruit() {
  const index = Math.floor(Math.random() * 5)
  const fruit = FRUITS_BASE[index]

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` }
    },
    restitution: 0.3
  })

  currentBody = body
  currentFruit = fruit
  
  World.add(world, body)
}

window.onkeydown = (event) => {
  if (disableAction) {
    return
  }

  switch (event.code) {
    case "KeyA": // 왼쪽
      // if (interval) {
      //   return
      // }
      
      // interval = setInterval(() => {
        if (currentBody.position.x - currentFruit.radius > 30) {
          Body.setPosition(currentBody, {
            x: currentBody.position.x - 10,
            y: currentBody.position.y,
          })
        }
      // }, 5)
      
      
    break
  
    case "KeyD": // 오른쪽
      // interval = setInterval(() => {
        if (currentBody.position.x + currentFruit.radius < 590) {
          Body.setPosition(currentBody, {
            x: currentBody.position.x + 10,
            y: currentBody.position.y,
          })
        }
      // }, 5)

    break

    case "KeyS":
      currentBody.isSleeping = false
      disableAction = true

      setTimeout(() => {
        addFruit()
        disableAction = false
      }, 1000)
      break;

    default: break
  }
}

window.addEventListener('touchend', (event) => {
  if (String(event.target).indexOf("Canvas") == -1) {
    return
  }
  
  if (disableAction) {
    return
  }

  if (event.clientX > 600 || event.clientX < 30) {
    return
  }

  Body.setPosition(currentBody, {
    x: event.clientX,
    y: currentBody.position.y,
  })  

  currentBody.isSleeping = false
  disableAction = true

  setTimeout(() => {
    addFruit()
    disableAction = false
  }, 1000)
})

window.onmousedown = (event) => {
  if (String(event.target).indexOf("Canvas") == -1) {
    return
  }
  
  if (disableAction) {
    return
  }

  if (event.clientX > 600 || event.clientX < 30) {
    return
  }

  Body.setPosition(currentBody, {
    x: event.clientX,
    y: currentBody.position.y,
  })  

  currentBody.isSleeping = false
  disableAction = true

  setTimeout(() => {
    addFruit()
    disableAction = false
  }, 1000)
}

// window.onkeyup = (event) => {
//   switch (event.code) {
//     case "KeyA":
//     case "KeyD":
//       clearInterval(interval)
//       interval = null
//     break

//     default: break
//   }
// }

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index

      if (index === FRUITS_BASE.length -1) {
        return
      }

      World.remove(world, [collision.bodyA, collision.bodyB])

      const newFruit = FRUITS_BASE[index + 1]
      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius, {
          render: {
            sprite: { texture: `${newFruit.name}.png` }
          },
          index: index + 1
        }
      )

      World.add(world, newBody)
      
      if (index + 1 === 10) {
        disableAction = true
        
        setTimeout(() => {
          alert("Winner!!")
          World.clear(world)
          World.add(world, [leftWall, rightWall, ground, topLine])
          addFruit()
        }, 1000)
      }
    }

    if (!disableAction && (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")){
      disableAction = true
      
      setTimeout(() => {
        alert("Game Over!!")
        World.clear(world)
        World.add(world, [leftWall, rightWall, ground, topLine])
        addFruit()
      }, 1000)
    }
  })
})

addFruit()