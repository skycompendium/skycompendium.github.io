import React from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { TIFFLoader } from 'three/addons/loaders/TIFFLoader.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

const StarMap = () => {
  const sceneRef = React.useRef<HTMLDivElement>(null)
  const [isDome, setIsDome] = React.useState(false)
  const [controls, setControls] = React.useState<OrbitControls>()
  const [material, setMaterial] = React.useState<THREE.ShaderMaterial>()

  React.useEffect(() => {
    const currentScene = sceneRef.current

    // camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 20)

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.toneMapping = THREE.CineonToneMapping
    renderer.toneMappingExposure = 8.8
    currentScene && currentScene.appendChild(renderer.domElement)

    // controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target = new THREE.Vector3(0, 0, 0)
    controls.enableDamping = true
    controls.update()
    setControls(controls)

    // textures
    const textureLoader = new THREE.TextureLoader()
    const texturesPath = 'https://raw.githubusercontent.com/skycompendium/gallery/main/textures'
    const starmapTexture = textureLoader.load(`${texturesPath}/starmap_2020_4k.jpg`)
    starmapTexture.magFilter = THREE.LinearFilter
    starmapTexture.minFilter = THREE.LinearFilter
    starmapTexture.colorSpace = THREE.SRGBColorSpace

    const tiffLoader = new TIFFLoader()
    const constellationsTexture = tiffLoader.load(`${texturesPath}/constellation_figures_2k.tif`)
    starmapTexture.magFilter = THREE.LinearFilter
    starmapTexture.minFilter = THREE.LinearFilter
    constellationsTexture.colorSpace = THREE.SRGBColorSpace

    // star dome/globe
    const geometry = new THREE.IcosahedronGeometry(10, 16)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_starmap: { value: starmapTexture },
        u_constellations: { value: constellationsTexture },
      },
      vertexShader: `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
      fragmentShader: `
uniform sampler2D u_starmap;
uniform sampler2D u_constellations;

varying vec2 vUv;

void main() {
  vec4 t1 = texture(u_starmap, vUv);
  vec4 t2 = texture(u_constellations, vUv);

  if (t2.r + t2.g + t2.b > 0.9) {
    gl_FragColor = vec4(t1.r + 0.003, t1.g + 0.003, t1.b + 0.003, 1.0);
  } else {
    gl_FragColor = t1;
  }
}
`,
      depthWrite: false,
    })
    setMaterial(material)

    const starMap = new THREE.Mesh(geometry, material)

    // scene
    const scene = new THREE.Scene()
    scene.add(starMap)

    // post-processing
    const renderPass = new RenderPass(scene, camera)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.16, 0.1, 0)
    const outputPass = new OutputPass()

    const composer = new EffectComposer(renderer)
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
      controls.update()
      composer.render()
    }
    renderer.setAnimationLoop(animate)

    // clean-up
    return () => {
      renderer.setAnimationLoop(null)
      currentScene && currentScene.removeChild(renderer.domElement)
      controls.dispose()
      renderer.forceContextLoss()
      renderer.dispose()
      scene.traverse((node) => {
        if ('dispose' in node && typeof node.dispose === 'function') {
          node.dispose()
        }
      })
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // set appropriate controls for the dome, and the globe
  React.useEffect(() => {
    if (controls) {
      if (isDome) {
        controls.minDistance = 0.2
        controls.maxDistance = 20
        controls.rotateSpeed = -0.36
      } else {
        controls.minDistance = 15
        controls.maxDistance = 36
        controls.rotateSpeed = 0.36
      }
      controls.update()
    }

    if (material) material.side = isDome ? THREE.BackSide : THREE.FrontSide
  }, [controls, material, isDome])

  return (
    <div className="StarMap" ref={sceneRef}>
      <menu>
        <li>
          <input type="radio" name="map" id="dome"checked={isDome} onChange={() => setIsDome(true) } />
          <label htmlFor="dome">Dome</label>
        </li>
        <li>
          <input type="radio" name="map" id="globe"checked={!isDome} onChange={() => setIsDome(false) } />
          <label htmlFor="globe">Globe</label>
        </li>
      </menu>
    </div>
  )
}

export default StarMap
