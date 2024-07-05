export const getNumberOnly = (e: React.KeyboardEvent) => {
  const input = e.target as HTMLInputElement;
  input.value = input.value.replace(/[^0-9]/g, '');
};
