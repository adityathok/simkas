<template>
  
  <SiswaLayoutEdit>

    <div class="text-xl font-bold mb-3 md:mb-6">
      Edit Profil Siswa
    </div>

    <form @submit.prevent="handleFormSubmit">

      <div v-for="item in fields" :key="item.key" class="border-b py-3 flex flex-col md:flex-row">
        <div class="md:basis-1/4 lg:basis-1/6 font-semibold mb-1">
          <label :for="item.key">{{ item.label }}</label>
        </div>
        <div class="md:flex-1">

          <div v-if="status=='pending'">
            <Skeleton height="2rem" class="mb-2"/>
          </div>
          <div v-else>
            
            <div v-if="item.type == 'select'">
              <Select v-model="form[item.key]" :id="item.key" :options="item.options" placeholder="Pilih" class="w-full" />
            </div>
            <InputText v-else v-model="form[item.key]" :id="item.key" :type="item.type" class="w-full" />

            <div v-if="errors[item.key]">
              <Message severity="error" closable class="my-1">
                {{ errors[item.key][0] }}
              </Message>
            </div>
          </div>

        </div>
      </div>
      <div class="text-end">
        <Button type="submit" class="mt-4" :loading="isLoading">
          <div v-if="isLoading" class="flex items-center gap-1">
            <Icon name="lucide:loader" mode="svg" class="animate-spin"/> <span>Memproses..</span>
          </div>
          <div v-else class="flex items-center gap-1">
            <Icon name="lucide:save" mode="svg"/> <span>Simpan</span>
          </div>
        </Button>
      </div>

    </form>

  </SiswaLayoutEdit>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Edit Siswa',
})
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();
const toast = useToast();
const isLoading = ref(false)
const errors = ref({} as any)

const { data, status, error, refresh } = await useAsyncData(
  'siswa-'+idUnit,
  () => client('/api/siswa/'+idUnit)
)

const fields = ref([
  {
    label: 'Nama',
    key: 'nama',
    type: 'text'
  },
  {
    label: 'Nama Panggilan',
    key: 'nama_panggilan',
    type: 'text'
  },
  {
    label: 'NIS',
    key: 'nis',
    type: 'text'
  },
  {
    label: 'NISN',
    key: 'nisn',
    type: 'text'
  },
  {
    label: 'Tempat Lahir',
    key: 'tempat_lahir',
    type: 'text'
  },
  {
    label: 'Tanggal Lahir',
    key: 'tanggal_lahir',
    type: 'date'
  },
  {
    label: 'Jenis Kelamin',
    key: 'jenis_kelamin',
    type: 'select',
    options: ['Laki-laki', 'Perempuan']
  },
  {
    label: 'Tanggal Masuk',
    key: 'tanggal_masuk',
    type: 'text'
  },
  {
    label: 'Email',
    key: 'email',
    type: 'text'
  },
  {
    label: 'Status',
    key: 'status',
    type: 'select',
    options: ['Aktif', 'Keluar', 'Pindah', 'Lulus']
  },
])

const form = ref({
  nama: '',
  nama_panggilan: '',
  nis: '',
  nisn: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  tanggal_masuk: '',
  status: '',
  jenis_kelamin: '',
  email: '',
} as any)

onMounted(() => {
  form.value = data.value
})

const handleFormSubmit = async () => {
  isLoading.value = true;
  errors.value = {};
  try {
    await client('/api/siswa/'+idUnit, {
      method: 'PUT',
      body: form.value
    })
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
  } catch (error) {
    const e = useSanctumError(error);
    errors.value = e.bag;
    console.log(e.bag);
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal diperbarui', life: 3000 });
  }
  isLoading.value = false;
}
</script>