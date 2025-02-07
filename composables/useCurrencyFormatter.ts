export const useCurrencyFormatter = () => {

  const formatCurrency = (amount: any) => {
    //ubah amount ke integer
    amount = parseInt(amount);
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  }

  return {
    formatCurrency
  }

}
