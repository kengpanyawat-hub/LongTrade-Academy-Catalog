// sanity/schemas/deskStructure.ts
// ✅ Sanity v3 style – ไม่ใช้ @sanity/desk-tool/structure-builder แล้ว
import type { StructureResolver } from "sanity/desk";

// ปรับรายการเมนูตามชนิด document ที่คุณมีจริงในโปรเจกต์ได้
const deskStructure: StructureResolver = (S /*, context */) =>
  S.list()
    .title("Content")
    .items([
      // ตัวอย่างรายการ (ลบ/เพิ่มได้ตาม schema ที่มีจริง)
      S.documentTypeListItem("promo").title("Promo"),
      S.documentTypeListItem("review").title("Review"),
      S.documentTypeListItem("siteSettings").title("Site Settings"),

      S.divider(),

      S.documentTypeListItem("indicator").title("Indicators"),
      S.documentTypeListItem("ebook").title("Ebooks"),
      S.documentTypeListItem("ea").title("EA"),
      S.documentTypeListItem("course").title("Courses"),
      S.documentTypeListItem("article").title("Articles"),
    ]);

export default deskStructure;
