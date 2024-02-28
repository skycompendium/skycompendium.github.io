import React from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import Model from './Model'

const Models = () => {
  const sceneRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const currentScene = sceneRef.current

    // camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 36)

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.toneMapping = THREE.CineonToneMapping
    renderer.toneMappingExposure = 1.6
    renderer.shadowMap.enabled = true

    currentScene && currentScene.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)

    // controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target = new THREE.Vector3(0, 0, 0)
    controls.minDistance = 8
    controls.maxDistance = 96
    controls.enableDamping = true
    controls.update()

    // objects, and scene
    const textureLoader = new THREE.TextureLoader()
    const randomRotation = () => 2*Math.PI*Math.random()

    const earth = Model.Earth(textureLoader)
    earth.position.set(0, 0, 0)

    const createOrbit = (radius: number, color: number) => {
      const points = new THREE.Path().absarc(0, 0, radius, 0, 2*Math.PI).getPoints(64)
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({ color: color })
      geometry.rotateX(Math.PI / 2)

      return new THREE.Line(geometry, material)
    }

    const moon = Model.Moon(textureLoader)
    moon.scale.set(0.25, 0.25, 0.25)
    const moonOrbit = createOrbit(5, 0xf0f0f0)
    const moonGroup = new THREE.Group()
    moonGroup.add(moon)
    moonGroup.add(moonOrbit)
    moon.position.set(5, 0, 0)
    moonGroup.rotation.y = randomRotation()

    const sun = Model.Sun(textureLoader)
    sun.scale.set(0.45, 0.45, 0.45)
    const sunOrbit = createOrbit(9, 0xfce570)
    const sunGroup = new THREE.Group()
    sunGroup.add(sun)
    sunGroup.add(sunOrbit)
    sunGroup.rotation.y = randomRotation()
    sun.position.set(9, 0, 0)

    const jupiter = Model.Jupiter(textureLoader)
    jupiter.scale.set(0.45, 0.45, 0.45)
    const jupiterOrbit = createOrbit(16, 0x90614d)
    const jupiterGroup = new THREE.Group()
    jupiterGroup.add(jupiter)
    jupiterGroup.add(jupiterOrbit)
    jupiterGroup.rotation.y = randomRotation()
    jupiter.position.set(16, 0, 0)

    const mercury = Model.Mercury(textureLoader)
    mercury.scale.set(0.45, 0.45, 0.45)
    const mercuryOrbit = createOrbit(19, 0xb5a7a7)
    const mercuryGroup = new THREE.Group()
    mercuryGroup.add(mercury)
    mercuryGroup.add(mercuryOrbit)
    mercuryGroup.rotation.y = randomRotation()
    mercury.position.set(19, 0, 0)

    const mars = Model.Mars(textureLoader)
    mars.scale.set(0.45, 0.45, 0.45)
    const marsOrbit = createOrbit(25, 0x663926)
    const marsGroup = new THREE.Group()
    marsGroup.add(mars)
    marsGroup.add(marsOrbit)
    marsGroup.rotation.y = randomRotation()
    mars.position.set(25, 0, 0)

    const venus = Model.Venus(textureLoader)
    venus.scale.set(0.45, 0.45, 0.45)
    const venusOrbit = createOrbit(27, 0xefefef)
    const venusGroup = new THREE.Group()
    venusGroup.add(venus)
    venusGroup.add(venusOrbit)
    venusGroup.rotation.y = randomRotation()
    venus.position.set(27, 0, 0)

    const saturn = Model.Saturn(textureLoader)
    saturn.scale.set(0.45, 0.45, 0.45)
    const saturnOrbit = createOrbit(28, 0xc3a171)
    const saturnGroup = new THREE.Group()
    saturnGroup.add(saturn)
    saturnGroup.add(saturnOrbit)
    saturnGroup.rotation.y = randomRotation()
    saturn.position.set(28, 0, 0)

    const stars = Model.FixedStars(textureLoader)
    stars.scale.set(36, 36, 36)
    stars.rotation.z += THREE.MathUtils.degToRad(62.9)
    stars.position.set(0, 0, 0)

    const scene = new THREE.Scene()
    scene.rotation.x += Math.PI / 24
    scene.rotation.z += Math.PI / 36
    scene.add(earth)
    scene.add(moonGroup)
    scene.add(sunGroup)
    scene.add(jupiterGroup)
    scene.add(mercuryGroup)
    scene.add(marsGroup)
    scene.add(venusGroup)
    scene.add(saturnGroup)
    scene.add(stars)
    scene.add(new THREE.AmbientLight(0x484848))

    // post-processing
    const renderPass = new RenderPass(scene, camera)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.24, 0.1, 0)
    const outputPass = new OutputPass()
    composer.addPass(renderPass)
    composer.addPass(bloomPass)
    composer.addPass(outputPass)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    const animate = () => {
      moonGroup.rotation.y -= THREE.MathUtils.degToRad(373 / 6000)
      sunGroup.rotation.y -= THREE.MathUtils.degToRad(360 / 6000)
      jupiterGroup.rotation.y -= THREE.MathUtils.degToRad(202.5 / 6000)
      mercuryGroup.rotation.y -= THREE.MathUtils.degToRad(80.5 / 6000)
      marsGroup.rotation.y -= THREE.MathUtils.degToRad(-60 / 6000)
      venusGroup.rotation.y -= THREE.MathUtils.degToRad(50 / 6000)
      saturnGroup.rotation.y -= THREE.MathUtils.degToRad(10 / 6000)
      stars.rotation.y += THREE.MathUtils.degToRad(361 / 6000)
      controls.update()
      composer.render()
    }
    renderer.setAnimationLoop(animate)

    return () => {
      renderer.setAnimationLoop(null)
      currentScene && currentScene.removeChild(renderer.domElement)
      window.removeEventListener('resize', handleResize)
    }

  }, [])

  return (
    <div className="Models" ref={sceneRef}>
      <menu>
        <li>
          <input type="radio" name="model" id="platonic"checked={true} readOnly={true} />
          <label htmlFor="platonic">Platonic</label>
        </li>
      </menu>
    </div>
  )
}

export default Models
