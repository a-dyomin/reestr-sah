import type { RegistryCategory } from '../types'

export interface RequiredDocument {
  id: string
  title: string
  legalRef: string
  required: boolean
}

const COMMON: RequiredDocument[] = [
  {
    id: 'egrul',
    title: 'Выписка из ЕГРЮЛ / ЕГРИП (ОГРН / ОГРНИП)',
    legalRef: 'п. 5 приложения к Правилам, ПП РФ № 339',
    required: true,
  },
  {
    id: 'address',
    title: 'Документ, подтверждающий адрес (место нахождения / регистрации)',
    legalRef: 'п. 2 приложения к Правилам, ПП РФ № 339',
    required: true,
  },
  {
    id: 'territory',
    title: 'Сведения о территории осуществления деятельности',
    legalRef: 'п. 3 приложения к Правилам, ПП РФ № 339',
    required: true,
  },
]

const SANITARY: RequiredDocument = {
  id: 'sanitary',
  title: 'Санитарно-эпидемиологическое заключение',
  legalRef: 'п. 8 приложения к Правилам, ПП РФ № 339',
  required: true,
}

const LICENSE: RequiredDocument = {
  id: 'license',
  title: 'Лицензия на деятельность по дезинфекции, дезинсекции и дератизации',
  legalRef: 'п. 6 приложения к Правилам, ПП РФ № 339',
  required: true,
}

const MEDICAL_DEVICE: RequiredDocument = {
  id: 'meddevice',
  title: 'Сведения о регистрации медицинского изделия для обеззараживания / обезвреживания',
  legalRef: 'п. 7 приложения к Правилам, ПП РФ № 339',
  required: false,
}

const ENV_PERMIT: RequiredDocument = {
  id: 'envpermit',
  title: 'Комплексное экологическое разрешение',
  legalRef: 'п. 9 приложения к Правилам, ПП РФ № 339',
  required: false,
}

const ENV_EXPERTISE: RequiredDocument = {
  id: 'envexpertise',
  title: 'Заключение государственной экологической экспертизы',
  legalRef: 'п. 10 приложения к Правилам, ПП РФ № 339',
  required: false,
}

export const REQUIRED_DOCUMENTS: Record<Exclude<RegistryCategory, 'applicants'>, RequiredDocument[]> = {
  transport: [...COMMON, SANITARY],
  disinfection: [...COMMON, LICENSE, MEDICAL_DEVICE, SANITARY],
  neutralization: [...COMMON, SANITARY, ENV_PERMIT, ENV_EXPERTISE],
}

export const GENERATOR_DOCUMENTS: RequiredDocument[] = [
  {
    id: 'waste-info',
    title: 'Сведения об образовании медицинских отходов классов Б, В, Г',
    legalRef: 'ПП РФ № 339, п. 2 Правил',
    required: true,
  },
  ...COMMON,
]
