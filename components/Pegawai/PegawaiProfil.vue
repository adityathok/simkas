<template>

  <div class="flex justify-center items-center">    
    <UserAvatar :url="data.avatar_url" :name="data.nama" :size="100" />
  </div>

  <Tabs value="0">
      <TabList>
          <Tab value="0">Profil</Tab>
          <Tab value="1">Informasi</Tab>
          <Tab value="2">Alamat</Tab>
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
          <TabPanel value="2">
            <div v-for="field in alamats" :key="field.key" class="border-b py-2">
              <div class="font-semibold mb-1">
                {{ field.label }}
              </div>
              <div>
                {{  data[field.key] }}
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
  const client = useSanctumClient();

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

  const alamats = [
    { label: 'Alamat', key: 'alamat' },
    { label: 'RT', key: 'rt' },
    { label: 'RW', key: 'rw' },
    { label: 'Dusun', key: 'dusun' },
    { label: 'Kelurahan', key: 'kelurahan' },
    { label: 'Kecamatan', key: 'kecamatan' },
    { label: 'Kota', key: 'kota' },
    { label: 'Provinsi', key: 'provinsi' },
    { label: 'Kode Pos', key: 'kode_pos' },
    { label: 'Jenis Tinggal', key: 'jenis_tinggal' },
    { label: 'Transportasi', key: 'transportasi' },
    { label: 'Jarak (km)', key: 'jarak' },
  ]

  onMounted(() => {
      client('/api/useralamat/'+data.user_id).then((res) => {
        data.alamat = res.alamat;
        data.rt = res.rt;
        data.rw = res.rw;
        data.dusun = res.dusun;
        data.kelurahan = res.kelurahan;
        data.kecamatan = res.kecamatan;
        data.kota = res.kota;
        data.provinsi = res.provinsi;
        data.kode_pos = res.kode_pos;
        data.jenis_tinggal = res.jenis_tinggal;
        data.transportasi = res.transportasi;
        data.jarak = res.jarak;
      })
  })

</script>
