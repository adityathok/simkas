<template>

    <Card class="border max-w-2xl mx-auto">

        <template #title>
            Tambah User
        </template>

        <template #content>
            <form action="" method="post" @submit.prevent="handleFormSubmit">

                <div class="mb-3">
                    <label for="name" class="block mb-1">Nama</label>
                    <InputText type="text" id="name" class="w-full" v-model="form.name" />
                </div>
                        
                <div class="mb-3">
                    <label for="email" class="block mb-1">Email</label>
                    <InputText type="text" id="email" class="w-full" v-model="form.email" />
                </div>  

                <div class="mb-3">
                    <label for="role" class="block mb-1">Role</label>
                    <Select name="role" :options="roles" optionLabel="name" optionValue="value" v-model="form.role" placeholder="Select a role" fluid />
                </div>

                <div class="mb-3">
                    <label for="password" class="block mb-1">Password Baru</label>
                    <InputText type="password" id="password" class="w-full" v-model="form.password" />
                </div>

                <div class="mb-3">
                    <label for="password_confirmation" class="block mb-1">Konfirmasi Password Baru</label>
                    <InputText type="password" id="password_confirmation" class="w-full" v-model="form.password_confirmation" />
                </div>

                <div v-if="eror">
                    <Message v-for="item in eror" severity="warn" class="mb-1" closable>
                        {{ item[0] }}
                    </Message>
                </div>

                <div class="text-right">
                    <Button label="Simpan" type="submit"/>
                </div>
            </form>
        </template>

    </Card>

    <Toast />
</template>


<script lang="ts" setup>
    const eror = ref({})
    const client = useSanctumClient();
    const toast = useToast();

    const roles = ref([
        { name: 'Admin', value: 'admin' },
        { name: 'Pemilik', value: 'pemilik' },
        { name: 'Kasir', value: 'kasir' }
    ]);
    
    //nilai awal form
    const initialForm = {
        name: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
    }

    const form = ref({...initialForm})
    
    const handleFormSubmit = async () => {
        try {
            await client('/api/users/', {
                method: 'POST',
                body: form.value
            })
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil ditambahkan', life: 3000 });
            eror.value = ({});
            form.value = { ...initialForm }
        } catch (er) {
            const e = useSanctumError(er);
            eror.value = e.bag;
            console.log(e.bag);
        }
    }
</script>