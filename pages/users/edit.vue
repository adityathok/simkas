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
                    <div class="mb-3">
                        <label for="avatar" class="block mb-1">Avatar</label>
                        <img v-if="form.avatar" :src="form.avatar" alt="" class="rounded mb-2">
                        <InputText @change="handleFileUpload" type="file" id="avatar" class="w-full"/>
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
    const { currentUser,refreshUser } = useUserStore()
    const { urlStorage } = useGlobalStore()
    const route = useRoute()
    const toast = useToast();
    const idUser = route.query.id || '';
    const client = useSanctumClient();
    const eror = ref({})

    if(!idUser){
       await navigateTo('/users')
    }

    const { data, status, error, refresh } = await useAsyncData(
        'users'+idUser,
        () => client('/api/users/'+idUser)
    )
    
    const form = ref({
        name: data.value.name,
        email: data.value.email,
        avatar: urlStorage+data.value.avatar,
        file: '',
    })

    // Method untuk meng-handle file upload
    function handleFileUpload(event: any) {
        form.value.file = event.target.files[0];
        form.value.avatar = URL.createObjectURL(event.target.files[0])
    }

    const handleFormSubmit = async () => {
        const formData = new FormData();
        formData.append('name', form.value.name);
        formData.append('email', form.value.email);
        if(form.value.file){
            formData.append('avatar', form.value.file);
        }

        try {
            await client('/api/users/'+data.value.id, {
                method: 'PUT',
                body: formData
            })
            refresh()
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
            eror.value = ({});
            //jika id sama dengan id user yang sedang login
            if(idUser == currentUser.id){
                await refreshUser()
            }
        } catch (er) {
            const e = useSanctumError(er);
            eror.value = e.bag;
            console.log(er);
        }
    }

</script>