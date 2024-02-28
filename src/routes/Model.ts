import * as THREE from 'three'

const TEXTURES_PATH = 'https://raw.githubusercontent.com/skycompendium/gallery/main/textures'

const geometry = new THREE.IcosahedronGeometry(1, 16)

const Earth = (textureLoader: THREE.TextureLoader) => {
  const earth = createMesh(textureLoader, 'earth_daymap', THREE.MeshLambertMaterial)

  const cloudsTexture = textureLoader.load(`${TEXTURES_PATH}/earth_clouds.jpg`)
  cloudsTexture.colorSpace = THREE.SRGBColorSpace
  cloudsTexture.magFilter = THREE.LinearFilter
  cloudsTexture.minFilter = THREE.LinearFilter
  const cloudsMaterial = new THREE.MeshLambertMaterial({ alphaTest: 0.1, alphaMap: cloudsTexture, map: cloudsTexture })
  const clouds = new THREE.Mesh(geometry, cloudsMaterial)
  clouds.castShadow = true
  clouds.receiveShadow = true
  clouds.scale.set(1.01, 1.01, 1.01)

  const earthGroup = new THREE.Group()
  earthGroup.add(earth)
  earthGroup.add(clouds)
  return earthGroup
}

const FixedStars = (textureLoader: THREE.TextureLoader) => {
  const stars = createMesh(textureLoader, '2k_stars_milky_way', THREE.MeshBasicMaterial)
  stars.material.side = THREE.BackSide
  return stars
}

const Jupiter = (textureLoader: THREE.TextureLoader) =>
  createMesh(textureLoader, 'jupiter', THREE.MeshLambertMaterial)

const Mars = (textureLoader: THREE.TextureLoader) =>
  createMesh(textureLoader, 'mars', THREE.MeshLambertMaterial)

const Mercury = (textureLoader: THREE.TextureLoader) =>
  createMesh(textureLoader, 'mercury', THREE.MeshLambertMaterial)

const Moon = (textureLoader: THREE.TextureLoader) =>
  createMesh(textureLoader, 'moon', THREE.MeshLambertMaterial)

const Saturn = (textureLoader: THREE.TextureLoader) =>
  createMesh(textureLoader, 'saturn', THREE.MeshLambertMaterial)

const Sun = (textureLoader: THREE.TextureLoader) => {
  const sun = createMesh(textureLoader, 'sun', THREE.MeshBasicMaterial)
  const sunlight = new THREE.PointLight(0xffffff)
  sunlight.power = 9800
  sunlight.castShadow = true

  const sunGroup = new THREE.Group()
  sunGroup.add(sun)
  sunGroup.add(sunlight)
  return sunGroup
}

const Venus = (textureLoader: THREE.TextureLoader) =>
  createMesh(textureLoader, 'venus_atmosphere', THREE.MeshLambertMaterial)

const createMesh = (textureLoader: THREE.TextureLoader, texturePath: string, Material: new ({ map }: { map: THREE.Texture }) => THREE.Material) => {
  const texture = textureLoader.load(`${TEXTURES_PATH}/${texturePath}.jpg`)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter
  const mesh = new THREE.Mesh(geometry, new Material({ map: texture }))
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

export default { Earth, FixedStars, Jupiter, Mars, Mercury, Moon, Saturn, Sun, Venus }
