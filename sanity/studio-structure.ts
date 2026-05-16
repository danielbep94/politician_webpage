import type { StructureResolver } from "sanity/desk";

export const siteSettingsDocumentId = "siteSettings.main";

export const singletonTypes = new Set(["siteSettings"]);

export const singletonActions = new Set([
  "publish",
  "discardChanges",
  "restore"
]);

export const studioStructure: StructureResolver = (S) => {
  const singletonItem = (
    schemaType: string,
    title: string,
    documentId: string
  ) =>
    S.listItem()
      .id(schemaType)
      .title(title)
      .child(S.document().schemaType(schemaType).documentId(documentId));

  return S.list()
    .title("Contenido")
    .items([
      singletonItem("siteSettings", "Configuracion del sitio", siteSettingsDocumentId),
      S.divider(),
      S.listItem()
        .id("editorial")
        .title("Editorial")
        .child(
          S.list()
            .title("Editorial")
            .items([
              S.documentTypeListItem("activity").title("Actividades"),
              S.documentTypeListItem("event").title("Agenda"),
              S.documentTypeListItem("post").title("Noticias"),
              S.documentTypeListItem("pressRelease").title("Comunicados"),
              S.documentTypeListItem("mediaAsset").title("Kit de prensa")
            ])
        ),
      S.listItem()
        .id("institutional")
        .title("Institucional")
        .child(
          S.list()
            .title("Institucional")
            .items([
              S.documentTypeListItem("candidate").title("Perfil publico"),
              S.documentTypeListItem("proposal").title("Propuestas"),
              S.documentTypeListItem("faq").title("Preguntas frecuentes")
            ])
        ),
      S.listItem()
        .id("operations")
        .title("Operacion")
        .child(
          S.list()
            .title("Operacion")
            .items([
              S.documentTypeListItem("contactMessage").title("Mensajes de contacto"),
              S.documentTypeListItem("volunteerLead").title("Leads de voluntariado")
            ])
        )
    ]);
};
