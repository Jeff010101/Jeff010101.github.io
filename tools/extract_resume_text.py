from __future__ import annotations

from pathlib import Path

from pypdf import PdfReader


def main() -> None:
    pdf_path = Path(__file__).resolve().parents[1] / "static" / "uploads" / "main_noname_en.pdf"
    reader = PdfReader(str(pdf_path))

    print(f"PDF: {pdf_path}")
    print(f"Pages: {len(reader.pages)}")

    all_text: list[str] = []
    for i, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        all_text.append(f"\n\n--- PAGE {i} ---\n{text}")

    joined = "".join(all_text)

    # Print a lot, but keep terminal output manageable.
    print(joined[:40000])
    print(f"\n\n[TRUNCATED] total_chars={len(joined)}")


if __name__ == "__main__":
    main()
