<template>

    <Card class="border max-w-2xl mx-auto">

        <template #title>
            Edit User
        </template>
        <template #subtitle>
            Ubah profil {{ data.name }}
        </template>

        <template #content>

            <div class="flex mb-4">
                <NuxtLink :to="'/users/edit?id='+idUser" class="rounded-l py-1 px-4 bg-blue-600 text-white">Profil</NuxtLink>
                <NuxtLink :to="'/users/editakun?id='+idUser" class="rounded-r py-1 px-4 bg-zinc-200">Akun</NuxtLink>
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
                        <Button label="Simpan" type="submit"/>
                    </div>
                </form>

        </template>

    </Card>

</template>

<script lang="ts" setup>
    const { isAuthenticated, user, refreshIdentity } = useSanctumAuth()
    const route = useRoute();
    const toast = useToast();
    const idUser = route.query.id || '';
    const client = useSanctumClient();
    const eror = ref({})

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

        try {
            await client('/api/users/'+data.value.id, {
                method: 'PUT',
                params: form.value
            })
            refresh()
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
            eror.value = ({});
            //jika id sama dengan id user yang sedang login
            // if(idUser == user.id){
            //     await refreshIdentity()
            // }
        } catch (er) {
            const e = useSanctumError(er);
            eror.value = e.bag;
            console.log(er);
        }

    }

</script>