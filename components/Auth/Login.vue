<template>
    
  <form @submit.prevent="handleFormSubmit" class="w-full">
      <div class="mb-3">
          <label for="email">Email</label>
          <InputText id="email" v-model="form.email" type="text" size="large" class="w-full"/>
      </div>
      <div class="mb-3">
          <label for="password">Password</label>
          <InputText id="password" v-model="form.password" type="password" size="large" class="w-full"/>
      </div>

      <div class="flex mb-5">
          <Checkbox v-model="form.remember" inputId="remember" name="remember" value="true" />
          <label for="remember" class="ml-2"> Remember </label>
      </div>        

      <div class="mt-5">
          <Button type="submit" class="px-20! w-full" :loading="isLoading">                
              <span v-if="isLoading" class="flex gap-2 items-center"><Icon class="animate-spin" name="lucide:loader" /> Memproses login..</span>
              <span v-else>Masuk</span>
          </Button>
      </div>

      <div v-if="errors" class="my-3">
          <Message severity="warn">Email dan sandi salah, silahkan coba lagi..</Message>
      </div>
  </form>

</template>

<script setup>
  const { login } = useSanctumAuth()

  const isLoading = ref(false)
  const errors = ref(false)

  const form = ref({
      email: '',
      password: '',
      remember: '',
  })

  async function handleFormSubmit() {
      isLoading.value = true; 
      errors.value = false;
      form.value.remember = form.value.remember[0]
      try {
          await login(form.value)
      } catch (e) {
          const error = useSanctumError(e);
          //jika eror 419, hapus cookie csrf
          if(error.code == 419){
              useCookie('XSRF-TOKEN').value = null;
              useCookie('laravel_session').value = null;
              login(form.value)
          } else {
              errors.value = true; 
              console.error('Request failed not because of a validation', error.code);
          }
      } finally {
          isLoading.value = false; 
          return navigateTo('/')
      }
  }

</script>