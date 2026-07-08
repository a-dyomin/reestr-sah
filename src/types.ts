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

export type TripPhotoType = 'loading' | 'transport' | 'unloading' | 'seals' | 'act'

export interface TripPhoto {
  id: string
  url: string
  caption: string
  type: TripPhotoType
  takenAt: string
}

export type TripStatus = 'completed' | 'in_transit' | 'registered' | 'cancelled'

export interface TransportTrip {
  id: string
  tripNumber: string
  date: string
  carrierId: string
  carrierName: string
  generatorId: string
  generatorName: string
  wasteClass: 'Б' | 'В' | 'Г'
  tonnage: number
  vehicle: string
  vehiclePlate: string
  driver: string
  routeFrom: string
  routeTo: string
  distanceKm: number
  status: TripStatus
  actNumber?: string
  photos: TripPhoto[]
  reportedAt: string
}

export interface ReportingPeriod {
  month: string
  label: string
  totalTonnage: number
  tripCount: number
  photoCount: number
}
