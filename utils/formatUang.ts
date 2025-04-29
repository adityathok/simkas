// utils/formatUang.ts
export function formatUang(angka: number) {
    // Hilangkan desimal
    const bulat = Math.floor(angka);

    // Ubah ke string dan tambahkan titik tiap 3 digit dari belakang
    return bulat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}