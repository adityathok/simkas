<template>

    <Card class="max-w-2xl mx-auto">

        <template #content>

            <div class="flex mb-4 border-b">
                <NuxtLink :to="'/users/edit?id='+idUser" class="py-1 px-4 bg-blue-100 text-sky-600">Profil</NuxtLink>
                <NuxtLink :to="'/users/editakun?id='+idUser" class="py-1 px-4 hover:bg-blue-100 hover:text-sky-600">Akun</NuxtLink>
            </div>

                <form action="" method="post" @submit.prevent="handleFormSubmit">

                    <div class="mb-3">
                        <label for="name" class="block mb-1">Nama</label>
                        <InputText type="text" id="name" class="w-full" v-model="form.name" />
                    </div>
                            
                    <div class="mb-3">
                        <label for="email" class="block mb-1">Email</label>
                        <InputText type="text" id="email" class="w-full" v-model="form.email" />
                    </div>

                    <div v-if="eror">
                        <Message v-for="item in eror" severity="warn" class="mb-1">
                            {{ item[0] }}
                        </Message>
                    </div>

                    <div class="text-right">
                        <Button type="submit" :loading="isLoading">
                            <Icon name="lucide:save" />
                            Simpan
                        </Button>
                    </div>
                </form>

        </template>

    </Card>

</template>

<script lang="ts" setup>
    definePageMeta({
        title: 'Edit Akun',
    })
    const { isAuthenticated, user, refreshIdentity } = useSanctumAuth()
    const useUser = useUserStore()
    const route = useRoute();
    const toast = useToast();
    const idUser = route.query.id || '';
    const client = useSanctumClient();
    const eror = ref({})
    const isLoading = ref(false)

    if(idUser==''){
       await navigateTo('/')
    }

    const { data, status, error, refresh } = await useAsyncData(
        'users'+idUser,
        () => client('/api/users/'+idUser)
    )
    
    const form = ref({
        name: data.value.name,
        email: data.value.email,
    })

    const handleFormSubmit = async () => {
        isLoading.value = true;
        try {
            await client('/api/users/'+data.value.id, {
                method: 'PUT',
                params: form.value
            })
            refresh()
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
            eror.value = ({});
            //jika id sama dengan id user yang sedang login
            if(idUser == useUser.currentUser.id){
                await refreshIdentity()
            }
        } catch (er) {
            const e = useSanctumError(er);
            eror.value = e.bag;
            console.log(er);
        }
        isLoading.value = false;

    }

</script>