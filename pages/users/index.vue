<template>

    <Card>
        <template #content>
                
        <DataTable :value="data.data" class="text-sm" stripedRows scrollable>
            <Column field="avatar" header="">
                <template #body="slotProps">
                    <Avatar v-if="slotProps.data.avatar" :image="urlStorage+slotProps.data.avatar" shape="circle" />
                    <Avatar v-else :label="firstName(slotProps.data.name)" shape="circle" />
                </template>
            </Column>
            <Column field="name" header="Nama"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="roles" header="Role">
                <template #body="slotProps">
                    <Badge severity="info" v-for="(role, index) in slotProps.data.roles" :key="index" class="mr-1 mb-1 capitalize">
                        {{ role }}
                    </Badge>
                </template>
            </Column>
            <Column field="created_at" header="Terdaftar">
                <template #body="slotProps">
                    {{ dateIndo(slotProps.data.created_at) }}
                </template>
            </Column>
            <Column field="option" header=" ">
                <template #body="slotProps">
                    <div class="flex justify-end items-center">
                        <NuxtLink :to="'/users/edit?id='+slotProps.data.id" class="bg-transparent! border-none! text-slate-800!" variant="text" size="small">
                            <Icon name="lucide:pencil" />
                        </NuxtLink>
                        <Button v-if="useDelete(slotProps.data)" type="button" @click="confirmDelete(slotProps.data.id)" class="bg-transparent! border-none! text-red-500!" variant="text" size="small">
                            <Icon name="lucide:trash-2" />
                        </Button>
                    </div>
                </template>
            </Column>
        </DataTable>

        <div class="mt-2 md:flex md:justify-between md:items-center">
            <div class="opacity-50 text-sm text-right md:text-left mx-3 mb-2 md:mb-0">                
                <span v-if="status === 'pending'" class="opacity-50">
                    Loading....
                </span>
                <span v-else>
                    Tampil {{ data.per_page }} dari {{ data.total }}
                </span>

            </div>
            <Paginator
                :rows="data.per_page"
                :totalRecords="data.total"
                @page="onPaginate"
                :pt="{
                    root: (event) => {
                        const itemForPage =  data.per_page;
                        const currentPage =  page - 1;
                        event.state.d_first = itemForPage * currentPage;
                    },
                }"
            >
            </Paginator>
        </div>
        </template>
    </Card>

</template>

<script lang="ts" setup>
    definePageMeta({
        title: 'Semua Akun',
    })
    const { urlStorage } = useGlobalStore()
    const useUser = useUserStore()
    const confirm = useConfirm();
    const toast = useToast();
    const route = useRoute();
    const page = ref(route.query.page ? Number(route.query.page) : 1);

    const client = useSanctumClient();
    const { data, status, error, refresh } = await useAsyncData(
        'users',
        () => client('/api/users?page='+page.value)
    )
    
    const onPaginate = (event: { page: number }) => {
        page.value = event.page + 1; 
        refresh()
        navigateTo('/users?page='+page.value)
    };

    const dateIndo = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        });
    }

    const firstName = (name: string) => {
        return Array.from(name)[0];
    }

    const toOption = (url: string) => {
        navigateTo(url)
    };

    const confirmDelete = (id: string) => {
        confirm.require({
            message: 'Yakin untuk menghapus user ini ?',
            header: 'Hapus User',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: 'Delete',
                severity: 'danger'
            },
            accept: async () => {
                await client('/api/users/'+id, { method: 'DELETE' })   
                refresh()
                toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil dihapus', life: 3000 });
            },
        });
    };

    const useDelete = (data: any) => {
        
        if(data.id===useUser.currentUser.id){
            return false;
        } 

        var result = false;
        const droles = data.roles;    
        if(droles.length === 1 && droles[0] === 'admin'){
            result = true;      
        }
        return result;
    };

</script>