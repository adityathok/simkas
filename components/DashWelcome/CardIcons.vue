<template>
  <div class="overflow-x-auto">
     <div class="flex justify-between gap-4">
      
        <DashCard class="min-w-[200px] md:min-w-[23%] flex justify-between bg-emerald-100">
          <div class="overview">
            <div class="text-xs">
              Pendapatan bulan ini
            </div>
            <div class="text-2xl">
              {{ formatUang(props.total_pendapatan)  }}
            </div>
          </div>
          <div>
            <Icon name="lucide:download" />
          </div>
        </DashCard>

        <DashCard class="min-w-[200px] md:min-w-[23%] flex justify-between bg-slate-100">
          <div class="overview">
            <div class="text-xs">
              Pengeluaran bulan ini
            </div>
            <div class="text-2xl">
              {{ formatUang(props.total_pengeluaran)  }}
            </div>
          </div>
          <div>
            <Icon name="lucide:upload" />
          </div>
        </DashCard>

        <DashCard class="min-w-[200px] md:min-w-[23%] flex justify-between bg-sky-100">
          <div class="overview">
            <div class="text-xs">
              Transaksi hari ini
            </div>
            <div class="text-2xl">
              {{ formatUang(props.total_hariini)  }}
            </div>
          </div>
          <div>
            <Icon name="lucide:activity" />
          </div>
        </DashCard>

        <DashCard class="min-w-[200px] md:min-w-[23%] flex justify-between bg-yellow-100">
          <div class="overview">
            <div class="text-xs">
              Tagihan bulanan ini
            </div>
            <div class="text-2xl">
              {{ formatUang(props.total_tagihan)  }}
            </div>
          </div>
          <div>
            <Icon name="lucide:receipt-text" />
          </div>
        </DashCard>
        
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['total_pendapatan','total_pengeluaran','total_hariini','total_tagihan'])
</script>
