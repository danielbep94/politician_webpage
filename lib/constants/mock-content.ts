import type {
  Activity,
  ActivityCategory,
  AvailabilityOption,
  BlockContent,
  Candidate,
  ContactTopic,
  Event,
  FileWithAsset,
  FAQ,
  ImageWithAlt,
  MediaAsset,
  Post,
  PressRelease,
  Priority,
  Proposal,
  Seo,
  SiteSettings,
  VideoEmbed,
  VolunteerArea
} from "@/lib/types";
import { createPortableTextBlock } from "@/lib/portable-text";

const createBlock = (
  text: string,
  options?: {
    style?: "normal" | "h2" | "h3" | "blockquote";
    listItem?: "bullet" | "number";
    level?: number;
  }
) => createPortableTextBlock(text, options);

const createBlockContent = (...blocks: Parameters<typeof createBlock>[]): BlockContent =>
  blocks.map(([text, options]) => createBlock(text, options));

const createImageWithAlt = (
  src: string,
  alt: string,
  caption?: string
): ImageWithAlt => ({
  _type: "imageWithAlt",
  src,
  alt,
  ...(caption ? { caption } : {})
});

const createFileWithAsset = (src: string): FileWithAsset => ({
  _type: "file",
  src
});

const createVideoEmbed = (
  provider: VideoEmbed["provider"],
  url: string,
  title?: string
): VideoEmbed => ({
  _type: "videoEmbed",
  provider,
  url,
  ...(title ? { title } : {})
});

const createActivityCategory = (title: string, slug: string): ActivityCategory => ({
  _type: "activityCategory",
  title,
  slug
});

const createSeo = (values: Seo): Seo => values;

export const siteSettingsMock: SiteSettings = {
  title: "Impulso Comunitario",
  description:
    "Web institucional-campaña híbrida para construir cercanía, rendición de cuentas y movilización ciudadana.",
  url: "http://localhost:3000",
  locale: "es_MX",
  contactEmail: "equipo@impulsocomunitario.mx",
  heroMessage: "Una agenda clara para resolver lo cotidiano con visión de futuro.",
  heroSubheadline:
    "Escuchar, organizar y ejecutar con la comunidad al centro. Propuestas medibles, cercanas y accionables.",
  defaultOgImage: "/images/media/session-horizontal.png",
  defaultOgImageAsset: createImageWithAlt(
    "/images/media/session-horizontal.png",
    "Imagen social principal de Impulso Comunitario"
  )
};

export const candidateMock: Candidate & { portrait?: ImageWithAlt } = {
  name: "Mariana Torres",
  shortName: "Mariana",
  role: "Candidata ciudadana",
  location: "San Miguel de los Álamos",
  headline: "Liderazgo cercano para una comunidad segura, activa y con oportunidades.",
  summary:
    "Mariana trabaja desde hace más de diez años con vecinos, jóvenes y organizaciones locales para convertir demandas ciudadanas en soluciones concretas.",
  biography: [
    "Soy una servidora pública de territorio. Empecé acompañando comités vecinales, brigadas juveniles y mesas de trabajo con comerciantes locales.",
    "Con el tiempo entendí que la gente no pide discursos perfectos: pide presencia, claridad y seguimiento. Esa experiencia define esta plataforma."
  ],
  trajectory: [
    "Coordinó programas de recuperación de espacios públicos y activación deportiva barrial.",
    "Impulsó alianzas con escuelas y organizaciones civiles para becas de formación técnica.",
    "Lideró jornadas de atención ciudadana en colonias con rezago urbano."
  ],
  values: [
    "Cercanía para escuchar antes de decidir.",
    "Honestidad para decir qué sí se puede hacer y cómo.",
    "Resultados medibles para rendir cuentas con claridad."
  ],
  vision:
    "Construir una comunidad donde la seguridad, la movilidad, el empleo y la participación juvenil dejen de ser promesas aisladas y se conviertan en una agenda pública sostenida.",
  email: "equipo@impulsocomunitario.mx",
  phone: "+52 55 0000 0000",
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "YouTube", href: "https://youtube.com" }
  ],
  portrait: createImageWithAlt(
    "/images/media/candidate-portrait.png",
    "Fotografía oficial de Mariana Torres, candidata ciudadana"
  )
};

export const prioritiesMock: Priority[] = [
  {
    title: "Seguridad de proximidad",
    description:
      "Más coordinación barrial, mejor iluminación y rutas de respuesta rápida enfocadas en zonas con reportes recurrentes."
  },
  {
    title: "Oportunidades para jóvenes",
    description:
      "Formación, deporte, cultura y conexión con empleo local para que quedarse en la comunidad también signifique crecer."
  },
  {
    title: "Servicios que sí funcionen",
    description:
      "Atención ciudadana con seguimiento real para bacheo, limpieza, alumbrado y espacios públicos."
  }
];

export const proposalsMock: Proposal[] = [
  {
    title: "Barrios seguros 24/7",
    slug: "barrios-seguros-24-7",
    theme: "Seguridad",
    summary:
      "Programa integral de prevención, iluminación y respuesta vecinal con seguimiento público.",
    problem:
      "Las familias enfrentan calles con poca iluminación, tiempos de atención lentos y poca coordinación entre reportes ciudadanos y acciones visibles.",
    context:
      "Los puntos con mayor percepción de inseguridad coinciden con zonas de baja activación comunitaria y mantenimiento irregular del espacio público.",
    proposal:
      "Crear un esquema de seguridad de proximidad apoyado en mapeo barrial, comités vecinales, rutas de patrullaje preventivo y tablero público de incidencias.",
    actions: [
      "Instalar un programa trimestral de mejora de iluminación y poda preventiva.",
      "Publicar rutas prioritarias de vigilancia y tiempos de respuesta esperados.",
      "Activar redes vecinales conectadas con una mesa operativa de seguimiento."
    ],
    expectedImpact: [
      "Mejor percepción de seguridad en trayectos cotidianos.",
      "Reducción de puntos ciegos en colonias prioritarias.",
      "Mayor confianza ciudadana al contar con seguimiento visible."
    ],
    citizenCta: "Comparte los puntos de riesgo de tu colonia para integrarlos al mapa ciudadano.",
    featured: true
  },
  {
    title: "Primer empleo local",
    slug: "primer-empleo-local",
    theme: "Juventud y empleo",
    summary:
      "Vinculación entre jóvenes, comercios y centros de formación para generar trayectorias laborales reales.",
    problem:
      "Muchos jóvenes terminan la preparatoria o la universidad sin una ruta clara para entrar al mercado laboral de su propia comunidad.",
    context:
      "Existe talento local, pero falta una red articulada entre empresas, talleres, centros educativos y mentorías.",
    proposal:
      "Crear una bolsa de oportunidades con capacitación corta, mentoría y ferias de reclutamiento por sector.",
    actions: [
      "Mapear vacantes locales y perfiles requeridos.",
      "Organizar bootcamps de habilidades blandas y digitales.",
      "Lanzar una ruta de mentoría con negocios y profesionistas de la zona."
    ],
    expectedImpact: [
      "Más jóvenes con experiencia laboral inicial.",
      "Mayor permanencia del talento dentro de la comunidad.",
      "Mejor alineación entre formación y oportunidades locales."
    ],
    citizenCta: "Si tienes un negocio o conoces vacantes, súmate a la red de oportunidades.",
    featured: true
  },
  {
    title: "Espacios vivos para la comunidad",
    slug: "espacios-vivos-para-la-comunidad",
    theme: "Espacio público",
    summary:
      "Rescate de parques, canchas y centros comunitarios con agenda de uso y mantenimiento compartido.",
    problem:
      "Los espacios públicos deteriorados reducen la convivencia, inhiben actividades juveniles y aumentan la percepción de abandono.",
    context:
      "Cuando hay programación deportiva, cultural y comunitaria constante, los espacios se cuidan más y se usan mejor.",
    proposal:
      "Intervenir espacios clave con mantenimiento ligero, agenda pública y comités ciudadanos de activación.",
    actions: [
      "Definir espacios piloto por colonia con diagnóstico rápido.",
      "Diseñar calendarios mensuales de actividades comunitarias.",
      "Abrir convocatorias para colectivos culturales y deportivos."
    ],
    expectedImpact: [
      "Más convivencia y apropiación positiva del espacio público.",
      "Mejor percepción urbana en zonas estratégicas.",
      "Redes comunitarias más activas entre vecinos, escuelas y colectivos."
    ],
    citizenCta: "Propón qué espacio necesita reactivarse primero y qué actividad debe vivir ahí.",
    featured: true
  },
  {
    title: "Ventanilla ciudadana con seguimiento",
    slug: "ventanilla-ciudadana-con-seguimiento",
    theme: "Gobierno cercano",
    summary:
      "Sistema de reportes y atención priorizada para convertir solicitudes ciudadanas en soluciones trazables.",
    problem:
      "La ciudadanía reporta problemas, pero rara vez sabe quién atiende, cuándo o bajo qué prioridad.",
    context:
      "Sin seguimiento claro, los reportes se duplican, aumenta la frustración y se pierde confianza institucional.",
    proposal:
      "Crear una ventanilla multicanal con número de folio, tiempos de respuesta y reportes públicos de avance.",
    actions: [
      "Unificar atención presencial, digital y territorial.",
      "Definir categorías de servicio y SLA ciudadanos.",
      "Publicar cortes semanales con estatus y pendientes."
    ],
    expectedImpact: [
      "Mayor transparencia sobre solicitudes en proceso.",
      "Menor sensación de abandono institucional.",
      "Mejor capacidad para priorizar problemas recurrentes."
    ],
    citizenCta: "Cuéntanos qué trámite o servicio necesita mejor seguimiento en tu colonia."
  }
];

export const postsMock: Post[] = [
  {
    title: "Recorrido con jóvenes emprendedores del centro",
    slug: "recorrido-jovenes-emprendedores-centro",
    excerpt:
      "Escuchamos barreras reales para acceder a empleo, financiamiento y capacitación en la zona centro.",
    body: createBlockContent(
      [
        "Durante el recorrido recogimos inquietudes sobre rentas altas, conectividad, horarios de transporte y falta de difusión para pequeños negocios.",
        { style: "normal" }
      ],
      [
        "La propuesta es construir una mesa permanente entre juventudes, comercios y centros de formación para traducir esas necesidades en rutas concretas.",
        { style: "normal" }
      ]
    ),
    category: "Territorio",
    publishedAt: "2026-04-28",
    readingTime: "4 min",
    featured: true,
    coverImage: createImageWithAlt(
      "/images/media/activity-youth-workshop.png",
      "Jóvenes emprendedores del centro participando en un taller"
    )
  },
  {
    title: "Nueva agenda vecinal para recuperar parques",
    slug: "nueva-agenda-vecinal-para-recuperar-parques",
    excerpt:
      "Presentamos un primer calendario de jornadas comunitarias y actividades para activar espacios públicos.",
    body: createBlockContent(
      [
        "La recuperación de parques no termina con pintura o poda. Necesita programación continua y apropiación por parte de niñas, niños, juventudes y familias.",
        { style: "normal" }
      ],
      [
        "Por eso abriremos convocatorias a clubes deportivos, colectivos culturales y comités de colonia.",
        { style: "normal" }
      ]
    ),
    category: "Comunidad",
    publishedAt: "2026-04-20",
    readingTime: "3 min",
    featured: true,
    coverImage: createImageWithAlt(
      "/images/media/news-park-recovery.png",
      "Familias disfrutando del parque comunitario revitalizado"
    )
  },
  {
    title: "Mesa ciudadana sobre seguridad de proximidad",
    slug: "mesa-ciudadana-seguridad-de-proximidad",
    excerpt:
      "Vecinas y vecinos definieron puntos prioritarios para iluminación, vigilancia y respuesta temprana.",
    body: createBlockContent(
      [
        "La conversación se centró en trayectos escolares, corredores comerciales y calles con baja visibilidad nocturna.",
        { style: "normal" }
      ],
      [
        "La meta es convertir estos insumos en un mapa vivo de intervención barrial con seguimiento público.",
        { style: "normal" }
      ]
    ),
    category: "Seguridad",
    publishedAt: "2026-04-11",
    readingTime: "5 min",
    coverImage: createImageWithAlt(
      "/images/media/news-security-meeting.png",
      "Mesa ciudadana discutiendo seguridad de proximidad en la colonia"
    )
  }
];

export const eventsMock: Event[] = [
  {
    title: "Asamblea abierta en Colonia del Valle",
    slug: "asamblea-abierta-colonia-del-valle",
    type: "Reunión comunitaria",
    summary:
      "Conversación abierta para priorizar servicios urbanos y propuestas de movilidad segura.",
    date: "2026-05-12",
    time: "18:30",
    location: "Parque principal, Colonia del Valle",
    isVirtual: false,
    ctaLabel: "Confirmar asistencia",
    ctaHref: "/sumate"
  },
  {
    title: "Transmisión en vivo: juventud y empleo local",
    slug: "transmision-vivo-juventud-empleo-local",
    type: "Transmisión pública",
    summary:
      "Sesión digital para responder preguntas y presentar la ruta de primer empleo local.",
    date: "2026-05-15",
    time: "19:00",
    location: "Canal oficial",
    isVirtual: true,
    ctaLabel: "Recibir recordatorio",
    ctaHref: "/sumate"
  },
  {
    title: "Recorrido barrial de escucha",
    slug: "recorrido-barrial-de-escucha",
    type: "Recorrido",
    summary:
      "Visita a colonias con reportes de alumbrado, limpieza y cruces inseguros.",
    date: "2026-05-18",
    time: "08:00",
    location: "Punto de reunión por confirmar",
    isVirtual: false,
    ctaLabel: "Sumarme al recorrido",
    ctaHref: "/sumate"
  }
];

export const activitiesMock: Activity[] = [
  {
    title: "Asamblea vecinal con agenda de movilidad segura",
    slug: "asamblea-vecinal-agenda-movilidad-segura",
    excerpt:
      "Documentamos acuerdos, prioridades de cruce peatonal y compromisos de seguimiento construidos con vecinas y vecinos.",
    body: createBlockContent(
      [
        "La actividad reunió a familias, comerciantes y juventudes para mapear trayectos inseguros, paradas de transporte con poca visibilidad y cruces donde se necesitan intervenciones rápidas.",
        { style: "normal" }
      ],
      [
        "A partir de la conversación se organizaron tres frentes: señalización prioritaria, gestión de alumbrado y seguimiento territorial con reportes abiertos para la comunidad.",
        { style: "normal" }
      ]
    ),
    activityDate: "2026-05-05",
    publishedAt: "2026-05-06T10:00:00.000Z",
    location: "Parque principal, Colonia del Valle",
    coverImage: createImageWithAlt(
      "/images/media/session-horizontal.png",
      "Mariana Torres conversando con vecinos durante una asamblea vecinal",
      "Vecinas y vecinos priorizaron cruces y trayectos escolares."
    ),
    gallery: [
      createImageWithAlt(
        "/images/media/session-horizontal.png",
        "Mesa de trabajo comunitaria con mapas y notas de prioridades"
      ),
      createImageWithAlt(
        "/images/media/activity-neighborhood-walk.png",
        "Resumen visual con acuerdos de movilidad segura"
      )
    ],
    video: createVideoEmbed(
      "youtube",
      "https://www.youtube.com/watch?v=7tStd8E2x3I",
      "Resumen de la asamblea vecinal"
    ),
    categories: [
      createActivityCategory("Movilidad", "movilidad"),
      createActivityCategory("Participación ciudadana", "participacion-ciudadana")
    ],
    featured: true,
    sourceEvent: {
      title: eventsMock[0].title,
      slug: eventsMock[0].slug
    },
    seo: createSeo({
      metaTitle: "Asamblea vecinal y agenda de movilidad segura | Impulso Comunitario",
      metaDescription:
        "Conoce los acuerdos, hallazgos y próximos pasos de la asamblea vecinal sobre movilidad segura en Colonia del Valle.",
      ogImage: createImageWithAlt(
        "/images/media/session-horizontal.png",
        "Asamblea vecinal sobre movilidad segura"
      ),
      canonical:
        "http://localhost:3000/actividades/asamblea-vecinal-agenda-movilidad-segura",
      noindex: false
    })
  },
  {
    title: "Recorrido territorial por puntos de alumbrado y limpieza",
    slug: "recorrido-territorial-puntos-alumbrado-limpieza",
    excerpt:
      "Levantamos incidencias en calles con baja iluminación, acumulación de residuos y reportes vecinales pendientes.",
    body: createBlockContent(
      [
        "Durante el recorrido se levantó un registro fotográfico y vecinal para ubicar los tramos con mayor sensación de abandono, especialmente alrededor de escuelas y corredores comerciales.",
        { style: "normal" }
      ],
      [
        "La información quedará integrada a una bitácora territorial para priorizar acciones de mantenimiento y respuesta comunitaria.",
        { style: "normal" }
      ]
    ),
    activityDate: "2026-05-03",
    publishedAt: "2026-05-04T14:30:00.000Z",
    location: "Colonias San Miguel Norte y Centro",
    coverImage: createImageWithAlt(
      "/images/media/activity-neighborhood-walk.png",
      "Equipo territorial durante un recorrido barrial de diagnóstico"
    ),
    gallery: [
      createImageWithAlt(
        "/images/media/news-security-meeting.png",
        "Mapa de incidencias levantadas durante el recorrido"
      )
    ],
    categories: [
      createActivityCategory("Servicios públicos", "servicios-publicos"),
      createActivityCategory("Territorio", "territorio")
    ],
    featured: true,
    sourceEvent: {
      title: eventsMock[2].title,
      slug: eventsMock[2].slug
    },
    seo: createSeo({
      metaTitle: "Recorrido territorial de alumbrado y limpieza | Impulso Comunitario",
      metaDescription:
        "Revisa el diagnóstico levantado en territorio sobre alumbrado, limpieza y seguimiento de incidencias barriales.",
      noindex: false
    })
  },
  {
    title: "Encuentro con juventudes sobre primer empleo local",
    slug: "encuentro-juventudes-primer-empleo-local",
    excerpt:
      "Compartimos necesidades de capacitación, vacantes cercanas y acompañamiento para abrir oportunidades reales de inserción laboral.",
    body: createBlockContent(
      [
        "El encuentro permitió identificar barreras concretas para acceder al primer empleo: falta de experiencia previa, poca visibilidad de vacantes y escasa orientación para entrevistas y habilidades laborales.",
        { style: "normal" }
      ],
      [
        "Se acordó construir una ruta piloto de vinculación con comercios, mentorías y sesiones de preparación para juventudes de la comunidad.",
        { style: "normal" }
      ]
    ),
    activityDate: "2026-04-29",
    publishedAt: "2026-04-30T09:00:00.000Z",
    location: "Casa comunitaria de San Miguel",
    coverImage: createImageWithAlt(
      "/images/media/activity-youth-workshop.png",
      "Mesa de diálogo con jóvenes sobre empleo local y capacitación"
    ),
    gallery: [],
    video: createVideoEmbed(
      "facebook",
      "https://www.facebook.com/watch/?v=1029384756",
      "Testimonios del encuentro con juventudes"
    ),
    categories: [
      createActivityCategory("Juventud y empleo", "juventud-empleo")
    ],
    seo: createSeo({
      metaTitle: "Encuentro con juventudes y primer empleo local | Impulso Comunitario",
      metaDescription:
        "Conoce las necesidades y acuerdos del encuentro comunitario enfocado en primer empleo local para juventudes.",
      noindex: false
    })
  }
];

export const pressReleasesMock: PressRelease[] = [
  {
    title: "Presentación de la agenda de seguridad de proximidad",
    slug: "agenda-seguridad-de-proximidad",
    excerpt:
      "Documento con prioridades, enfoque territorial y cronograma de trabajo comunitario.",
    publishedAt: "2026-04-30",
    summary:
      "La agenda integra prevención, iluminación, activación comunitaria y métricas de seguimiento ciudadano.",
    downloadUrl: "/docs/kit-prensa.txt",
    downloadFile: createFileWithAsset("/docs/kit-prensa.txt")
  },
  {
    title: "Lanzamiento del programa primer empleo local",
    slug: "lanzamiento-primer-empleo-local",
    excerpt:
      "Se anunciaron alianzas con comercios, mentores y centros de formación para juventudes.",
    publishedAt: "2026-04-22",
    summary:
      "La iniciativa conectará vacantes, capacitación breve y mentoría para acelerar inserción laboral.",
    downloadUrl: "/docs/kit-prensa.txt",
    downloadFile: createFileWithAsset("/docs/kit-prensa.txt")
  }
];

export const mediaAssetsMock: MediaAsset[] = [
  {
    title: "Sesión oficial horizontal",
    kind: "photo",
    description: "Fotografía oficial para uso en medios y publicaciones digitales.",
    fileUrl: "/images/media/session-horizontal.png",
    image: createImageWithAlt(
      "/images/media/session-horizontal.png",
      "Fotografia oficial horizontal para prensa"
    )
  },
  {
    title: "Logotipo institucional",
    kind: "logo",
    description: "Versión principal del logotipo en formatos para prensa.",
    fileUrl: "/logos/logo-principal.svg",
    image: createImageWithAlt(
      "/logos/logo-principal.svg",
      "Logotipo institucional principal"
    )
  },
  {
    title: "Ficha de prensa descargable",
    kind: "document",
    description: "Documento breve con información institucional para cobertura y referencia rápida.",
    fileUrl: "/docs/kit-prensa.txt",
    file: createFileWithAsset("/docs/kit-prensa.txt")
  }
];

export const faqsMock: FAQ[] = [
  {
    question: "¿Cómo puedo participar sin afiliarme?",
    answer:
      "Puedes asistir a recorridos, compartir propuestas, sumarte como voluntario por proyecto o recibir información puntual sobre actividades públicas."
  },
  {
    question: "¿Las propuestas tienen seguimiento público?",
    answer:
      "Sí. La plataforma está diseñada para publicar prioridades, avances, agenda y noticias con un lenguaje claro y trazable."
  }
];

export const contactTopics: ContactTopic[] = [
  { label: "Servicios públicos", value: "servicios-publicos" },
  { label: "Seguridad", value: "seguridad" },
  { label: "Juventud y empleo", value: "juventud-empleo" },
  { label: "Espacio público", value: "espacio-publico" },
  { label: "Prensa y medios", value: "prensa-medios" },
  { label: "Otro tema", value: "otro" }
];

export const volunteerAreas: VolunteerArea[] = [
  { label: "Activación territorial", value: "territorio" },
  { label: "Redes sociales", value: "redes" },
  { label: "Logística de eventos", value: "logistica" },
  { label: "Diseño y contenido", value: "contenido" },
  { label: "Defensa del voto", value: "defensa-voto" }
];

export const availabilityOptions: AvailabilityOption[] = [
  { label: "Entre semana por las tardes", value: "tardes-semana" },
  { label: "Fines de semana", value: "fines-semana" },
  { label: "Disponibilidad flexible", value: "flexible" }
];
