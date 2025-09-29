// sanity/deskStructure.ts (ถ้าใช้)
import S from '@sanity/desk-tool/structure-builder'
export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Site Settings').child(
        S.editor().schemaType('siteSettings').documentId('siteSettings')
      ),
      S.listItem().title('Page: Goldflow').child(
        S.editor().schemaType('pageGoldflow').documentId('pageGoldflow')
      ),
      S.divider(),
      S.documentTypeListItem('review').title('Review'),
      // … อื่น ๆ เช่น promo ที่คุณทำไว้แล้ว
    ])
