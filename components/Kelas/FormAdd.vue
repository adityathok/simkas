<template>
<form  @submit.prevent="handleFormSubmit">
     <div v-for="item in fields" :key="item.key">
        <div class="border-b py-2 flex flex-col md:flex-row">
          <div class="md:basis-1/4 font-semibold mb-1">
            <label>{{ item.label }}</label>
          </div>
          <div class="md:flex-1">

            <div v-if="item.key == 'wali_id'" class="w-full">
              <Select filter v-model="form.wali_id" :options="pegawais" optionLabel="label" optionValue="value" placeholder="Pilih Pegawai" class="w-full">
        
                  <template #option="slotProps">
                        <div class="flex items-center">
                            <img :alt="slotProps.option.label" :src="slotProps.option.image" class="rounded-full me-3" style="width: 2rem" />
                            <div>
                              <div>{{ slotProps.option.label }}</div>
                              <small class="opacity-50">{{ slotProps.option.nip }}</small>
                            </div>
                        </div>
                  </template>

              </Select>
            </div>

            <div v-else-if="item.key == 'unit_sekolah'" class="w-full">
              <Select filter v-model="form.unit_sekolah_id" :options="units" optionLabel="label" optionValue="value" placeholder="Pilih Unit" class="w-full" />
            </div>

            <div v-else-if="item.key == 'tahun_ajaran'" class="w-full flex flex-row justify-start">
                <InputText type="number" v-model.number="form.tahun_ajaran_1" class="w-20" />
                <span class="px-1 py-3">/</span>
                <InputText type="number" v-model.number="form.tahun_ajaran_2" class="w-20" />
            </div>
            
            <div v-else-if="item.key == 'tingkat'" class="w-full">
              <Select filter v-model="form.tingkat" :options="filteredTingkat" placeholder="Pilih Tingkat" class="w-full" :disabled="filteredTingkat.length === 0"/>
            </div>

            <InputText v-else-if="item.key == 'nama'" v-model="form.nama" :type="item.type" class="w-full" />

            <Message v-if="errors[item.key]" severity="error" class="mt-1" closable>
              {{ errors[item.key][0] }}
            </Message>

          </div>
        </div>
     </div>
     <div class="flex justify-end mt-4">
      <Button type="submit" :loading="isLoading">           
          <span v-if="isLoading" class="flex gap-2 items-center">
            <Icon class="animate-spin" name="lucide:loader" mode="svg"/> Memproses..         
          </span>
          <span v-else class="flex gap-2 items-center">
            <Icon name="lucide:save" mode="svg"/> Simpan        
          </span> 

        </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits(['add'])
const isLoading = ref(false)
const toast = useToast();
const client = useSanctumClient();
const errors = ref({} as any)

const fields = [
  { label: 'Tahun Ajaran', key: 'tahun_ajaran', type: 'text' },
  { label: 'Unit Sekolah', key: 'unit_sekolah', type: 'select', options: ['SD', 'SMP', 'SMA'] },
  { label: 'Nama', key: 'nama', type: 'text' },
  { label: 'Tingkat', key: 'tingkat', type: 'text' },
  { label: 'Wali Kelas', key: 'wali_id', type: 'select' },
]

const { tahunAjaran, tahunMulai, tahunSelesai } = useTahunAjaran();

const form = ref({
  tahun_ajaran_1: tahunMulai as any,
  tahun_ajaran_2: tahunSelesai as any,
  tahun_ajaran: '',
  unit_sekolah_id: '',
  nama: '',
  tingkat: '',
  wali_id: '',
})

const tahun_ajaran_options = ref({} as any)
const units = ref({} as any)
const pegawais = ref({} as any)
const { data, status, error, refresh } = await useAsyncData(
    'option-add-kelas', () => client('/api/form-options/option-add-kelas')
)
if(data){
  tahun_ajaran_options.value = data.value.tahun_ajaran_options.map((tahun: any) => ({
    value: tahun,
    label: tahun,
  }))
  units.value = data.value.unit_sekolah.map((unit: any) => ({
    value: unit.id,
    label: unit.nama,
  }))
  pegawais.value = data.value.pegawai.map((user: { user_id: any; nama: string;nip: string; avatar: string; }) => ({
    value: user.user_id,
    label: user.nama,
    nip: user.nip,
    image: user.avatar
  }));
}

const filteredTingkat = computed(() => {
  const sekolah = data.value.unit_sekolah.find((s: { id: string; }) => s.id === form.value.unit_sekolah_id);
  return sekolah ? sekolah.tingkat : [];
});

const handleFormSubmit = async () => {  
  isLoading.value = true;
  //ubah value form
  form.value.tahun_ajaran = form.value.tahun_ajaran_1 + '/' + form.value.tahun_ajaran_2;
  
  try {
    const res = await client('/api/kelas/', { method: 'POST', body: form.value });
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Kelas berhasil ditambahkan', life: 3000 });
    emit('add')
  } catch (error) {
    const er = useSanctumError(error);
    errors.value = er.bag;
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Kelas gagal ditambahkan', life: 3000 });
  }
  isLoading.value = false;
}

</script>
