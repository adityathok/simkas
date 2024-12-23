<template>

    <Card class="border max-w-2xl mx-auto">

        <template #title>
            Edit Akun
        </template>
        <template #subtitle>
            Ubah akun login {{ data.name }}
        </template>

        <template #content>

            <div class="flex mb-4">
                <NuxtLink :to="'/users/edit?id='+idUser" class="rounded-l py-1 px-4 bg-zinc-200">Profil</NuxtLink>
                <NuxtLink :to="'/users/editakun?id='+idUser" class="rounded-r py-1 px-4 bg-blue-600 text-white">Akun</NuxtLink>
            </div>
            
            <form action="" method="post" @submit.prevent="handleFormSubmit">

                <div class="mb-3">
                    <label for="password" class="block mb-1">Password Baru</label>
                    <InputText type="password" id="password" class="w-full" v-model="form.password" />
                </div>
                <div class="mb-3">
                    <label for="password_confirmation" class="block mb-1">Konfirmasi Password Baru</label>
                    <InputText type="password" id="password_confirmation" class="w-full" v-model="form.password_confirmation" />
                </div>

                <div v-if="eror">
                    <Message v-for="item in eror" severity="warn" class="mb-1">
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
    const route = useRoute()
    const toast = useToast();
    const idUser = route.query.id || '';
    const client = useSanctumClient();
    const eror = ref({})

    const { data, status, error, refresh } = await useAsyncData(
        'users'+idUser,
        () => client('/api/users/'+idUser)
    )
    
    const form = ref({
        password: data.value.password,
        password_confirmation: data.value.password_confirmation,
    })

    const handleFormSubmit = async () => {

        try {
            await client('/api/users/password/'+data.value.id, {
                method: 'POST',
                params: form.value
            })
            refresh()
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
            eror.value = ({});
        } catch (er) {
            const e = useSanctumError(er);
            eror.value = e.bag;
            console.log(er);
        }
    }

</script>