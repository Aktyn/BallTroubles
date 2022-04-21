/* eslint-disable @typescript-eslint/no-var-requires */
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
      name: 'particles',
      loader: loadShaderSource(
        require('../assets/shaders/particles.fs'),
        require('../assets/shaders/particles.vs'),
      ),
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
