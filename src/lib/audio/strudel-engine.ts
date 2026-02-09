import clientLogger from "@/lib/logger/client-logger"
import {
  buildNeonPulseScript,
  STRUDEL_OPTIONAL_SAMPLE_SOURCES,
  STRUDEL_REQUIRED_SAMPLE_SOURCES,
  type StrudelSampleSource,
} from "./strudel-script"

type StrudelWebModule = typeof import("@strudel/web")

const ANALYZER_ID = 1

class StrudelEngine {
  private webModule: StrudelWebModule | null = null
  private initialized = false
  private samplesLoaded = false
  private playing = false
  private currentVolume = 37
  private initPromise: Promise<void> | null = null
  private loadSamplesPromise: Promise<void> | null = null

  private async ensureModules() {
    if (this.webModule) {
      return
    }

    const webModule = await import("@strudel/web")

    this.webModule = webModule
  }

  async init() {
    if (this.initialized) {
      return
    }

    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = (async () => {
      await this.ensureModules()

      if (!this.webModule) {
        throw new Error("Strudel web module not available")
      }

      clientLogger.info("Strudel init started")
      await Promise.resolve(this.webModule.initStrudel())
      this.initialized = true
      clientLogger.info("Strudel init completed")
    })()

    try {
      await this.initPromise
    } finally {
      this.initPromise = null
    }
  }

  async loadSamples() {
    if (this.samplesLoaded) {
      return
    }

    if (this.loadSamplesPromise) {
      return this.loadSamplesPromise
    }

    this.loadSamplesPromise = (async () => {
      await this.init()

      if (!this.webModule) {
        throw new Error("Strudel evaluate API unavailable")
      }

      clientLogger.info("Strudel sample preload started")
      await this.loadSamplesWithFallback()
      this.samplesLoaded = true
      clientLogger.info("Strudel sample preload completed")
    })()

    try {
      await this.loadSamplesPromise
    } finally {
      this.loadSamplesPromise = null
    }
  }

  async play(volume: number) {
    await this.init()
    await this.loadSamples()

    if (!this.webModule) {
      throw new Error("Strudel play API unavailable")
    }

    // Explicit resume for browsers that keep the context suspended.
    try {
      const audioContext = this.webModule.getAudioContext?.()
      if (audioContext && audioContext.state === "suspended") {
        await audioContext.resume()
      }
    } catch (error) {
      clientLogger.warn("Unable to resume Strudel audio context", {
        error: error instanceof Error ? error.message : "unknown",
      })
    }

    this.currentVolume = volume
    const script = buildNeonPulseScript(volume)

    clientLogger.debug("Strudel play evaluate", { volume })
    await this.webModule.evaluate(script, true)
    this.playing = true
  }

  async stop() {
    if (!this.webModule || !this.initialized) {
      this.playing = false
      return
    }

    clientLogger.debug("Strudel hush invoked")
    this.webModule.hush()
    this.playing = false
  }

  async setVolume(volume: number) {
    this.currentVolume = Math.min(100, Math.max(0, Math.round(volume)))

    if (!this.playing) {
      return
    }

    if (!this.webModule) {
      return
    }

    const script = buildNeonPulseScript(this.currentVolume)
    clientLogger.debug("Strudel live volume update", { volume: this.currentVolume })
    await this.webModule.evaluate(script, true)
  }

  private async loadSamplesWithFallback() {
    if (!this.webModule) {
      throw new Error("Strudel samples API unavailable")
    }

    try {
      for (const source of STRUDEL_REQUIRED_SAMPLE_SOURCES) {
        await this.preloadSampleSource(source)
      }
    } catch (error) {
      clientLogger.warn("Required samples() preload failed", {
        error: error instanceof Error ? error.message : "unknown",
      })
      throw error instanceof Error ? error : new Error("Unable to load required Strudel sample sources.")
    }

    for (const source of STRUDEL_OPTIONAL_SAMPLE_SOURCES) {
      try {
        await this.preloadSampleSource(source)
      } catch (error) {
        clientLogger.warn("Optional sample source failed; continuing", {
          source,
          error: error instanceof Error ? error.message : "unknown",
        })
      }
    }

  }

  private async preloadSampleSource(source: StrudelSampleSource) {
    if (!this.webModule) {
      throw new Error("Strudel samples API unavailable")
    }

    if (typeof source === "string") {
      await this.webModule.samples(source)
      return
    }

    await this.webModule.samples(source.samples, source.baseUrl)
  }

  getCurrentVolume() {
    return this.currentVolume
  }

  isPlaying() {
    return this.playing
  }

  getSpectrumFrame() {
    if (!this.webModule) {
      return null
    }

    try {
      const frame =
        this.readAnalyzerFrame("frequency", ANALYZER_ID) ??
        this.readAnalyzerFrame("frequency", 0) ??
        this.readAnalyzerFrame("time", ANALYZER_ID) ??
        this.readAnalyzerFrame("time", 0)

      return frame ? Array.from(frame) : null
    } catch {
      return null
    }
  }

  private readAnalyzerFrame(type: "frequency" | "time", id: number) {
    if (!this.webModule?.getAnalyzerData) {
      return null
    }

    try {
      const frame = this.webModule.getAnalyzerData(type, id)
      if (!frame || frame.length === 0) {
        return null
      }

      return frame
    } catch {
      return null
    }
  }

  async dispose() {
    await this.stop()
    this.initialized = false
    this.samplesLoaded = false
    this.webModule = null
  }
}

let singleton: StrudelEngine | null = null

export const getStrudelEngine = () => {
  if (!singleton) {
    singleton = new StrudelEngine()
  }

  return singleton
}
