<template>
    <UnitSekolahLayout>

      
    <div class="flex flex-col md:flex-row gap-4">
        
        <div class="basis-1/2">
  
          <div class="border p-4 rounded-lg mb-4">
            <div class="font-bold mb-4">
              Pegawai
            </div>
            <DataTable v-if="data.pegawais" :value="data.pegawais"  class="text-sm" stripedRows scrollable>
              <Column field="nama" header="Nama"></Column>
              <Column field="jabatan" header="Jabatan"></Column>
            </DataTable>
          </div>
  
        </div>
  
        <div class="basis-1/2">
          <div class="border p-4 rounded-lg">
            <div class="font-bold mb-4">
              Informasi Profil
            </div>
            <div v-for="item in fields" :key="item.key">
              <div class="border-t py-2 flex flex-col md:flex-row">
                <div class="md:basis-1/4 font-semibold mb-1">{{ item.label }}</div>
                <div class="md:flex-1">{{ data[item.key] }}</div>
              </div>
            </div>
            <div class="text-end">
              <Button as="router-link" :to="'/unitsekolah/'+idUnit+'/edit'" variant="link" size="small" class="!text-sm">
                <Icon name="lucide:pen" mode="svg" /> Edit Profil
              </Button>
            </div>
          </div>
        </div>
  
      </div>

    </UnitSekolahLayout>
</template>

<script setup lang="ts">
  definePageMeta({
      title: 'Unit Sekolah',
  })
  const route = useRoute()
  const idUnit = route.params.id
  const client = useSanctumClient();

  const { data, status, error, refresh } = await useAsyncData(
      'unitsekolah-'+idUnit,
      () => client('/api/unitsekolah/'+idUnit)
  )

  const fields = [
    { label: 'Nama', key: 'nama' },
    { label: 'Jenjang', key: 'jenjang' },
    { label: 'Alamat', key: 'alamat' },
    { label: 'Desa', key: 'desa' },
    { label: 'Kecamatan', key: 'kecamatan' },
    { label: 'Kota', key: 'kota' },
    { label: 'Provinsi', key: 'provinsi' },
    { label: 'Kode Pos', key: 'kode_pos' },
    { label: 'Status', key: 'status' },
    { label: 'Tanggal Berdiri', key: 'tanggal_berdiri' },
    { label: 'Whatsapp', key: 'whatsapp' },
    { label: 'Telepon', key: 'telepon' },
    { label: 'Email', key: 'email' },
  ]

</script>