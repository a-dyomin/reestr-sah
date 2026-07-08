import { useMemo, useState } from 'react'
import { CATEGORIES, getCategory } from './data/categories'
import { APPLICATIONS, REGISTRY_ENTRIES } from './data/mockData'
import { getReportingSummary, REPORTING_PERIODS, TRANSPORT_TRIPS } from './data/mockReportingData'
import { PHOTO_TYPE_LABELS, TRIP_STATUS_LABELS } from './data/reportingLabels'
import { REQUIRED_DOCUMENTS } from './data/requiredDocuments'
import type { RegistryCategory, RegistryEntry, TransportTrip } from './types'
import './App.css'

type View = 'dashboard' | RegistryCategory | 'applications' | 'opendata' | 'reporting'

function isRegistryCategoryView(view: View): view is RegistryCategory {
  return CATEGORIES.some((c) => c.id === view)
}

const STATUS_LABELS: Record<RegistryEntry['status'], string> = {
  active: 'Включён',
  suspended: 'Приостановлен',
  pending: 'На проверке',
  archived: 'Архив',
}

const APP_STATUS: Record<string, { label: string; className: string }> = {
  review: { label: 'На рассмотрении', className: 'badge-info' },
  returned: { label: 'Возвращён на доработку', className: 'badge-warning' },
  approved: { label: 'Одобрено', className: 'badge-success' },
  rejected: { label: 'Отклонено', className: 'badge-danger' },
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
    truck: 'M10 17h4M2 17h1M17 17h1M18 17V9l-3-4H6v12M6 9h9',
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    factory: 'M2 20h20M5 20V10l5-3v13M12 20V6l7-4v18M9 9v.01M9 12v.01M9 15v.01',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    plus: 'M12 5v14M5 12h14',
    close: 'M18 6L6 18M6 6l12 12',
    info: 'M12 16v-4M12 8h.01',
    chart: 'M3 3v18h18 M7 16l4-4 4 4 5-6',
    camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    scale: 'M16 16h6v6M2 16h6v6M12 2v20M2 12h20',
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.info} />
    </svg>
  )
}

function App() {
  const [view, setView] = useState<View>('dashboard')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<RegistryEntry | null>(null)
  const [selectedTrip, setSelectedTrip] = useState<TransportTrip | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formCategory, setFormCategory] = useState<Exclude<RegistryCategory, 'applicants'>>('transport')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    let items = REGISTRY_ENTRIES
    if (isRegistryCategoryView(view)) {
      items = items.filter((e) => e.category === view)
    }
    if (!q) return items
    return items.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.locality.toLowerCase().includes(q) ||
        e.ogrn.includes(q),
    )
  }, [view, search])

  const reportingSummary = useMemo(() => getReportingSummary(), [])

  const filteredTrips = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return TRANSPORT_TRIPS
    return TRANSPORT_TRIPS.filter(
      (t) =>
        t.tripNumber.toLowerCase().includes(q) ||
        t.carrierName.toLowerCase().includes(q) ||
        t.generatorName.toLowerCase().includes(q) ||
        t.vehiclePlate.toLowerCase().includes(q),
    )
  }, [search])

  const stats = useMemo(() => {
    const byCat = (cat: RegistryCategory) =>
      REGISTRY_ENTRIES.filter((e) => e.category === cat && e.status === 'active').length
    return {
      total: REGISTRY_ENTRIES.filter((e) => e.status === 'active').length,
      applicants: byCat('applicants'),
      transport: byCat('transport'),
      disinfection: byCat('disinfection'),
      neutralization: byCat('neutralization'),
      pending: APPLICATIONS.filter((a) => a.status === 'review').length,
    }
  }, [])

  const isRegistryView = isRegistryCategoryView(view)

  const pageTitle =
    view === 'dashboard'
      ? 'Главная'
      : view === 'applications'
        ? 'Входящие заявления'
        : view === 'opendata'
          ? 'Открытые данные'
          : view === 'reporting'
            ? 'Отчётность'
            : getCategory(view).title

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/assets/sah-logo.svg" alt="ООО Спецавтохозяйство" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-title">Реестр медотходов</span>
            <span className="brand-sub">Удмуртская Республика</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            <Icon name="grid" />
            Главная
          </button>

          <div className="nav-section">Разделы реестра</div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`nav-item ${view === cat.id ? 'active' : ''}`}
              onClick={() => setView(cat.id)}
            >
              <Icon name={cat.icon} />
              {cat.shortTitle}
              <span className="nav-count">
                {REGISTRY_ENTRIES.filter((e) => e.category === cat.id && e.status === 'active').length}
              </span>
            </button>
          ))}

          <div className="nav-section">Администрирование</div>
          <button
            type="button"
            className={`nav-item ${view === 'reporting' ? 'active' : ''}`}
            onClick={() => setView('reporting')}
          >
            <Icon name="chart" />
            Отчётность
          </button>
          <button
            type="button"
            className={`nav-item ${view === 'applications' ? 'active' : ''}`}
            onClick={() => setView('applications')}
          >
            <Icon name="list" />
            Заявления
            {stats.pending > 0 && <span className="nav-badge">{stats.pending}</span>}
          </button>
          <button
            type="button"
            className={`nav-item ${view === 'opendata' ? 'active' : ''}`}
            onClick={() => setView('opendata')}
          >
            <Icon name="download" />
            Открытые данные
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="holder-card">
            <strong>Держатель реестра</strong>
            <span>ООО «САХ»</span>
            <span className="muted">Региональный оператор</span>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div>
            <h1>{pageTitle}</h1>
            <p className="topbar-sub">
              Региональный реестр операторов медицинских отходов · ПП РФ от 28.03.2026 № 339
            </p>
          </div>
          <div className="topbar-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setView('opendata')}>
              <Icon name="download" />
              Экспорт CSV
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Icon name="plus" />
              Подать заявление
            </button>
          </div>
        </header>

        {isRegistryView && (
          <div className="category-banner" style={{ borderColor: getCategory(view as RegistryCategory).accent }}>
            <div>
              <span className="legal-tag">{getCategory(view as RegistryCategory).legalBasis}</span>
              <p>{getCategory(view as RegistryCategory).description}</p>
            </div>
          </div>
        )}

        {(view === 'dashboard' || isRegistryView || view === 'reporting') && (
          <div className="toolbar">
            <div className="search-box">
              <Icon name="search" />
              <input
                type="search"
                placeholder={
                  view === 'reporting'
                    ? 'Поиск по № рейса, перевозчику, отходообразователю, госномеру...'
                    : 'Поиск по наименованию, населённому пункту, ОГРН...'
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}

        <main className="content">
          {view === 'dashboard' && (
            <>
              <div className="stats-grid">
                <div className="stat-card stat-primary">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">Активных записей</span>
                </div>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="stat-card"
                    style={{ '--accent': cat.accent } as React.CSSProperties}
                    onClick={() => setView(cat.id)}
                  >
                    <Icon name={cat.icon} />
                    <span className="stat-value">
                      {REGISTRY_ENTRIES.filter((e) => e.category === cat.id && e.status === 'active').length}
                    </span>
                    <span className="stat-label">{cat.shortTitle}</span>
                  </button>
                ))}
              </div>

              <div className="info-panel">
                <Icon name="info" />
                <div>
                  <strong>О реестре</strong>
                  <p>
                    С 1 сентября 2026 года организации обязаны работать только с подрядчиками, включёнными в
                    региональный реестр. Сведения размещаются в течение 5 рабочих дней. Держатель реестра — ООО
                    «Спецавтохозяйство» по поручению уполномоченного органа Удмуртской Республики.
                  </p>
                </div>
              </div>

              <section className="panel">
                <h2>Последние изменения</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Организация</th>
                      <th>Раздел</th>
                      <th>Статус</th>
                      <th>Обновлено</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...REGISTRY_ENTRIES]
                      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                      .slice(0, 5)
                      .map((entry) => (
                        <tr key={entry.id} onClick={() => setSelected(entry)} className="clickable">
                          <td>{entry.name}</td>
                          <td>{getCategory(entry.category).shortTitle}</td>
                          <td>
                            <span className={`badge badge-${entry.status}`}>{STATUS_LABELS[entry.status]}</span>
                          </td>
                          <td>{formatDate(entry.updatedAt)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </section>
            </>
          )}

          {view === 'applications' && (
            <section className="panel">
              <h2>Входящие заявления</h2>
              <p className="panel-desc">
                Регламент: проверка в течение 5 рабочих дней, уведомление отходообразователя в течение 1 рабочего дня после
                размещения.
              </p>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Отходообразователь / организация</th>
                    <th>Раздел</th>
                    <th>Подано</th>
                    <th>Срок рассмотрения</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {APPLICATIONS.map((app) => (
                    <tr key={app.id}>
                      <td className="mono">{app.id}</td>
                      <td>{app.applicantName}</td>
                      <td>{getCategory(app.category).shortTitle}</td>
                      <td>{formatDate(app.submittedAt)}</td>
                      <td>{formatDate(app.deadline)}</td>
                      <td>
                        <span className={`badge ${APP_STATUS[app.status].className}`}>
                          {APP_STATUS[app.status].label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {view === 'opendata' && (
            <section className="panel">
              <h2>Открытые данные</h2>
              <p className="panel-desc">
                Сведения размещаются в форме открытых данных (п. 10 Правил, утв. ПП РФ № 339). Удаление записей с
                официального сайта не допускается.
              </p>
              <div className="opendata-grid">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="opendata-card">
                    <h3>{cat.title}</h3>
                    <p>{REGISTRY_ENTRIES.filter((e) => e.category === cat.id).length} записей</p>
                    <button type="button" className="btn btn-secondary btn-sm">
                      <Icon name="download" />
                      JSON
                    </button>
                    <button type="button" className="btn btn-secondary btn-sm">
                      <Icon name="download" />
                      CSV
                    </button>
                  </div>
                ))}
              </div>
              <div className="fields-list">
                <h3>Перечень сведений (приложение к Правилам)</h3>
                <ol>
                  <li>Полное наименование юридического лица / ФИО ИП</li>
                  <li>Адрес юридического лица / адрес регистрации ИП</li>
                  <li>Территория осуществления деятельности</li>
                  <li>Телефон, e-mail, сайт (при наличии)</li>
                  <li>ОГРН / ОГРНИП</li>
                  <li>Реквизиты лицензии на дезинфекцию (при наличии)</li>
                  <li>Сведения о регистрации медицинского изделия (при наличии)</li>
                  <li>Реквизиты санитарно-эпидемиологического заключения (при наличии)</li>
                  <li>Реквизиты комплексного экологического разрешения (при наличии)</li>
                  <li>Реквизиты заключения госэкспертизы (при наличии)</li>
                </ol>
              </div>
            </section>
          )}

          {view === 'reporting' && (
            <>
              <div className="stats-grid reporting-stats">
                <div className="stat-card stat-primary">
                  <Icon name="scale" />
                  <span className="stat-value">{reportingSummary.totalTonnage}</span>
                  <span className="stat-label">Тонн за {reportingSummary.monthLabel.toLowerCase()}</span>
                </div>
                <div className="stat-card" style={{ '--accent': '#5AD2FF' } as React.CSSProperties}>
                  <Icon name="truck" />
                  <span className="stat-value">{reportingSummary.tripCount}</span>
                  <span className="stat-label">Рейсов за месяц</span>
                </div>
                <div className="stat-card" style={{ '--accent': '#FABE00' } as React.CSSProperties}>
                  <Icon name="camera" />
                  <span className="stat-value">{reportingSummary.photoCount}</span>
                  <span className="stat-label">Фотофиксаций</span>
                </div>
                <div className="stat-card" style={{ '--accent': '#5082E6' } as React.CSSProperties}>
                  <Icon name="truck" />
                  <span className="stat-value">{reportingSummary.inTransit}</span>
                  <span className="stat-label">В пути сейчас</span>
                </div>
              </div>

              <section className="panel">
                <h2>Тоннаж по месяцам</h2>
                <div className="tonnage-chart">
                  {REPORTING_PERIODS.map((p) => (
                    <div key={p.month} className="tonnage-bar-wrap">
                      <div
                        className="tonnage-bar"
                        style={{ height: `${(p.totalTonnage / 25) * 100}%` }}
                        title={`${p.totalTonnage} т`}
                      />
                      <span className="tonnage-value">{p.totalTonnage} т</span>
                      <span className="tonnage-label">{p.label.replace(' 2026', '')}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="panel">
                <div className="panel-header">
                  <h2>Реестр рейсов</h2>
                  <span className="result-count">{filteredTrips.length} рейсов</span>
                </div>
                <p className="panel-desc">
                  Учёт транспортирования медотходов: тоннаж, маршрут, фотофиксация погрузки, пломб, разгрузки и актов
                  приёма-передачи.
                </p>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>№ рейса</th>
                      <th>Дата</th>
                      <th>Перевозчик</th>
                      <th>Отходообразователь</th>
                      <th>Класс</th>
                      <th>Тоннаж, т</th>
                      <th>ТС</th>
                      <th>Фото</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrips.map((trip) => (
                      <tr key={trip.id} onClick={() => setSelectedTrip(trip)} className="clickable">
                        <td className="mono">{trip.tripNumber}</td>
                        <td>{formatDate(trip.date)}</td>
                        <td className="name-cell">{trip.carrierName}</td>
                        <td>{trip.generatorName}</td>
                        <td>
                          <span className="class-tag">{trip.wasteClass}</span>
                        </td>
                        <td className="tonnage-cell">{trip.tonnage.toFixed(2)}</td>
                        <td>
                          <span className="vehicle-cell">
                            {trip.vehicle}
                            <span className="plate">{trip.vehiclePlate}</span>
                          </span>
                        </td>
                        <td>
                          <span className="photo-count">
                            <Icon name="camera" />
                            {trip.photos.length}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-trip-${trip.status}`}>
                            {TRIP_STATUS_LABELS[trip.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          )}

          {isRegistryView && (
            <section className="panel">
              <div className="panel-header">
                <h2>{getCategory(view as RegistryCategory).title}</h2>
                <span className="result-count">{filtered.length} записей</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Наименование</th>
                    <th>Населённый пункт</th>
                    <th>ОГРН</th>
                    <th>Классы отходов</th>
                    <th>Статус</th>
                    <th>Включён</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => (
                    <tr key={entry.id} onClick={() => setSelected(entry)} className="clickable">
                      <td className="name-cell">{entry.name}</td>
                      <td>{entry.locality}</td>
                      <td className="mono">{entry.ogrn}</td>
                      <td>
                        <span className="class-tags">
                          {entry.wasteClasses?.map((c) => (
                            <span key={c} className="class-tag">
                              {c}
                            </span>
                          ))}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${entry.status}`}>{STATUS_LABELS[entry.status]}</span>
                      </td>
                      <td>{formatDate(entry.includedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </main>

        <footer className="page-footer">
          <span>© 2026 ООО «Спецавтохозяйство» · Держатель регионального реестра</span>
          <span>
            Основание: ПП РФ от 28.03.2026 № 339 · Действует до 01.09.2032
          </span>
        </footer>
      </div>

      {selectedTrip && (
        <div className="modal-overlay" onClick={() => setSelectedTrip(null)} role="presentation">
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()} role="dialog">
            <div className="modal-header">
              <div>
                <h2>Рейс {selectedTrip.tripNumber}</h2>
                <p className="modal-subtitle">
                  {formatDate(selectedTrip.date)} · {TRIP_STATUS_LABELS[selectedTrip.status]}
                </p>
              </div>
              <button type="button" className="icon-btn" onClick={() => setSelectedTrip(null)} aria-label="Закрыть">
                <Icon name="close" />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <Detail label="Перевозчик" value={selectedTrip.carrierName} />
                <Detail label="Отходообразователь" value={selectedTrip.generatorName} />
                <Detail label="Класс отходов" value={selectedTrip.wasteClass} />
                <Detail label="Тоннаж" value={`${selectedTrip.tonnage.toFixed(2)} т`} />
                <Detail label="Транспортное средство" value={`${selectedTrip.vehicle}, ${selectedTrip.vehiclePlate}`} />
                <Detail label="Водитель" value={selectedTrip.driver} />
                <Detail label="Маршрут" value={`${selectedTrip.routeFrom} → ${selectedTrip.routeTo}`} />
                <Detail label="Расстояние" value={`${selectedTrip.distanceKm} км`} />
                {selectedTrip.actNumber && <Detail label="Акт приёма-передачи" value={selectedTrip.actNumber} />}
                <Detail label="Дата отчётности" value={formatDate(selectedTrip.reportedAt)} />
              </div>

              <div className="photo-gallery">
                <h3>Фотофиксация ({selectedTrip.photos.length})</h3>
                <div className="photo-grid">
                  {selectedTrip.photos.map((photo) => (
                    <figure key={photo.id} className="photo-card">
                      <img src={photo.url} alt={photo.caption} />
                      <figcaption>
                        <span className="photo-type">{PHOTO_TYPE_LABELS[photo.type]}</span>
                        <span className="photo-caption">{photo.caption}</span>
                        <span className="photo-time">{formatDateTime(photo.takenAt)}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)} role="presentation">
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="modal-title">
            <div className="modal-header">
              <h2 id="modal-title">{selected.name}</h2>
              <button type="button" className="icon-btn" onClick={() => setSelected(null)} aria-label="Закрыть">
                <Icon name="close" />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <Detail label="Раздел реестра" value={getCategory(selected.category).title} />
                <Detail label="Статус" value={STATUS_LABELS[selected.status]} />
                <Detail label="Адрес" value={selected.address} />
                <Detail label="Населённый пункт" value={selected.locality} />
                <Detail label="Телефон" value={selected.phone} />
                <Detail label="E-mail" value={selected.email} />
                {selected.website && <Detail label="Сайт" value={selected.website} />}
                <Detail label="ОГРН" value={selected.ogrn} />
                {selected.license && <Detail label="Лицензия" value={selected.license} />}
                {selected.licenseIssuer && <Detail label="Орган, выдавший лицензию" value={selected.licenseIssuer} />}
                {selected.medicalDevice && <Detail label="Медицинское изделие" value={selected.medicalDevice} />}
                {selected.sanitaryConclusion && (
                  <Detail label="Санитарно-эпидемиологическое заключение" value={selected.sanitaryConclusion} />
                )}
                {selected.environmentalPermit && (
                  <Detail label="Комплексное экологическое разрешение" value={selected.environmentalPermit} />
                )}
                {selected.expertiseConclusion && (
                  <Detail label="Заключение госэкспертизы" value={selected.expertiseConclusion} />
                )}
                <Detail label="Дата включения" value={formatDate(selected.includedAt)} />
                <Detail label="Последнее обновление" value={formatDate(selected.updatedAt)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)} role="presentation">
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()} role="dialog">
            <div className="modal-header">
              <h2>Подача заявления на включение в реестр</h2>
              <button type="button" className="icon-btn" onClick={() => setShowForm(false)} aria-label="Закрыть">
                <Icon name="close" />
              </button>
            </div>
            <div className="modal-body">
              <p className="form-note">
                Заявление направляется в электронном виде с усиленной квалифицированной ЭП через региональный портал
                госуслуг (с 01.03.2027 — через Госуслуги).
              </p>
              <form className="application-form" onSubmit={(e) => e.preventDefault()}>
                <label>
                  Раздел реестра
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Exclude<RegistryCategory, 'applicants'>)}
                  >
                    {CATEGORIES.filter((c) => c.id !== 'applicants').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Полное наименование / ФИО ИП
                  <input type="text" placeholder="ООО «Пример»" />
                </label>
                <div className="form-row">
                  <label>
                    ОГРН / ОГРНИП
                    <input type="text" placeholder="1XXXXXXXXXXXXXX" />
                  </label>
                  <label>
                    Телефон
                    <input type="tel" placeholder="+7 (___) ___-__-__" />
                  </label>
                </div>
                <label>
                  Адрес
                  <input type="text" placeholder="426000, г. Ижевск, ул. ..." />
                </label>
                <label>
                  E-mail
                  <input type="email" placeholder="info@example.ru" />
                </label>
                <label>
                  Территория деятельности
                  <input type="text" defaultValue="Удмуртская Республика, г. Ижевск" />
                </label>

                <div className="form-documents">
                  <h3>Прилагаемые документы</h3>
                  <p className="form-documents-note">
                    Перечень согласно приложению к Правилам (ПП РФ от 28.03.2026 № 339). Форматы: PDF, JPEG, PNG.
                    Максимальный размер файла — 10 МБ.
                  </p>
                  {REQUIRED_DOCUMENTS[formCategory].map((doc) => (
                    <label key={doc.id} className="file-field">
                      <span className="file-field-label">
                        {doc.title}
                        {doc.required ? (
                          <span className="file-required">обязательно</span>
                        ) : (
                          <span className="file-optional">при наличии</span>
                        )}
                      </span>
                      <span className="file-field-ref">{doc.legalRef}</span>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" required={doc.required} />
                    </label>
                  ))}
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Подписать и отправить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  )
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default App
