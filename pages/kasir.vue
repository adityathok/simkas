<template>


  <div class="flex flex-col md:flex-row gap-5">
    
    <Card class="md:flex-1">
      <template #content>
        <div class="mb-5">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-2 md:col-span-1">
              <label class="text-sm mb-1">Tanggal</label>
              <DatePicker
                label="Tanggal"
                placeholder="Tanggal"
                v-model="form.tanggal"
                class="w-full"
                dateFormat="yy-mm-dd"
                showTime hourFormat="24"
                disabled
              />
            </div>
            <div class="col-span-4 md:col-span-3">
              <label class="text-sm mb-1">Tagihan</label>
              <FormSelectSiswa :user_id="form.user_id" @selected="onSiswaSelect" @clear="onSiswaSelectClear"/>
            </div>
          </div>
        </div>

        <div> 
          <div class="border p-3 rounded-xl mb-4"> 
            <div class="font-bold mb-1">Tambah Item</div>
            <form @submit.prevent="handleAddItemsTransaksi">
              <div class="flex flex-col md:flex-row gap-4 md:items-end">
                <div class="md:basis-[40%]">
                  <label class="text-sm mb-1">Nama item</label>
                  <InputText
                    label="Nama Item"
                    placeholder="Nama Item"
                    v-model="formAddItemsTransaksi.nama"
                    class="w-full"
                  />
                </div>
                <div class="md:basis-[20%]">
                  <label class="text-sm mb-1">Harga</label>
                  <InputNumber
                    label="Nominal Item"
                    placeholder="Nominal Item"
                    v-model="formAddItemsTransaksi.nominal_item"
                    class="w-full"
                  />
                </div>
                <div class="md:basis-[20%]">
                  <label class="text-sm mb-1">Qty</label>
                  <InputText
                    type="number"
                    label="Jumlah"
                    placeholder="Jumlah"
                    v-model="formAddItemsTransaksi.jumlah"
                    class="w-full"
                  />
                </div>
                <div class="md:flex-1">
                  <Button type="submit" class="w-full">Tambah</Button>
                </div>
              </div>
            </form>
          </div>

          <div class="border p-3 rounded-xl mb-4">
            <div class="font-bold mb-1">Item Transaksi</div>
            <DataTable v-if="itemsTransaksi && itemsTransaksi.length > 0" :value="itemsTransaksi">
              <Column field="nama" header="Item" />
              <Column field="nominal_item" header="Nominal Item">
                <template #body="slotProps"> 
                  {{ formatUang(slotProps.data.nominal_item) }}
                </template>
              </Column>
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
    
    <Card class="md:basis-[30em] lg:basis-[20em]">
      <template #content>
        <div class="mb-3">
          <div>Rekening Tujuan</div>
          <Select v-model="form.akun_rekening_id" :options="optionsData.akunrekening" optionValue="value" optionLabel="label" class="w-full" />
        </div>
        <div class="mb-3">
          <div>Metode Pembayaran</div>
          <Select v-model="form.metode_pembayaran" :options="[{value:'cash',label:'CASH'}]" optionValue="value" optionLabel="label" class="w-full" />
        </div>
        <div class="mt-7 mb-9 border-y py-5 text-end">
          <div>Total Pembayaran</div>
          <div class="text-3xl md:text-4xl font-bold">
            Rp {{ formatUang(totalBayar) }}
          </div>
        </div>
        <div class="text-end mb-2 text-xs">
          <Checkbox v-model="form.cetak" size="small" binary /> <label for="cetak">Cetak Bukti</label>
        </div>
        <Button @click="prosesTransaksi" type="button" severity="success" class="w-full">Proses Transaksi</Button>
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
  akun_rekening_id: 'CASH',
  metode_pembayaran: 'cash',
  keterangan: '',
  tanggal: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  cetak: true,
  items: [],
} as any)

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
  nominal_item: 0,
  jumlah: 1,
  nominal: 0,
} as any)

//watch formAddItemsTransaksi.nominal_item
watch(() => [formAddItemsTransaksi.nominal_item,formAddItemsTransaksi.jumlah], () => {
  formAddItemsTransaksi.nominal = formAddItemsTransaksi.nominal_item * formAddItemsTransaksi.jumlah
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

//proses transaksi
const loadingProsesTransaksi = ref(false)
const errorProsesTransaksi = ref({} as any)
async function prosesTransaksi() {
  loadingProsesTransaksi.value = true
  errorProsesTransaksi.value = {}
  try {
    const res = await client('/api/transaksi', {
      method: 'POST',
      params: {
        ...form.value,
       items: itemsTransaksi.value,
      }
    })
  } catch (error) {
    const er = useSanctumError(error)
    errorProsesTransaksi.value = er.bag
  }
  loadingProsesTransaksi.value = false
}
</script>
