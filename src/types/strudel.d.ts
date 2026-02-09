declare module "@strudel/web" {
  export type SampleMap = Record<string, string | string[] | SampleMap>
  export type AnalyzerDataType = "frequency" | "time"
  export type InitStrudelOptions = {
    prebake?: () => Promise<unknown> | unknown
    miniAllStrings?: boolean
  } & Record<string, unknown>

  export function initStrudel(options?: InitStrudelOptions): Promise<unknown> | unknown
  export function samples(source: string | SampleMap, baseUrl?: string): Promise<void>
  export function getAudioContext(): AudioContext
  export function getAnalyzerData(type: AnalyzerDataType, id?: number): ArrayLike<number>
  export function evaluate(code: string, autoplay?: boolean): Promise<unknown>
  export function hush(): void
}

declare module "@strudel/webaudio" {
  export type AnalyzerDataType = "frequency" | "time"
  export function getAnalyzerData(type: AnalyzerDataType, id?: number): ArrayLike<number>
}
