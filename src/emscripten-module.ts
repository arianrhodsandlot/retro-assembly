export function getEmscriptenModuleOverrides() {
  let resolveRunDependenciesPromise
  const runDependenciesPromise = new Promise<void>((resolve) => {
    resolveRunDependenciesPromise = resolve
  })

  return {
    noInitialRun: true,
    noExitRuntime: false,

    print(...args) {
      console.info(...args)
    },

    printErr(...args) {
      console.error(...args)
    },

    quit(status, toThrow) {
      if (status) {
        console.info(status, toThrow)
      }
    },

    async monitorRunDependencies(left) {
      if (left === 0) {
        resolveRunDependenciesPromise()
      }
      return await runDependenciesPromise
    },
  }
}
