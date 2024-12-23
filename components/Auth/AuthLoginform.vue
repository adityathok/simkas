<template>
    
    <form @submit.prevent="handleFormSubmit">
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
        
        <div v-if="isLoading">
            <ProgressSpinner v-if="isLoading" class="m-0" style="width: 30px; height: 30px" />
            <span class="opacity-50 text-sm pb-2 inline-block">Memproses login..</span>            
        </div>

        <div class="text-center">
            <Button type="submit" label="Masuk" class="w-full" />
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
        try {
            await login(form.value)
        } catch (e) {
            const error = useSanctumError(e);
            errors.value = true; 
            console.error('Request failed not because of a validation', error.code);
        } finally {
            isLoading.value = false; 
            return navigateTo('/')
        }
    }

</script>