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
                <label class="text-sm block mt-4 mb-1">Arus</label>
                <SelectButton
                  v-model="form.arus"
                  :options="[{value:'masuk',label:'Masuk'},{value:'keluar',label:'Keluar'}]"
                  optionValue="value"
                  optionLabel="label"
                  class="mt-1 md:mt-0"
                />
              </div>
              <div class="col-span-4 md:col-span-3">
                <label class="text-sm mb-1">Siswa</label>
                <FormSelectSiswa :user_id="form.user_id" @selected="onSiswaSelect" @clear="onSiswaSelectClear"/>
              </div>
            </div>
          </div>
  
          <div> 
  
            <div v-if="form.user_id" class="border p-3 rounded-xl mb-4">
              <div class="font-bold mb-1">Tagihan Siswa</div>
              <KasirTagihanSiswa 
                :siswa_id="form.siswa_id" 
                :user_id="form.user_id" 
                :tagihans="defaultTagihans"
                @selected="handleAddTagihan"
              />
            </div> 
  
            <div class="border p-3 rounded-xl mb-4"> 
              <div class="font-bold mb-1">Tambah Item transaksi</div>
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
                    <Button type="submit" class="w-full">
                      <Icon name="lucide:circle-plus" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
  
            <div class="border p-3 rounded-xl mb-4">
              <div class="font-bold mb-1">Catatan</div>
              <Textarea
                label="Keterangan"
                placeholder="Keterangan"
                v-model="form.keterangan"
                class="w-full"
              />
            </div> 
  
          </div>
  
        </template>
      </Card>
      
      <Card class="md:basis-[50%] lg:basis-[30em]">
        <template #content>
                  
          <div class="border p-3 rounded-xl mb-4">
            <div class="font-bold mb-1">Item</div>
            
            <div v-for="(item,index) in itemsTransaksi">
              <div>
                {{ item.nama }}
                <div v-if="item.nomor" class="text-xs italic">
                  {{ item.nomor }}
                </div>
              </div>
              <div class="flex justify-between mt-1 mb-2 items-center">
                <div>
                  <Button severity="danger" size="small" type="button" @click="hapusItemTransaksi(index)">
                    <Icon name="lucide:trash-2" />
                  </Button>
                  <Chip severity="info" size="small" class="ms-2 text-xs mt-1" rounded="md">{{ item.jumlah }}</Chip>
                </div>
                <div>{{ formatUang(item.nominal) }}</div>
              </div>
              <hr class="mb-2">
            </div>
  
            <div class="mt-7">
              <div>Total Pembayaran</div>
              <div class="text-3xl md:text-4xl font-bold text-end">
                Rp {{ formatUang(form.nominal) }}
              </div>
            </div>
  
            
          </div> 
  
          <div v-if="errorProsesTransaksi">
            <Message v-for="(eror,i) in errorProsesTransaksi" severity="error" class="my-1" closable>
              {{ eror[0] }}
            </Message>
          </div>
  
          <div class="text-end mb-2">
            <div class="flex flex-row justify-between items-center gap-2">
              <div>Metode Pembayaran</div>
              <Select 
                v-model="form.metode_pembayaran" 
                :options="[{value:'cash',label:'Cash'},{value:'transfer',label:'Transfer'}]" 
                optionValue="value" 
                optionLabel="label" 
              />
            </div>
          </div>
          <div v-if="form.metode_pembayaran !== 'cash'" class="text-end mb-2">
            <div class="flex flex-row justify-between items-center gap-2">
              <div>Rekening</div>
              <Select
                v-model="form.akun_rekening_id" 
                :options="optionsData.akunrekening" 
                optionValue="value" 
                optionLabel="label" 
                class="mt-1 md:mt-0"
              />
            </div>
          </div>
  
          <div class="text-end my-6 text-xs">
            <Checkbox v-model="form.cetak" size="small" binary /> <label for="cetak">Cetak Bukti</label>
          </div>
          <Button @click="prosesTransaksi" type="button" severity="success" class="w-full" size="large" :loading="loadingProsesTransaksi">
            <Icon v-if="loadingProsesTransaksi" name="lucide:loader" class="animate-spin" />
            Proses Transaksi
          </Button>
          <Button @click="resetTransaksi" type="button" severity="contrast" class="w-full mt-3">
            Batal
          </Button>
        </template>
      </Card>
  
    </div>
  
  </template>
  
  <script setup lang="ts">
  import dayjs from 'dayjs';
  import utc from 'dayjs/plugin/utc';
  dayjs.extend(utc);
  const client = useSanctumClient();
  
  const { data:optionsData } = await useAsyncData(
      'option-formkasir',
      () => client('/api/options',{
        params:{
          keys: 'akunrekening'
        }
      })
  )
  
  
  const route = useRoute();
  const defaultTagihans = ref({} as any)
  const itemsTransaksi = ref<any[]>([]) // Inisialisasi sebagai array kosong
  
  onMounted(() => {
    if(route.query.tagihan) {
      const tagihan = route.query.tagihan as string
      const tagihanArray = tagihan.split('i')
      defaultTagihans.value = tagihanArray
    }
    if(route.query.user_id) {
      form.value.user_id = route.query.user_id as string
    }
    if(route.query.siswa_id) {
      form.value.siswa_id = route.query.user_id as string
    }
  
  })
  
  const form = ref({
    user_id: '',
    siswa_id: '',
    arus: 'masuk',
    akun_rekening_id: 'CASH',
    metode_pembayaran: 'cash',
    keterangan: '',
    tanggal: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    cetak: true,
    nominal: 0,
    status: 'sukses',
    items: [],
  } as any)
  
  function onSiswaSelect(selected: { id: any; user_id: any; }) {
    if(selected.user_id) {
      form.value.siswa_id = selected.id
      form.value.user_id = selected.user_id
    } else {
      form.value.siswa_id = ''
      form.value.user_id = ''
    }
  }
  function onSiswaSelectClear(){
    form.value.siswa_id = ''
    form.value.user_id = ''
  }
  
  function hitungTotalNominal() {
    form.value.nominal = itemsTransaksi.value.reduce((total, item) => {
      const nominal = parseFloat(item.nominal)
      return total + (isNaN(nominal)? 0 : nominal)
    }, 0)
  }
  
  //watch itemsTransaksi untuk hitung total nominal
  watch(() => itemsTransaksi.value, () => {
    hitungTotalNominal()
  })
  
  //handle emit add
  const handleAddTagihan = (data: any) => {
    //cek jika sudah ada di itemsTransaksi, dengan tagihan_id
    const index = itemsTransaksi.value.findIndex((item) => item.tagihan_id === data.id)
    if(index === -1) {
      itemsTransaksi.value.push({
        nama: data.tagihan_master.nama,
        nomor: data.nomor,
        nominal_item: data.tagihan_master.nominal,
        jumlah: 1,
        nominal: data.tagihan_master.nominal,
        tagihan_id: data.id,
      })
    }
  }
  
  const formAddItemsTransaksi = reactive({
    nama: '',
    nominal_item: 0,
    jumlah: 1,
    nominal: 0,
    tagihan_id:''
  } as any)
  
  //watch formAddItemsTransaksi.nominal_item
  watch(() => [formAddItemsTransaksi.nominal_item,formAddItemsTransaksi.jumlah], () => {
    formAddItemsTransaksi.nominal = formAddItemsTransaksi.nominal_item * formAddItemsTransaksi.jumlah
  })
  
  const resetForm = () => {
    formAddItemsTransaksi.nama = ''
    formAddItemsTransaksi.nominal = 0
    formAddItemsTransaksi.nominal_item = 0
    formAddItemsTransaksi.jumlah = 1
    formAddItemsTransaksi.tagihan_id = 0
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
    hitungTotalNominal()
  }
  const hapusItemTransaksi = (index: number) => {
    itemsTransaksi.value.splice(index, 1)
  }
  
  //proses transaksi
  const toast = useToast();
  const loadingProsesTransaksi = ref(false)
  const errorProsesTransaksi = ref({} as any)
  async function prosesTransaksi() {
    loadingProsesTransaksi.value = true
    errorProsesTransaksi.value = {}
  
    try {
      const res = await client('/api/transaksi', {
        method: 'POST',
        body: {
          ...form.value,
         items: itemsTransaksi.value,
        }
      })
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Transaksi berhasil disimpan', life: 3000 });
    } catch (error) {
      const er = useSanctumError(error)
      errorProsesTransaksi.value = er?.bag ?? {}
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Transaksi gagal diproses, silahkan coba lagi', life: 3000 });
    }
    loadingProsesTransaksi.value = false
  }
  
  //reset transaksi
  const resetTransaksi = () => {
    form.value = {
      user_id: '',
      siswa_id: '',
      akun_rekening_id: 'CASH',
      metode_pembayaran: 'cash',
      keterangan: '',
      tanggal: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      cetak: true,
      nominal: 0,
      items: [],
    }
    //reset itemsTransaksi
    itemsTransaksi.value = []
  }
  </script>
  