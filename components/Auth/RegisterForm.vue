<template>
    
    <form @submit.prevent="handleFormSubmit">
        <div class="mb-3">
            <label for="name">Nama</label>
            <InputText id="name" v-model="form.name" type="text" size="large" class="w-full"/>
            <Message class="mt-1" v-if="error.name" severity="warn">{{error.name[0]}}</Message>
        </div>
        <div class="mb-3">
            <label for="email">Email</label>
            <InputText id="email" v-model="form.email" type="text" size="large" class="w-full"/>
            <Message class="mt-1" v-if="error.email" severity="warn">{{error.email[0]}}</Message>
        </div>
        <div class="mb-3">
            <label for="password">Password</label>
            <InputText id="password" v-model="form.password" type="password" size="large" class="w-full"/>
        </div>
        <div class="mb-3">
            <label for="password_confirmation">Password Confirmation</label>
            <InputText id="password_confirmation" v-model="form.password_confirmation" type="password" size="large" class="w-full"/>
        </div>
        <Message class="mt-1" v-if="error.password" severity="warn">{{error.password[0]}}</Message>
        
        <div v-if="isLoading">
            <ProgressSpinner class="m-0" style="width: 30px; height: 30px" />
            <span class="opacity-50 text-sm pb-2 inline-block">Memproses register..</span>            
        </div>

        <Message class="mt-1" v-if="success" severity="warn">
            Pendaftaran berhasil..
        </Message>

        <div class="flex justify-between items-center">
            <Button @click="navigateTo('/login')" type="button" label="Login" class="w-full md:w-52 mb-1 md:mb-0 mr-2" outlined/>
            <Button type="submit" label="Daftar" class="w-full md:w-52" />
        </div>

    </form>

</template>

<script setup>
    const client = useSanctumClient();
    const { refreshIdentity } = useSanctumAuth();

    const isLoading = ref(false)
    const error = ref({})
    const success = ref(false)

    const form = reactive({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })
    
    const handleFormSubmit = async () => {
        isLoading.value = true; 
        error.value = {};

        try {
            // Lakukan request POST menggunakan client            
            await client('/register',{
                method: 'POST',
                params: {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    password_confirmation: form.password_confirmation
                }
            })
            await refreshIdentity()
            navigateTo('/dashboard')

        } catch (err) {
            const e = useSanctumError(err);
            error.value = e.bag;
        } finally {
            isLoading.value = false; 
        }

    }

</script>