/* eslint-disable @typescript-eslint/no-var-requires */

// const ballTexture = require('../textures/ball.png')

let loadingResources = 0
const onLoadListeners: Array<() => void> = []

function onResourceLoaded() {
  if (--loadingResources > 0) {
    return
  }

  console.log('Game resources loaded')
  Resources.loading = false
  for (const callback of onLoadListeners) {
    callback()
  }
}

function loadShaderSource(
  fragmentShaderFile: string,
  vertexShaderFile: string,
) {
  return Promise.all([
    fetch(fragmentShaderFile).then((res) => res.text()),
    fetch(vertexShaderFile).then((res) => res.text()),
  ]).then(([fragment, vertex]) => ({
    fragment,
    vertex,
  }))
}

function loadTexture(imgSrc: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onerror = reject
    image.onload = () => resolve(image)
    image.src = imgSrc
  })
}

function parseLoaders<Name extends string, ResourceDataType>(
  resourceLoaders: { name: Name; loader: Promise<ResourceDataType> }[],
) {
  const loadedResources = new Map<Name, ResourceDataType>()

  const resourceGetter = {
    get: (resourceName: Name) => {
      if (!loadedResources.has(resourceName)) {
        throw new Error(`Resource ${resourceName} is not loaded`)
      }
      return loadedResources.get(resourceName) as ResourceDataType
    },
  }

  loadingResources += resourceLoaders.length

  for (const loader of resourceLoaders) {
    loader.loader
      .then((data) => loadedResources.set(loader.name, data))
      .catch(console.error)
      .finally(onResourceLoaded)
  }

  return resourceGetter
}

export const Resources = {
  loading: true,

  shaders: parseLoaders([
    {
      name: 'main',
      loader: loadShaderSource(
        require('./graphics/glsl/main.fs'),
        require('./graphics/glsl/main.vs'),
      ),
    },
  ]),
  textures: parseLoaders([
    {
      name: 'ball',
      loader: loadTexture(require('./graphics/textures/ball.png')),
    },
  ]),

  onLoadingFinished: (callback: () => void) => {
    if (Resources.loading) {
      onLoadListeners.push(callback)
    } else {
      callback()
    }
  },
}
