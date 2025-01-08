<template>

  <div class="flex justify-start items-start">    
    <UserAvatar :url="data.avatar_url" :name="data.nama" :size="100" />
  </div>

  <Tabs value="0">
      <TabList>
          <Tab value="0">Profil</Tab>
          <Tab value="1">Informasi</Tab>
      </TabList>
      <TabPanels>
          <TabPanel value="0">                    
            <div v-for="field in fields" :key="field.key" class="border-b py-2">
              <div class="font-semibold mb-1">
                {{ field.label }}
              </div>
              <div>
                {{  data[field.key] }}
              </div>
            </div>
          </TabPanel>
          <TabPanel value="1">
             <div class="border-b py-2">
                <div class="font-semibold mb-1">Pendidikan Terakhir</div>
                <div>
                  {{  data.metas.pendidikan_terakhir||'-' }}
                </div>
             </div>
             <div class="border-b py-2">
                <div class="font-semibold mb-1">NIK</div>
                <div>
                  {{  data.metas.nik||'-' }}
                </div>
             </div>
             <div class="border-b py-2">
                <div class="font-semibold mb-1">Golongan</div>
                <div>
                  {{  data.metas.golongan||'-' }}
                </div>
             </div>
          </TabPanel>
      </TabPanels>
  </Tabs>

</template>

<script setup lang="ts">
  const props = defineProps(['idpegawai','data'])
  const idpegawai = props.idpegawai || '';
  const data = props.data

  const fields = [
    { label: 'NIP', key: 'nip' },
    { label: 'Nama', key: 'nama' },
    { label: 'Status', key: 'status' },
    { label: 'Tempat Lahir', key: 'tempat_lahir' },
    { label: 'Tanggal Lahir', key: 'tanggal_lahir' },
    { label: 'Tanggal Masuk', key: 'tanggal_masuk' },
    { label: 'Jenis Kelamin', key: 'jenis_kelamin' },
    { label: 'Email', key: 'email' },
  ]

</script>
