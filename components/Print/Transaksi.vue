<template>
 {{ props.visible }}
 PRINT
 {{ data }}
  <div v-if="props.visible" id="struk-area">
    Kapan penulis menyang pantai?

    A. Wulan puasa

    B. Dina minggu

    C. Liburan sekolah

    D. Dina rabu
    Jawaban: C

    Kapa rasa penulis nalika ana ing pantai?

    A. Sedhih

    B. Getun

    C. Seneng banget

    D. Kuciwa
    Jawaban: C
  </div>

</template>

<script setup lang="ts">
const props = defineProps(['data','visible'])
const data = props.data
import printJS from 'print-js'

//watch data
watch(() => props.data, () => {
  console.log(data)
  printJS({
    printable:'struk-area',
    type: 'html',
    style: `
      body { font-family: monospace; font-size: 12px; }
      .center { text-align: center; font-weight: bold; }
      .total { font-weight: bold; margin-top: 10px; }
      `
  })
})

onMounted(() => {
  //jika visible true
  if(props.visible){
    printJS({
      printable:'struk-area',
      type: 'html',
      style: `
        body { font-family: monospace; font-size: 12px; }
       .center { text-align: center; font-weight: bold; }
       .total { font-weight: bold; margin-top: 10px; }
       `
    })
  }
  // Tunggu sedikit agar DOM siap dulu sebelum print
  // setTimeout(() => {
  //   printJS({
  //     printable: 'struk-area',
  //     type: 'html',
  //     style: `
  //       body { font-family: monospace; font-size: 12px; }
  //       .center { text-align: center; font-weight: bold; }
  //       .total { font-weight: bold; margin-top: 10px; }
  //     `
  //   })

  // }, 300) // Delay kecil untuk jaga-jaga DOM siap
})
</script>
