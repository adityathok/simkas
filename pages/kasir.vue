<template>
  <div class="flex flex-col md:flex-row gap-5">

    <DashCard class="md:flex-1 bg-blue-100">

        <div class="mb-5">
          <div class="flex gap-3">
            <div class="flex-1">
              <label class="font-bold mb-1">Rekening</label>
              <div class="mt-1">
                <Select v-model="form.akun_rekening_id" 
                :options="optionsData?.akunrekening"
                optionLabel="label" optionValue="value" class="w-full"/>
              </div>
            </div>
            <div class="flex-1">
              <label class="font-bold mb-1">Jenis</label>
              <div class="mt-1">
                <Select v-model="form.jenis" 
                :options="[{label:'Masuk',value:'pendapatan'},{label:'Keluar',value:'pengeluaran'},{label:'Transfer',value:'transfer'}]"
                optionLabel="label" optionValue="value" class="w-full" required="true"/>
              </div>
            </div>
          </div>
        </div>

        <KasirTagihan @selected="onSelectTagihan" @update="onUpdateTagihan" />
        
        <div class="border p-4 bg-blue-50 dark:bg-slate-800 dark:border-slate-700 my-5">
          <div class="mb-2 font-bold">Tambah Item Transaksi</div>
          <KasirFormItem @update="submitItem" :jenis="form.jenis"/>
        </div>

        <div>
          <div class="mb-2 font-bold">Catatan</div>
          <Textarea v-model="form.catatan" class="w-full"/>
        </div>

    </DashCard>

    <DashCard class="md:basis-[50%] lg:basis-[40em] border-zinc-400 dark:border-zinc-400">
        
        <div class="mb-5">
          <div class="mb-2 font-bold">Items</div>
          <ScrollPanel style="width: 100%; height: 50vh">
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
                    <Chip severity="info" size="small" class="ms-2 text-xs mt-1" rounded="md">{{ item.qty }}</Chip>
                  </div>
                  <div>{{ formatUang(item.nominal) }}</div>
                </div>
                <hr class="mb-2">
              </div>
            </ScrollPanel>

            <div class="my-4">
              <div>Total</div>
              <div class="text-end text-lg md:text-4xl font-bold">
                {{ formatUang(form.nominal) }}
              </div>
            </div>

            <div class="flex flex-row justify-between items-center gap-2 mb-3">
              <div>Metode Pembayaran</div>
              <Select 
                v-model="form.metode_pembayaran" 
                :options="[{value:'tunai',label:'Tunai'},{value:'transfer',label:'Transfer'}]" 
                optionValue="value" 
                optionLabel="label" 
              />
            </div>
            <div class="flex flex-row justify-between items-center gap-2 mb-3">
              <div>Ref. No</div>
              <InputText 
                v-model="form.ref_nomor"
              />
            </div>

            <div class="text-end my-6 text-xs hidden">
              <Checkbox v-model="form.cetak" size="small" binary /> <label for="cetak">Cetak Bukti</label>
            </div>

            <div v-if="errorProsesTransaksi">
              <Message v-for="(eror,i) in errorProsesTransaksi" severity="error" class="my-1" closable>
                {{ eror[0] }}
              </Message>
            </div>

            <Button @click="prosesTransaksi" type="button" severity="success" class="w-full" size="large" :loading="loadingProsesTransaksi">
              <Icon v-if="loadingProsesTransaksi" name="lucide:loader" class="animate-spin" />
              Proses Transaksi
            </Button>
            <Button @click="resetTransaksi" type="button" severity="contrast" class="w-full mt-3">
              Batal
            </Button>
        </div>

    </DashCard>

  </div>

 
    <!-- <PrintTransaksi :data="printTransaksi" :visible="visiblePrintTransaksi" /> -->


</template>

<script setup lang="ts">
import { formatUang } from '~/utils/formatUang';

const client = useSanctumClient();

const { data:optionsData } = await useAsyncData(
    'option-formkasir',
    () => client('/api/options',{
      params:{
        keys: 'akunrekening'
      }
    })
)

const form = ref({
  nominal: '',
  jenis: 'pendapatan',
  akun_rekening_id:1,
  akun_rekening_tujuan_id:'',
  tagihan_id:'',
  user_id:'',
  catatan:'',
  nama: '',
  status:'sukses',
  metode_pembayaran: 'tunai',
  ref_nomor: '',
  items: [],
} as any);

const onUpdateTagihan = (data:any) => {
  form.value.user_id = data.user_id
  form.value.siswa_id = data.siswa_id
}

const itemsTransaksi = ref<any[]>([])

const onSelectTagihan = (data:any) => {
  //tambahkan data ke itemsTransaksi
  itemsTransaksi.value.push({
    tagihan_id: data.id,
    nama: data.tagihan_master.nama,
    qty: 1,
    nominal_item: data.tagihan_master.nominal,
    nominal: data.tagihan_master.nominal,
    akun_pendapatan_id: '',
    nomor: data.nomor
  })
  countTotalItems()
}

const submitItem = (data: any) => {
  //tambahkan data ke itemsTransaksi
  itemsTransaksi.value.push({
    tagihan_id: '',
    nama: data.nama,
    qty: data.qty,
    nominal_item: data.nominal,
    nominal: data.nominal,
    akun_pendapatan_id: data.akun_pendapatan_id,
    akun_pengeluaran_id: data.akun_pengeluaran_id,
    nomor: ''
  });
  countTotalItems()
}

const hapusItemTransaksi = (index:number) => {
  itemsTransaksi.value.splice(index, 1);
}

function countTotalItems() {
  let total = 0;
  itemsTransaksi.value.forEach((item) => {
    const nominal = parseFloat(item.nominal)
    total += (isNaN(nominal)? 0 : nominal);
  });
  form.value.nominal = total;
}

//watch itemsTransaksi
watch(itemsTransaksi, () => {
  countTotalItems()
});

//proses transaksi
const visiblePrintTransaksi = ref(false)
const printTransaksi = ref({} as any)
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
      if(form.value.cetak){
        printTransaksi.value = res
        visiblePrintTransaksi.value = true
      }
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
      nominal: '',
      jenis: 'pendapatan',
      akun_rekening_id:1,
      akun_rekening_tujuan_id:'',
      tagihan_id:'',
      user_id:'',
      catatan:'',
      nama: '',
      status:'sukses',
      metode_pembayaran: 'tunai',
      ref_nomor: '',
      items: [],
    }
    //reset itemsTransaksi
    itemsTransaksi.value = []
  }
</script>
