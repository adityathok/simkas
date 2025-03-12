<template>
  
  <div v-if="error" class="flex flex-col justify-center items-center p-5">
    <Icon name="lucide:archive-x"  size="4em" class="text-yellow-500"/>
    <Message severity="warn" class="my-5">Kelas tidak ditemukan !</Message>
    <Button as="router-link" to="/kelas">
      <Icon name="lucide:chevron-left"  /> Kembali
    </Button>
  </div>

  <Card v-else>

    <template #header>
      <div class="bg-teal-800 min-h-[5em] md:min-h-[6em] rounded-t-xl text-white px-6 py-5">        
        <div class="md:flex justify-start md:justify-between gap-3 items-center">
            <div>
              <h3 class="text-3xl font-bold">
                {{ dataKelas.nama??'-' }}
              </h3>
              <small>
                {{ dataKelas?.tahun_ajaran||'-' }}
              </small>
            </div>
            <div>
              {{ dataKelas?.unit_sekolah.nama||'-' }}
            </div>
        </div>
      </div>
    </template>

    <template #content>
      <AppMenuTabs :items="menus" :active="route.path" class="mb-4" />
      <slot/>
    </template>

  </Card>

</template>

<script setup lang="ts">
const emit = defineEmits(['kelasdata'])
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();
const toast = useToast();

const { data: dataKelas, status, error, refresh } = await useAsyncData(
  'kelas-'+idUnit,
  () => client('/api/kelas/'+idUnit)
)

if (status.value == 'success' && dataKelas) {
  emit('kelasdata', dataKelas.value);
} else if (status.value == 'error') {
  console.log(status.value)
}

const menus = [
  {label: 'Profil', route: '/kelas/'+idUnit+'/'},
  {label: 'Edit', route: '/kelas/'+idUnit+'/edit'},
]

</script>