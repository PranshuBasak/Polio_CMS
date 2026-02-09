const clampVolume = (value: number) => Math.min(1, Math.max(0, value / 100))

export type StrudelSampleSource =
  | string
  | {
      samples: Record<string, string | string[]>
      baseUrl: string
    }

export const STRUDEL_REQUIRED_SAMPLE_SOURCES: readonly StrudelSampleSource[] = [
  {
    samples: {
      bd: "bd/BT0AADA.wav",
      hh: "hh27/000_hh27closedhh.wav",
      sd: ["sd/rytm-01-classic.wav", "sd/rytm-00-hard.wav"],
    },
    baseUrl: "https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/",
  },
]

export const STRUDEL_OPTIONAL_SAMPLE_SOURCES: readonly StrudelSampleSource[] = ["github:eddyflux/crate"]

export const buildNeonPulseScript = (volume: number) => {
  return `
setcpm(130/4);
sound(
  "bd*4, sd*2, [hh hh hh hh]*2", 
  "casio:2*4, jazz*2" 
).bank("RolandTR808");


setcpm(128/4);
sound("[bd sd]*4, [hh - hh -]*4, [cp - cp -]*2").bank("RolandTR707");


setcpm(135/4);
sound(
  "bd*8, sd*4, hh*16*2", 
  "jazz:0 jazz:1 jazz:2 jazz:3 jazz:4 jazz:5 jazz:6 jazz:7" 
).bank("RolandTR808")
sound("bd*2, [- cp]*1").bank("RolandTR909");

samples('github:eddyflux/crate')
setcps(.75)
let chords = chord("<Bbm9 Fm9>/4").dict('ireal')
stack(
  stack( 
    s("bd").struct("<[x*<1 2> [~@3 x]] x>"),
    s("~ [rim, sd:<2 3>]").room("<0 .2>"),
    n("[0 <1 3>]*<2!3 4>").s("hh"),
    s("rd:<1!3 2>*2").mask("<0 0 1 1>/16").gain(.5)
  ).bank('crate')
  .mask("<[0 1] 1 1 1>/16".early(.5))
  , 
  chords.offset(-1).voicing().s("gm_epiano1:1")
  .phaser(4).room(.5)
  , 
  n("<0!3 1*2>").set(chords).mode("root:g2")
  .voicing().s("gm_acoustic_bass"),
  chords.n("[0 <4 3 <2 5>>*2](<3 5>,8)")
  .anchor("D5").voicing()
  .segment(4).clip(rand.range(.4,.8))
  .room(.75).shape(.3).delay(.25)
  .fm(sine.range(3,8).slow(8))
  .lpf(sine.range(500,1000).slow(8)).lpq(5)
  .rarely(ply("2")).chunk(4, fast(2))
  .gain(perlin.range(.6, .9))
  .mask("<0 1 1 0>/16")
)
.late("[0 .01]*4").late("[0 .01]*2").size(4).gain(${clampVolume(volume).toFixed(2)})
`
}
