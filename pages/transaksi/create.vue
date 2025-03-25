<template>

  <Card>
    <template #content>

      <div class="flex flex-col md:flex-row">

        <div class="md:basis-1/4">
          <div class="grid grid-cols-1 gap-2 border rounded-xl md:mr-5 p-5">
            <div v-for="(item,i) in fieldsUser" class="pb-2 border-b">
              <label class="block mb-1">
                {{ item.label }}
                <span v-if="item.key == 'kelas_id' && stKelas == 'pending'" class="text-xs text-slate-300 ms-1">Loading..</span>
                <span v-if="item.key == 'user_id' && stSiswa == 'pending'" class="text-xs text-slate-300 ms-1">Loading..</span>
              </label>
              <div>

                <Select v-if="item.key == 'tahun_ajaran'" v-model="formUser[item.key]" :options="optionsData?.tahun_ajaran" optionLabel="label" optionValue="value" class="w-full"/>
                <Select v-else-if="item.key == 'unit_sekolah_id'" v-model="formUser[item.key]" :options="optionsData?.unitsekolah" optionLabel="label" optionValue="value" class="w-full"/>
                <Select v-else-if="item.key == 'kelas_id'" v-model="formUser[item.key]" :options="optionKelas" optionLabel="label" optionValue="value" class="w-full"/>
                <Select v-else-if="item.key == 'user_id'" v-model="formUser[item.key]" :options="optionSiswa" optionLabel="label" optionValue="value" class="w-full"/>

              </div>
            </div>
          </div>
        </div>
        <div class="md:flex-1">
          <form @submit.prevent="handleFormSubmit" class="flex flex-col gap-2">

            <div v-for="(item, index) in fields">

              <div class="border-b py-1 flex flex-col md:flex-row">
                <label class="md:basis-1/4 mb-1">
                  {{ item.label }}
                </label>
                <div class="md:flex-1">

                  <Select v-if="item.key == 'arus'" v-model="form[item.key]" :options="[{label:'Masuk',value:'masuk'},{label:'Keluar',value:'keluar'}]" optionLabel="label" optionValue="value" class="w-full"/>
                  
                  <Select v-else-if="item.key == 'pendapatan_id'" showClear v-model="form[item.key]" :options="optionsData?.akunpendapatan" optionLabel="label" optionValue="value" class="w-full"/>
                  <Select v-else-if="item.key == 'pengeluaran_id'" showClear v-model="form[item.key]" :options="optionsData?.akunpengeluaran" optionLabel="label" optionValue="value" class="w-full"/>
                  <Select v-else-if="item.key == 'rekening_id'" showClear v-model="form[item.key]" :options="optionsData?.akunrekening" optionLabel="label" optionValue="value" class="w-full"/>


                  <Textarea v-else-if="item.type == 'textarea'" v-model="form[item.key]" class="w-full"/>

                  <InputText v-else v-model="form[item.key]" :type="item.type" class="w-full" />

                  <div v-if="item.desc" class="text-xs text-slate-400 mt-1">
                    {{ item.desc }}
                  </div>
                </div>

              </div>
          </div>

            <div class="text-end">
              <Button type="submit" label="Simpan" class="mt-4">

              <div v-if="isLoading" class="flex justify-between items-center gap-2">
                <Icon name="lucide:loader"  class="animate-spin" /> Memproses..
              </div>
              <div v-else class="flex justify-between items-center gap-2">
                <Icon name="lucide:save" /> Simpan
              </div>

              </Button>
            </div>
          </form>
        </div>

    </div>
            
    </template>
  </Card>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Tambah Transaksi',
})
const { configApp } = useConfigStore()
const client = useSanctumClient();
const isLoading = ref(false)
const toast = useToast();

const formUser = ref({
  tahun_ajaran: configApp?.value?.tahun_ajaran,
  unit_sekolah_id:'',
  kelas_id: '',
  user_id:''
} as any)

const { data:optionKelas,status: stKelas,refresh:roKelas } = await useAsyncData(
    'option-kelas',
    () => client('/api/option/kelas',{
      params:{        
        tahun_ajaran: formUser.value.tahun_ajaran,
        unit_sekolah: formUser.value.unit_sekolah_id
      }
    })
)
const { data:optionSiswa,status: stSiswa, refresh:roSiswa } = await useAsyncData(
    'option-siswa',
    () => client('/api/option/siswakelas',{
      params:{
        kelas_id: formUser.value.kelas_id
      }
    })
)

//watch kelas
watch(() => [formUser.value.tahun_ajaran,formUser.value.unit_sekolah_id], () => {
  roKelas()
})
//watch siswa
watch(
  () => [formUser.value.kelas_id],
  () => {
    roSiswa()
  }
)

const { data:optionsData } = await useAsyncData(
    'option-rekening',
    () => client('/api/options',{
      params:{
        keys: 'tahun_ajaran,unitsekolah,akunrekening,akunpendapatan,akunpengeluaran'
      }
    })
)

const fieldsUser = [
  {key:'tahun_ajaran',label:'Tahun Ajaran',options:[''] },
  {key:'unit_sekolah_id',label:'Sekolah',options:['']},
  {key:'kelas_id',label:'Kelas',options:optionKelas},
  {key:'user_id',label:'Siswa',options:optionSiswa},
]

const fields = [
  { key: 'nama', label: 'Nama', type: 'text', desc: 'Nama / judul transaksi' },
  { key: 'nominal', label: 'Nominal', type: 'number', desc: 'Nominal angka' },
  { key: 'arus', label: 'Arus', type: 'text', desc: 'Masuk / keluar' },
  { key: 'pendapatan_id', label: 'Pendapatan', type: 'select', options:'optionPendapatan', desc: 'Pilih Akun Pendapatan' },
  { key: 'pengeluaran_id', label: 'Biaya', type: 'select', options:'optionPengeluaran', desc: 'Pilih Akun Biaya' },
  { key: 'rekening_id', label: 'Rekening', type: 'select', options:'optionRekening', desc: 'Pilih Akun Rekening' },
  { key: 'tagihan_id', label: 'Tagihan', type: 'text', desc: 'Tagihan' },
  { key: 'keterangan', label: 'Keterangan', type: 'textarea', desc: 'catatan opsional' },
]

const form = ref({
  nama: '',
  nominal: '',
  arus: 'masuk',
  pendapatan_id: '',
  pengeluaran_id:'',
  rekening_id:'CASH',
  tagihan_id:'',
} as any);

const handleFormSubmit = async () => {  
  isLoading.value = true;

  //tambahkan user_id ke form
  form.value.user_id = formUser.value.user_id

  try {
    await client('/api/transaksi', { method: 'POST', body: form.value });
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil ditambah', life: 3000 });
  } catch(er) {
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal ditambahkan', life: 3000 });
  }
  isLoading.value = false;
}

</script>
