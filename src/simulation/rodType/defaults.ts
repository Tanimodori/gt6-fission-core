import { RodTypeInfo } from '.';

export const defaultRodTypeInfos: RodTypeInfo[] = [
  {
    id: 9201,
    fullname: 'Empty',
    basename: '?',
    superscript: '',
    color: '#CCCCCC',
    duability: Infinity,
    emissionSelf: 0,
    emissionOthers: 0,
    factor: Infinity,
  },
  {
    id: 9202,
    fullname: 'NeutronAbsorber',
    basename: 'n',
    superscript: 'a',
    color: '#646480',
    duability: Infinity,
    emissionSelf: 0,
    emissionOthers: 0,
    factor: Infinity,
  },
  {
    id: 9203,
    fullname: 'NeutronReflector',
    basename: 'n',
    superscript: 'r',
    color: '#192D19',
    duability: Infinity,
    emissionSelf: 0,
    emissionOthers: 0,
    factor: Infinity,
  },
  {
    id: 9210,
    fullname: 'Thorium230',
    basename: 'Th',
    superscript: '230',
    color: '#001E00',
    duability: 6000000,
    emissionSelf: 8,
    emissionOthers: 8,
    factor: 64,
  },
  {
    id: 9220,
    fullname: 'Uranium238',
    basename: 'U',
    superscript: '238',
    color: '#24AB24',
    duability: 3000000,
    emissionSelf: 16,
    emissionOthers: 16,
    factor: 32,
  },
  {
    id: 9221,
    fullname: 'Uranium235',
    basename: 'U',
    superscript: '235',
    color: '#58DF58',
    duability: 600000,
    emissionSelf: 128,
    emissionOthers: 128,
    factor: 8,
  },
  {
    id: 9230,
    fullname: 'Plutonium244',
    basename: 'Pu',
    superscript: '244',
    color: '#F03232',
    duability: 600000,
    emissionSelf: 256,
    emissionOthers: 256,
    factor: 8,
  },
  {
    id: 9231,
    fullname: 'Plutonium241',
    basename: 'Pu',
    superscript: '241',
    color: '#F26B6B',
    duability: 600000,
    emissionSelf: 512,
    emissionOthers: 512,
    factor: 6,
  },
  {
    id: 9232,
    fullname: 'Plutonium243',
    basename: 'Pu',
    superscript: '243',
    color: '#F0C3C3',
    duability: 600000,
    emissionSelf: 512,
    emissionOthers: 512,
    factor: 6,
  },
  {
    id: 9240,
    fullname: 'Americium245',
    basename: 'Am',
    superscript: '245',
    color: '#8F8F8F',
    duability: 600000,
    emissionSelf: 256,
    emissionOthers: 256,
    factor: 8,
  },
  {
    id: 9241,
    fullname: 'Americium241',
    basename: 'Am',
    superscript: '241',
    color: '#3D4D4D',
    duability: 600000,
    emissionSelf: 512,
    emissionOthers: 512,
    factor: 6,
  },
  {
    id: 9250,
    fullname: 'Cobalt60',
    basename: 'Co',
    superscript: '60',
    color: '#5A5AFE',
    duability: 3000000,
    emissionSelf: 8,
    emissionOthers: 8,
    factor: 32,
  },
  {
    id: 9260,
    fullname: 'EnrichedNaquadah',
    basename: 'Nq',
    superscript: '+',
    color: '#5F5F5F',
    duability: 6000000,
    emissionSelf: 512,
    emissionOthers: 512,
    factor: 8,
  },
  {
    id: 9261,
    fullname: 'Naquadria',
    basename: 'Nq',
    superscript: '',
    color: '#3B3B3B',
    duability: 6000000,
    emissionSelf: 2048,
    emissionOthers: 2048,
    factor: 6,
  },
];
