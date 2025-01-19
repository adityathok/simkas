<template>

    <Card class="max-w-2xl mx-auto">

        <template #content>

            <div class="flex mb-4 border-b">
                <NuxtLink :to="'/users/edit?id='+idUser" class="py-1 px-4 hover:bg-blue-100 hover:text-sky-600">Profil</NuxtLink>
                <NuxtLink :to="'/users/editakun?id='+idUser" class="py-1 px-4 bg-blue-100 text-sky-600">Akun</NuxtLink>
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
                    <Button type="submit" :loading="isLoading">
                        <Icon name="lucide:save" mode="svg"/>
                        Simpan
                    </Button>
                </div>
            </form>

        </template>

    </Card>
    <Toast />
</template>

<script lang="ts" setup>
    definePageMeta({
        title: 'Edit Password Akun',
    })
    const route = useRoute()
    const toast = useToast();
    const idUser = route.query.id || '';
    const client = useSanctumClient();
    const eror = ref({})
    const isLoading = ref(false)

    const { data, status, error, refresh } = await useAsyncData(
        'users'+idUser,
        () => client('/api/users/'+idUser)
    )
    
    const form = ref({
        password: data.value.password,
        password_confirmation: data.value.password_confirmation,
    })

    const handleFormSubmit = async () => {
        isLoading.value = true;
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
        isLoading.value = false;
    }

</script>