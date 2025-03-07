<template>
  <KelasLayout @kelasdata="handleKelasData">

    <div class="flex flex-col md:flex-row gap-4">      

      <div class="md:basis-1/4">
        <div class="border min-h-10 w-full p-3 rounded-sm">
          <div class="mb-3">
            <Icon name="lucide:user" mode="svg" class="inline" /> Wali Kelas
          </div>
          <div class="text-xl font-bold">
            {{ datakelas.wali.name }}
          </div>
        </div>
        <div class="border min-h-10 w-full p-3 rounded-sm mt-4">
          <div class="mb-3">
            <Icon name="lucide:info" mode="svg" class="inline" /> Info Kelas
          </div>
          <div> 
            <div class="border-t py-1">
              <span class="font-semibold">Nama : </span>
              <span> {{ datakelas.nama }} </span>
            </div>           
            <div class="border-t py-1">
              <span class="font-semibold">Tingkat : </span>
              <span> {{ datakelas.tingkat }} </span>
            </div> 
            <div class="border-t pt-1">
              <span class="font-semibold">Tahun Ajaran : </span>
              <span> {{ datakelas.tahun_ajaran }} </span>
            </div> 
            <div class="border-t pt-1">
              <span class="font-semibold">Unit : </span>
              <span> {{ datakelas.unit_sekolah?.nama }} </span>
            </div> 
          </div>
        </div>
      </div>

      <div class="md:flex-1">
        <div class="border min-h-10 w-full p-3 rounded-sm">
          <div class="mb-3">
            <Icon name="lucide:users" mode="svg" class="inline" /> Daftar Siswa
          </div>
          <div>

            <DataTable :value="siswaKelas"  class="text-sm" stripedRows scrollable>
              <Column field="nama" header="Nama">
                <template #body="slotProps">
                  <div class="flex justify-start items-center">
                    <UserAvatar :url="slotProps.data.avatar_url" :name="slotProps.data.nama" :size="32" class="min-w-[32px] rounded-full me-2"/>

                    <NuxtLink :to="'/siswa/'+slotProps.data.id" target="_blank" class="cursor-pointer hover:underline">
                      {{ slotProps.data.nama }}
                    </NuxtLink>
                  </div>
                </template>
              </Column>
              <Column field="nis" header="NIS"></Column>
              <Column field="nisn" header="NISN"></Column>
              <Column field="act" header="">
                <template #body="slotProps">
                  <div class="flex justify-end">
                    <Button severity="danger" variant="text" @click="confirmDelete(slotProps.data)">
                      <Icon v-if="loadDelete" name="lucide:loader" mode="svg" class="animate-spin" />
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </Button>
                  </div>
                </template>
              </Column>
            </DataTable>

          </div>
        </div>
      </div>

    </div>

  </KelasLayout>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Profil Kelas',
})
const route = useRoute()
const idKelas = route.params.id
const client = useSanctumClient();
const toast = useToast();
const confirm = useConfirm();

const datakelas = ref({} as any)
const handleKelasData = (data: any) => {
  datakelas.value = data
}

const { data: siswaKelas, status: ssiswaKelas, refresh: fsiswaKelas } = await useAsyncData('siswakelas-'+idKelas, () =>
    client('/api/siswakelas/'+idKelas)
);

const loadDelete = ref(false)

const confirmDelete = (data: any) => {
    confirm.require({
        message: 'Yakin untuk menghapus siswa dari kelas ?',
        header: 'Hapus Siswa',
        rejectLabel: 'Batal',
        rejectProps: {
            label: 'Batal',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Hapus',
            severity: 'danger'
        },
        accept: async () => {
          loadDelete.value = true
            try {
              await client('/api/siswakelas/'+idKelas+'?siswa='+data.id, { method: 'DELETE' }) 
              fsiswaKelas()
              toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil dihapus', life: 3000 });
            }  catch(er) {
              console.log(er)
            }
            loadDelete.value = false
        },
    });
};
</script>
