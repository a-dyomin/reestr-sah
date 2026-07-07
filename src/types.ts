export type RegistryCategory =
  | 'applicants'
  | 'transport'
  | 'disinfection'
  | 'neutralization'

export type EntryStatus = 'active' | 'suspended' | 'pending' | 'archived'

export interface RegistryEntry {
  id: string
  category: RegistryCategory
  name: string
  address: string
  locality: string
  phone: string
  email: string
  website?: string
  ogrn: string
  license?: string
  licenseIssuer?: string
  medicalDevice?: string
  sanitaryConclusion?: string
  sanitaryIssuer?: string
  environmentalPermit?: string
  environmentalIssuer?: string
  environmentalExpiry?: string
  expertiseConclusion?: string
  expertiseIssuer?: string
  status: EntryStatus
  includedAt: string
  updatedAt: string
  wasteClasses?: string[]
}

export interface Application {
  id: string
  applicantName: string
  category: RegistryCategory
  submittedAt: string
  status: 'review' | 'returned' | 'approved' | 'rejected'
  deadline: string
}
