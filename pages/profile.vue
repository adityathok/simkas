<template>

    <div class="max-w-xl">

        <PageHeader>
            <template #title>
                Informasi Profil
            </template>

            <template #subtitle>
                Update informasi akun dan alamat email anda
            </template>
        </PageHeader>
        
        <form @submit.prevent="handleFormSubmit">
            <div class="mb-3">
                <label for="email">Email</label>
                <InputText id="email" v-model="form.email" type="text" size="large" class="w-full"/>
            </div>
            <div class="mb-3">
                <label for="password">Password</label>
                <InputText id="password" v-model="form.password" type="password" size="large" class="w-full"/>
            </div>

            <div class="text-end">
                <Button type="submit" label="Update"/>
            </div>
        </form>
        
    </div>

</template>

<script setup>
    const form = reactive({
        email: '',
        password: '',
        remember: false,
    })
</script>