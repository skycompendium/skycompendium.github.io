import React from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

const Models = () => {
  const sceneRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const currentScene = sceneRef.current

    // camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 32)
    camera.up = new THREE.Vector3(0, 1, 0)

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.toneMapping = THREE.CineonToneMapping
    renderer.toneMappingExposure = 3.0
    renderer.shadowMap.enabled = true

    currentScene && currentScene.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)

    // controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target = new THREE.Vector3(0, 0, 0)
    controls.minDistance = 0.1
    controls.maxDistance = 60
    controls.enableDamping = true
    controls.update()

    // textures
    const textureLoader = new THREE.TextureLoader()
    const texturesPath = 'https://raw.githubusercontent.com/skycompendium/gallery/main/textures'

    const clouds = (() => {
      const texture = textureLoader.load(`${texturesPath}/2k_earth_clouds.jpg`)
      texture.colorSpace = THREE.SRGBColorSpace
      const geometry = new THREE.IcosahedronGeometry(1.01, 16)
      const material = new THREE.MeshPhongMaterial({ alphaHash: false, color: '#eeeeee', alphaTest: 0.1, alphaMap: texture })
      return new THREE.Mesh(geometry, material)
    })()
    clouds.castShadow = true
    clouds.receiveShadow = true

    const planet = ({ name, size }: { name: string, size: number }) => {
      const texture = textureLoader.load(`${texturesPath}/2k_${name}.jpg`)
      texture.magFilter = THREE.LinearFilter
      texture.minFilter = THREE.LinearFilter
      texture.colorSpace = THREE.SRGBColorSpace
      const geometry = new THREE.IcosahedronGeometry(size, 16)
      const material = new THREE.MeshPhongMaterial({ map: texture })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.receiveShadow = true
      mesh.castShadow = true
      return mesh
    }

    const star = ({ name, size }: { name: string, size: number }) => {
      const texture = textureLoader.load(`${texturesPath}/2k_${name}.jpg`)
      texture.magFilter = THREE.LinearFilter
      texture.minFilter = THREE.LinearFilter
      texture.colorSpace = THREE.SRGBColorSpace
      const geometry = new THREE.IcosahedronGeometry(size, 16)
      const material = new THREE.MeshBasicMaterial({ map: texture })
      return new THREE.Mesh(geometry, material)
    }

    const earth = planet({ name: 'earth_daymap', size: 1 })

    const moon = planet({ name: 'moon', size: 0.2 })
    const moonGroup = new THREE.Group()
    moonGroup.add(moon)

    const sun = star({ name: 'sun', size: 0.9 })
    const sunlight = new THREE.PointLight('#ffffff', 360, 1000)
    sunlight.castShadow = true
    const sunGroup = new THREE.Group()
    sunGroup.add(sunlight)
    sunGroup.add(sun)

    const jupiter = planet({ name: 'jupiter', size: 0.4 })
    const jupiterGroup = new THREE.Group()
    jupiterGroup.add(jupiter)

    const mercury = planet({ name: 'mercury', size: 0.3 })
    const mercuryGroup = new THREE.Group()
    mercuryGroup.add(mercury)

    const mars = planet({ name: 'mars', size: 0.4 })
    const marsGroup = new THREE.Group()
    marsGroup.add(mars)

    const venus = planet({ name: 'venus_atmosphere', size: 0.6 })
    const venusGroup = new THREE.Group()
    venusGroup.add(venus)

    const saturn = planet({ name: 'saturn', size: 0.6 })
    const saturnGroup = new THREE.Group()
    saturnGroup.add(saturn)

    const stars = star({ name: 'stars_milky_way', size: 32 })
    stars.material.side = THREE.BackSide
    stars.rotation.z += THREE.MathUtils.degToRad(63)

    earth.position.set(0, 0, 0)
    earth.rotation.y += THREE.MathUtils.degToRad(23.44)
    clouds.position.set(0, 0, 0)
    clouds.rotation.y += earth.rotation.y += THREE.MathUtils.degToRad(23.44)
    moon.position.set(5, 0, 0)
    sun.position.set(9, 0, 0)
    sunlight.position.set(9, 0, 0)
    jupiter.position.set(16, 0, 0)
    mercury.position.set(19, 0, 0)
    mars.position.set(23, 0, 0)
    venus.position.set(25, 0, 0)
    saturn.position.set(28, 0, 0)
    stars.position.set(0, 0, 0)

    // scene
    const scene = new THREE.Scene()
    scene.add(earth)
    scene.add(clouds)
    scene.add(moonGroup)
    scene.add(sunGroup)
    scene.add(jupiterGroup)
    scene.add(mercuryGroup)
    scene.add(marsGroup)
    scene.add(venusGroup)
    scene.add(saturnGroup)
    scene.add(stars)
    scene.add(new THREE.AmbientLight(0x363636))

    // post-processing
    const renderPass = new RenderPass(scene, camera)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.3, 0.1, 0)
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
      moonGroup.rotation.y -= 0.0037
      sunGroup.rotation.y -= 0.0036
      jupiterGroup.rotation.y -= 0.002
      mercuryGroup.rotation.y -= 0.0017
      marsGroup.rotation.y += 0.001
      venusGroup.rotation.y -= 0.0002
      saturnGroup.rotation.y -= 0.0001
      stars.rotation.y += 0.00361
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
