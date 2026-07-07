import type { RegistryCategory } from '../types'

export interface CategoryMeta {
  id: RegistryCategory
  title: string
  shortTitle: string
  legalBasis: string
  description: string
  icon: string
  accent: string
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'applicants',
    title: 'Заявители',
    shortTitle: 'Заявители',
    legalBasis: 'Лица, направляющие сведения в реестр',
    description:
      'Медицинские организации и иные лица, образующие медицинские отходы классов Б, В, Г, а также организации, подающие заявления на включение в реестр операторов.',
    icon: 'file',
    accent: '#5082E6',
  },
  {
    id: 'transport',
    title: 'Транспортирование',
    shortTitle: 'Перевозчики',
    legalBasis: 'ПП РФ № 339, п. 1 — транспортирование',
    description:
      'Лица, осуществляющие оказание услуг по транспортированию медицинских отходов на территории Удмуртской Республики.',
    icon: 'truck',
    accent: '#5AD2FF',
  },
  {
    id: 'disinfection',
    title: 'Обеззараживание',
    shortTitle: 'Обеззараживающие',
    legalBasis: 'ПП РФ № 339, п. 1 — обеззараживание',
    description:
      'Иные лица, осуществляющие обеззараживание медицинских отходов (не региональный оператор).',
    icon: 'shield',
    accent: '#FABE00',
  },
  {
    id: 'neutralization',
    title: 'Обезвреживание',
    shortTitle: 'Обезвреживающие',
    legalBasis: 'ПП РФ № 339, п. 1 — обезвреживание',
    description:
      'Лица, осуществляющие оказание услуг по обезвреживанию медицинских отходов на территории субъекта.',
    icon: 'factory',
    accent: '#E62D32',
  },
]

export function getCategory(id: RegistryCategory) {
  return CATEGORIES.find((c) => c.id === id)!
}
