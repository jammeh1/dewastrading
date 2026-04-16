export const BRAND = {
  name: 'DEWAS TRADING',
  slogan: 'Quality, Accessible and Professional',
  phones: ['+220 456 8445', '+220 677 5073', '+220 301 0041'],
  whatsapp: '2204568445',
  locations: ['Brikama', 'Penyem', 'Somita', 'Bwiam'],
  email: 'info@dewastrading.gm',
  partner: 'Lambatino S&N Borehole Drilling Company',
};

export const formatGMD = (n: number) =>
  new Intl.NumberFormat('en-GM').format(n) + ' GMD';
