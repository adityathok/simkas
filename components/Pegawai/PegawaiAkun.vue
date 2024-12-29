<template>

  <form @submit.prevent="handleFormSubmit">
    <div class="flex flex-col gap-4 md:max-w-lg">   

      <Message v-if="!data.user" severity="warn">{{ data.nama }}, belum memiliki akun untuk login</Message> 
      <Message v-else severity="warn">Ubah password login untuk {{ data.nama }}</Message> 

      <div>
          <label for="email">Email</label>
          <InputText id="email" disabled v-model="form.email" type="text" size="large" class="w-full"/>
      </div>   
      <div>
          <label for="password">Password</label>
          <InputText id="password" v-model="form.password" type="password" size="large" class="w-full"/>
      </div>
      <div>
          <label for="password_confirmation">Password Confirmation</label>
          <InputText id="password_confirmation" v-model="form.password_confirmation" type="password" size="large" class="w-full"/>
      </div>
      <div class="flex justify-end mt-4">           
          <Button v-if="!data.user" type="submit" label="Simpan">
            <Icon name="lucide:user-plus" mode="svg"/> Buat Akun Login
          </Button>         
          <Button v-else type="submit" label="Simpan">
            <Icon name="lucide:save" mode="svg"/> Perbarui Akun
          </Button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
  const toast = useToast();
  const route = useRoute()
  const idPegawai = route.query.id || '';

  const client = useSanctumClient();
  const { data, status, error, refresh } = await useAsyncData(
      'pegawaiakun'+idPegawai,
      () => client('/api/pegawai/akun/'+idPegawai)
  )
  const form: Record<any, any> = reactive({
      nama: data.value.nama,
      email: data.value.email,
      password: data.value.user !== null?data.value.user.password:'',
  })

  const handleFormSubmit = async () => {
    try {
        // Lakukan request POST menggunakan client            
        await client('api/pegawai/akun/'+idPegawai,{
            method: 'POST',
            params: {
                name: form.nama,
                email: form.email,
                password: form.password,
                password_confirmation: form.password_confirmation
            }
        })
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
    } catch (err) {
        const e = useSanctumError(err);
        console.log(e.bag);
    }
  }

</script>
