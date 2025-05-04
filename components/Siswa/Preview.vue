<template>

  <Tabs value="0">
    <TabList>
        <Tab value="0">Profil</Tab>
        <Tab value="1">Alamat</Tab>
        <Tab value="2">Info</Tab>
        <Tab value="3">Wali</Tab>
    </TabList>
    <TabPanels>
        <TabPanel value="0"> 
          <SiswaIndexProfil :id="data.id" />
        </TabPanel>

        <TabPanel value="1">    
          <SiswaIndexAlamat :datasiswa="fetchData"/>
        </TabPanel>

        <TabPanel value="2">    
          <SiswaIndexInformasi :id="data.id"/>
        </TabPanel>

        <TabPanel value="3">    
          <SiswaIndexInfoWali :id="data.id"/>
        </TabPanel>
        
    </TabPanels>
  </Tabs>

</template>

<script setup lang="ts">
const props = defineProps(['data'])
const data = props.data
const client = useSanctumClient();

const { data: fetchData, status, error, refresh } = await useAsyncData(
  'siswa-'+data.id,
  () => client('/api/siswa/'+data.id)
)
</script>
