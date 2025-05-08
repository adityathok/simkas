<template>


  <div class="flex flex-col md:flex-row gap-5">
    
    <Card class="md:flex-1">
      <template #content>
        <div class="mb-5">
          <div class="grid grids-col-2">
            <div class="col-span-6">
              <label class="text-sm mb-1">Tanggal</label>
              <DatePicker
                label="Tanggal"
                placeholder="Tanggal"
                v-model="form.tanggal"
                class="w-full"
              />
            </div>
            <div class="col-span-6">
              <label class="text-sm mb-1">Tagihan</label>
              <FormSelectSiswa :user_id="form.user_id" @selected="onSiswaSelect" @clear="onSiswaSelectClear"/>
            </div>
          </div>
        </div>

        <div> 
          <div class="border p-3 rounded-xl mb-4"> 
            <div class="font-bold mb-1">Tambah Item</div>
            <form @submit.prevent="handleAddItemsTransaksi">
              <div class="grid grid-cols-6 gap-2">
                <div class="col-span-6">
                  <label class="text-sm mb-1">Nama item</label>
                  <InputText
                    label="Nama Item"
                    placeholder="Nama Item"
                    v-model="formAddItemsTransaksi.nama"
                    class="w-full"
                  />
                </div>
                <div class="col-span-2">
                  <label class="text-sm mb-1">Harga Item</label>
                  <InputNumber
                    label="Nominal Item"
                    placeholder="Nominal Item"
                    v-model="formAddItemsTransaksi.nominal_item"
                    class="w-full"
                  />
                </div>
                <div class="col-span-2">
                  <label class="text-sm mb-1">Qty</label>
                  <InputNumber
                    label="Jumlah"
                    placeholder="Jumlah"
                    v-model="formAddItemsTransaksi.jumlah"
                    class="w-full"
                  />
                </div>
                <div class="col-span-2">
                  <label class="text-sm mb-1">Total Harga</label>
                  <InputNumber
                    label="Harga"
                    placeholder="Harga"
                    v-model="formAddItemsTransaksi.nominal"
                    class="w-full"
                    disabled
                  />
                </div>
                <div class="col-span-6 text-end">
                  <Button type="submit" class="mb-2">Tambah</Button>
                </div>
              </div>
            </form>
          </div>

          <div v-if="itemsTransaksi && itemsTransaksi.length > 0" class="border p-3 rounded-xl mb-4">
            <div class="font-bold mb-1">Item Transaksi</div>
            <DataTable :value="itemsTransaksi">
              <Column field="nama" header="Item" />
              <Column field="nominal_item" header="Nominal Item" />
              <Column field="jumlah" header="Qty" />
              <Column field="nominal" header="Total">
                <template #body="slotProps"> 
                  {{ formatUang(slotProps.data.nominal) }}
                </template>
              </Column>

            </DataTable>
          </div> 

        </div>

      </template>
    </Card>
    
    <Card class="md:basis-[20em]">
      <template #content>
        <div class="mb-3">
          <div>Rekening Tujuan</div>
          <Select v-model="form.akun_rekening_id" :options="optionsData.akunrekening" optionValue="value" optionLabel="label" class="w-full" />
        </div>
        <div class="mb-3">
          <div>Metode Pembayaran</div>
          <Select v-model="form.metode_pembayaran" :options="[{value:'cash',label:'CASH'}]" optionValue="value" optionLabel="label" class="w-full" />
        </div>
        <div class="mb-9">
          <div>Total Pembayaran</div>
          <div class="text-2xl md:text-4xl font-bold">
            Rp {{ formatUang(totalBayar) }}
          </div>
        </div>
        <Button type="button" severity="success" class="w-full">Proses Transaksi</Button>
      </template>
    </Card>

  </div>

</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const { tagihans } = useTagihanStore()
const client = useSanctumClient();

const { data:optionsData } = await useAsyncData(
    'option-formkasir',
    () => client('/api/options',{
      params:{
        keys: 'akunrekening'
      }
    })
)

const selectedTagihan = ref();
const dataTagihans = ref({} as any)
const loadingTagihans = ref(false)
const errorTagihans = ref({} as any)
async function getTagihans() {
  loadingTagihans.value = true
  try {
    const res = await client('/api/tagihan', {
      method: 'GET',
      params: {
        user_id: form.value.user_id,
        siswa_id: form.value.siswa_id,
      }
    })
    dataTagihans.value = res.data
  }
  catch (error) {
    const er = useSanctumError(error)
    errorTagihans.value = er.bag
  }
}

const form = ref({
  user_id: '',
  siswa_id: '',
  akun_rekening_id: 'cash',
  metode_pembayaran: 'cash',
  keterangan: '',
  tanggal: dayjs().utc().local().format('YYYY-MM-DD HH:mm'),
  items: [],
})

function onSiswaSelect(selected: { id: any; user_id: any; }) {
  if(selected.user_id) {
    form.value.siswa_id = selected.id
    form.value.user_id = selected.user_id
    getTagihans()
  } else {
    form.value.siswa_id = ''
    form.value.user_id = ''
  }
}
function onSiswaSelectClear(){
  form.value.siswa_id = ''
  form.value.user_id = ''
}

const itemsTransaksi = ref<any[]>([]) // Inisialisasi sebagai array kosong

const formAddItemsTransaksi = reactive({
  nama: '',
  deskripsi: '',
  nominal: 0,
  nominal_item: 0,
  jumlah: 1,
})

//watch formAddItemsTransaksi.nominal_item
watch(() => formAddItemsTransaksi.nominal_item, (newValue) => {
  if (newValue !== null) {
    formAddItemsTransaksi.nominal = newValue * formAddItemsTransaksi.jumlah
  }
})

const resetForm = () => {
  formAddItemsTransaksi.nama = ''
  formAddItemsTransaksi.deskripsi = ''
  formAddItemsTransaksi.nominal = 0
  formAddItemsTransaksi.nominal_item = 0
  formAddItemsTransaksi.jumlah = 1
}

const handleAddItemsTransaksi = () => {
  // Validasi sederhana (opsional)
  if (!formAddItemsTransaksi.nama || !formAddItemsTransaksi.nominal) {
    alert('Nama dan nominal wajib diisi!')
    return
  }

  //jumlahkan nominal_item*jumlah
  formAddItemsTransaksi.nominal = formAddItemsTransaksi.nominal_item * formAddItemsTransaksi.jumlah

  // Tambahkan data ke array dengan membuat salinan objek (avoid shared reference)
  itemsTransaksi.value.push({ ...toRaw(formAddItemsTransaksi) })

  // Reset form setelah menambahkan
  resetForm()
}
const hapusItemTransaksi = (index: number) => {
  itemsTransaksi.value.splice(index, 1)
}

const totalBayar = computed(() => {
  return itemsTransaksi.value.reduce((total, item) => total + item.nominal, 0)
})
</script>
