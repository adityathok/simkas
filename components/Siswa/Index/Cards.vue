<template>
  <div class="overflow-x-auto py-2 my-2">
    <div class="flex flex-row gap-4 my-1 text-nowrap">
      
      <div v-for="item in dataCards" :key="item.title" class="md:basis-1/3 min-w-[250px]">
        <div class="bg-white py-4 shadow-sm rounded-xl relative ps-20 pe-4 text-right overflow-hidden">
          <div class="text-sm">
            {{ item.title }}
          </div>
          <div class="font-bold text-xl md:text-2xl text-sky-600 mt-2">
            {{ formatCurrency(item.value) }}
          </div>
          <div class="absolute bottom-0 start-0 opacity-10 p-3">
            <Icon :name="item.icon"  size="3.5em"/>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const { formatCurrency } = useCurrencyFormatter();
const dataCards = [
  {
    title: 'Tagihan belum dibayar',
    value: '100000',
    icon: 'lucide:receipt-text',
  },
  {
    title: 'Tabungan',
    value: '200000',
    icon: 'lucide:wallet',
  },
  {
    title: 'Pembayaran bulan ini',
    value: '300000',
    icon: 'lucide:hand-coins',
  }
]
</script>
