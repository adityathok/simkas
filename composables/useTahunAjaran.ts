export const useTahunAjaran = () => {
  const tahunAjaran = ref('');
  const tahunMulai = ref(0);
  const tahunSelesai = ref(0);

  const tanggalSekarang = new Date();
  const bulanSekarang = tanggalSekarang.getMonth();
  const tahunSekarang = tanggalSekarang.getFullYear();
    
  if (bulanSekarang >= 6) {
    // Jika bulan adalah Juli (6) atau lebih, tahun ajaran mulai pada tahun ini
    tahunMulai.value = tahunSekarang;
    tahunSelesai.value = tahunSekarang + 1;
  } else {
    // Jika bulan kurang dari Juli, tahun ajaran mulai pada tahun sebelumnya
    tahunMulai.value = tahunSekarang - 1;
    tahunSelesai.value = tahunSekarang;
  }

  tahunAjaran.value = `${tahunMulai.value}/${tahunSelesai.value}`;

  return { 
    tahunAjaran,
    tahunMulai,
    tahunSelesai
  };
}
